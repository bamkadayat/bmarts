import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
  
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
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        metadata: {
          items: JSON.stringify(body.items), // Pass cart items as metadata
        },
      });
  
      return NextResponse.json({ sessionId: session.id });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
  }