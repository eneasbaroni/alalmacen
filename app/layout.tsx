import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import localfont from "next/font/local";
import "./globals.css";
import { Providers } from "./Providers";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alalmacén",
  description: "Almacén app. Tu tienda de beneficios.",
};

// Fuentes
const roslindale = localfont({
  src: [
    {
      path: "../fonts/roslindale-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/roslindale-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/roslindale-regular-italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-roslindale",
});

const clashDisplay = localfont({
  src: [
    {
      path: "../fonts/ClashDisplay-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/ClashDisplay-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/ClashDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ClashDisplay-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/ClashDisplay-Bold.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${roslindale.variable} ${clashDisplay.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
