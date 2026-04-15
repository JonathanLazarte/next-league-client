import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { NavigationProgress } from "@/components/NavigationProgress";

const inter = Inter({ subsets: ["latin"] });
const bold = localFont({
  src: "../public/fonts/BeaufortforLOL-Bold.otf",
  display: "swap",
  variable: "--bold",
});

export const metadata = {
  title: "League of Legends",
  description: "League of Legends Client Clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="preload"
          href="/fonts/BeaufortforLOL-Bold.otf"
          as="font"
          type="font/otf"
          crossorigin
        />
      </head>

      <body className={inter.className}>
        <Providers>
          {children}
          <NavigationProgress />
        </Providers>
      </body>
    </html>
  );
}
