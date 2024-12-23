import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  console.log("Received payload:", payload);
  console.log("Received signature:", sig);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Webhook signature verification failed:", err.message);
    } else {
      console.error("Webhook signature verification failed:", err);
    }
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // Process the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error processing event:", err.message);
      return NextResponse.json({ error: `Webhook handler error: ${err.message}` }, { status: 500 });
    } else {
      console.error("Unknown error processing event");
      return NextResponse.json({ error: "Unknown error processing event" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// Handle checkout session completion
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_email || "";
  const stripeId = session.id;
  const lineItems = session.metadata?.items
    ? JSON.parse(session.metadata.items)
    : [];

  if (!customerEmail || !lineItems.length) {
    throw new Error("Invalid session metadata or missing customer email");
  }

  try {
    console.log("Processing session for customer:", customerEmail);

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: customerEmail },
      });

      if (!user) {
        throw new Error(`User with email ${customerEmail} not found`);
      }

      const totalAmount = session.amount_total ? session.amount_total / 100 : 0;

      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          status: "PAID",
          stripeId,
          orderItems: {
            create: lineItems.map((item: { id: string; quantity: number; price: number }) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      console.log("Order created successfully:", order);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error handling checkout session in transaction:", err.message);
      throw new Error(`Transaction error: ${err.message}`);
    } else {
      console.error("Unknown error handling checkout session in transaction");
      throw new Error("Unknown transaction error");
    }
  }
}
