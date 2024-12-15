export const dynamic = "force-dynamic";
import { cookies } from "next/headers"; 
import { jwtVerify } from "jose";
import StoreProvider from "./storeProvider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BM Arts",
  description: "Online art gallery",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let token = null;

  try {
    const cookieStore = await cookies(); 
    token = cookieStore.get("authToken")?.value;

    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret); 
      user = { email: payload.email as string, role: payload.role as string };
    }
  } catch (error) {
    console.error("Failed to verify token:", error);
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider user={user} token={token ?? null}>
          <Header />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
