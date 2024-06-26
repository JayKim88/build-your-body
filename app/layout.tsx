import type { Metadata } from "next";
import { Anton } from "next/font/google";
import "./globals.css";
import AuthContext from "./context/AuthContext";

const inter = Anton({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Build Your Body",
  description: "Make your own exercise programs and do it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  );
}
