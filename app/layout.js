import SimpleHeader from "@/components/simple_header";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
});

export const metadata = {
  title: "Générateur GTM Facebook Conversions",
  description: "générateur GTM facebook conversions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} antialiased`}
      >
        <SimpleHeader />
        {children}
      </body>
    </html>
  );
}
