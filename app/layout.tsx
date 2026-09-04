import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MortgageOps",
  description: "Mortgage operations, credit and financial control platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
