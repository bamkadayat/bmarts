import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.created":
        handlePaymentIntentCreated(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.processing":
        handlePaymentIntentProcessing(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.canceled":
        handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Error processing event:", err);
    return NextResponse.json(
      { error: "Error processing webhook event" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

// Event Handlers
function handlePaymentIntentCreated(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment intent created: ${paymentIntent.id}`);
}

function handlePaymentIntentProcessing(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment intent processing: ${paymentIntent.id}`);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment intent succeeded: ${paymentIntent.id}`);
  try {
    const session = await stripe.checkout.sessions.retrieve(
      paymentIntent.metadata.session_id
    );
    await handleCheckoutSessionCompleted(session);
  } catch (err) {
    console.error("Error handling payment intent succeeded:", err);
  }
}

function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error(`Payment intent failed: ${paymentIntent.id}`);
}

function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment intent canceled: ${paymentIntent.id}`);
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
    console.log("Processing session for customer:", customerEmail);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: customerEmail },
      });

      if (!user) {
        throw new Error(`User with email ${customerEmail} not found`);
      }

      const totalAmount = session.amount_total
        ? session.amount_total / 100
        : 0;

      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          status: "PAID",
          stripeId,
          orderItems: {
            create: lineItems.map(
              (item: { id: string; quantity: number; price: number }) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
              })
            ),
          },
        },
      });

      console.log("Order created successfully:", order);
    });
  } catch (err) {
    console.error("Error handling checkout session:", err);
    throw err;
  }
}
