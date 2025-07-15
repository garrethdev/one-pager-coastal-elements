import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora, Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Realtor AI - Join the Waitlist",
  description: "Revolutionary AI-powered real estate platform by Coastal Elements. Join the waitlist to be the first to experience the future of real estate.",
  keywords: "realtor, AI, real estate, artificial intelligence, property, waitlist",
  authors: [{ name: "Coastal Elements" }],
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
