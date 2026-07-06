import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NavigationProgress } from "@/components/NavigationProgress";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const medium = localFont({
  src: "../public/fonts/BeaufortforLOL-Medium.otf",
  variable: "--font-medium",
  preload: true,
  display: "block",
});

export const metadata = {
  title: "League of Legends",
  description: "League of Legends Client Clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/LOL_Icon_Rendered.png" />
        <link
          rel="preload"
          href="/fonts/BeaufortforLOL-Bold.otf"
          as="font"
          type="font/otf"
          crossorigin
        />
        <link
          rel="preload"
          href="/fonts/BeaufortforLOL-Medium.otf"
          as="font"
          type="font/otf"
          crossorigin
        />
      </head>

      <body className={`${inter.variable} ${medium.variable}`}>
        <Providers>
          {children}
          <NavigationProgress />
        </Providers>
      </body>
    </html>
  );
}
