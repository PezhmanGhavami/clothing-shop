import { Metadata } from "next";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";

import ThemeProvider from "@/context/theme.context";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL as string),
  title: {
    default: "Clothing Shop - A demo clothing shop",
    template: "%s | Clothing Shop - A demo clothing shop",
  },
  description: "A demo clothing shop made for educational purposes",
  keywords:
    "cloth, clothing, shop, clothing shop, mens clothing, womens clothing, demo",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      "/favicon.ico",
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
    },
  },
  openGraph: {
    title: {
      default: "Clothing Shop - A demo clothing shop",
      template: "%s | Clothing Shop - A demo clothing shop",
    },
    description: "A demo clothing shop made for educational purposes",
    images:
      "https://res.cloudinary.com/drsgyshsf/image/upload/v1674136825/clothing-shop/og-and-tc/clothing-shop-mockup-og_pbf8jn.png",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Clothing Shop - A demo clothing shop",
      template: "%s | Clothing Shop - A demo clothing shop",
    },
    description: "A demo clothing shop made for educational purposes",
    images:
      "https://res.cloudinary.com/drsgyshsf/image/upload/v1674136825/clothing-shop/og-and-tc/clothing-shop-mockup-tc_pndvba.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
