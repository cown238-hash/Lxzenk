// app/layout.js
// The frame around every page: fonts, header and footer.
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata = {
  title: { default: "KONRXVDO — image library", template: "%s · KONRXVDO" },
  description: "Upload, browse, search and share your images.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh font-display text-paper antialiased">
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 pb-10 font-mono text-xs text-muted sm:px-6">
          KONRXVDO · stored on Netlify Blobs + Netlify Database
        </footer>
      </body>
    </html>
  );
}
