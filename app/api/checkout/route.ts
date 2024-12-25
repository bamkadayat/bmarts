import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const SECRET_KEY = "sk_test_51QZ9MWPNpVE7D0Q8SOkPFvsvmeiLpDiUzWbMlWlxmz0bA1vynEKJqOhmIegGT5FDXp6g36IVp8C54xJ3sxsyTlvG00mgS6kCpt"

const stripe = new Stripe(SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userEmail = body.userEmail || ""; 
    // Validate that `body.items` exists and is an array
    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    // Format `line_items` for Stripe
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

    // Minimize metadata by including only essential information
    const metadata = {
      items: JSON.stringify(
        body.items.map((item: { id: string; quantity: number }) => ({
          id: item.id,
          quantity: item.quantity,
        }))
      ),
    };

    // Create Stripe session
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