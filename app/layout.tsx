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
  keywords: [
    "Alalmacén",
    "Almacen app",
    "beneficios",
    "puntos",
    "recompensas",
    "descuentos",
    "productos premium",
    "experiencias únicas",
    "fidelización de clientes",
    "gourmet",
    "córdoba",
    "villa maría",
    "compras",
    "almacén de barrio",
    "tienda local",
    "sabores excepcionales",
    "vinos selectos",
  ],
  authors: [{ name: "Eneas Baroni" }],
  creator: "Eneas Baroni",
  other: {
    developer:
      "Sitio desarrollado por Eneas Baroni | https://www.eneasbaroni.com.ar/",
  },
  openGraph: {
    title: "Alalmacén",
    description: "Almacén app. Tu tienda de beneficios.",
    url: "/",
    siteName: "Alalmacén",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/logoC.png",
        width: 1200,
        height: 630,
        alt: "Logo de Alalmacén",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alalmacén | Almacén app",
    description: "Almacén app. Tu tienda de beneficios.",
    images: ["/logoC.png"],
  },
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
