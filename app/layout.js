import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { ArmaCartProvider } from "./context/ArmaCartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { ArmaItemsProvider } from "./context/ArmaItemsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dolce Giftbox | Regalos y detalles personalizados",
  description: "Cajas de regalo, ramos de flores y detalles personalizados con envío en Medellín y todo Colombia.",
  metadataBase: new URL("https://www.dolcegiftbox.com"),
  openGraph: {
    title: "Dolce Giftbox | Regalos y detalles personalizados",
    description: "Cajas de regalo, ramos de flores y detalles personalizados con envío en Medellín y todo Colombia.",
    url: "https://www.dolcegiftbox.com",
    siteName: "Dolce Giftbox",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dolce Giftbox | Regalos y detalles personalizados",
    description: "Cajas de regalo, ramos de flores y detalles personalizados con envío en Medellín y todo Colombia.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
       <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}> 
    <body>
            <ProductsProvider><ArmaItemsProvider><CartProvider><ArmaCartProvider>{children}</ArmaCartProvider></CartProvider></ArmaItemsProvider></ProductsProvider>
</body>
    </html>
  );
}
