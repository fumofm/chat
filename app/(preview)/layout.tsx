import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { AI } from "./actions";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-rsc-genui.vercel.dev"),
  title: "Land Rover Concierge",
  description: "Explore the legendary Land Rover lineup with your personal concierge. Discover luxury SUVs built to conquer any terrain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        <AI>{children}</AI>
      </body>
    </html>
  );
}
