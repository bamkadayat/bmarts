import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { loadEnvConfig } from "@next/env";

// Load environment variables in non-serverless environments
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userEmail = body.userEmail || ""; 

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    const lineItems = body.items.map((item: { id: string; quantity: number; price: number; title: string }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const metadata = {
      items: JSON.stringify(
        body.items.map((item: { id: string; quantity: number }) => ({
          id: item.id,
          quantity: item.quantity,
        }))
      ),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { 
        error: "Failed to create checkout session", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null
      },
      { status: 500 }
    );
  }
}
