import type { Metadata } from "next";
import "./globals.css";
import ClientOnly from "@/components/client-only";
import { Toaster } from "sonner";
import { Providers } from "./providers/provider";

export const metadata: Metadata = {
  title: "Passmark SuperAdmin",
  description: "Admin Dashboard of Passmark SuperAdmin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Toaster />
        <ClientOnly>
          <Providers>{children}</Providers>
        </ClientOnly>
      </body>
    </html>
  );
}
