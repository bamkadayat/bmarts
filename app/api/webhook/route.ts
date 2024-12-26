import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Error processing event:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Error processing webhook event" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

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
    await prisma.$transaction(async (tx) => {
      // Find the user by email
      const user = await tx.user.findUnique({
        where: { email: customerEmail },
      });

      if (!user) {
        throw new Error(`User with email ${customerEmail} not found`);
      }

      // Calculate total amount
      const totalAmount = session.amount_total
        ? session.amount_total / 100
        : 0;

      // Create the order and its items
      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          status: "PAID",
          stripeId,
          orderItems: {
            create: lineItems.map(
              (item: { id: string; quantity: number; price: number }) => {
                if (!item.price) {
                  throw new Error(`Missing price for productId: ${item.id}`);
                }
                return {
                  productId: item.id,
                  quantity: item.quantity,
                  price: item.price,
                };
              }
            ),
          },
        },
      });

      // Reduce stock for each product
      for (const item of lineItems) {
        const updatedProduct = await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        // Ensure stock does not go negative
        if (updatedProduct.stock < 0) {
          throw new Error(
            `Insufficient stock for productId: ${item.id}. Stock cannot go negative.`
          );
        }
      }

      console.log("Order and stock updated successfully:", order);
    });
  } catch (err) {
    console.error("Error handling checkout session:", err);
    throw err;
  }
}
