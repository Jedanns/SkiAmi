import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "SkiAmi – Val Cenis",
  description:
    "Séjour ski entre amis à Val Cenis · 28 décembre – 3 janvier · 8 amis, 7 jours de glisse, des souvenirs pour la vie.",
  keywords: ["ski", "val cenis", "séjour", "montagne", "amis", "hiver"],
  openGraph: {
    title: "SkiAmi – Val Cenis",
    description: "Séjour ski entre amis à Val Cenis",
    type: "website",
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <Toaster />
      </body>
    </html>
  );
}
