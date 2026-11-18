import type { Metadata } from "next";
import { Lora, Playfair_Display, Sacramento } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thanksgiving Potluck · The Savino-Lopera Household",
  description: "Sign up to bring a dish to our little Thanksgiving party — Nov 26th, 5:30 PM.",
  openGraph: {
    title: "We're rounding up the gang for a little Thanksgiving Party!",
    description: "Nov 26th · 5:30 PM · Sign up to bring a dish",
    images: ["/turkeys.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sacramento.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
