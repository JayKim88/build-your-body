import type { Metadata } from "next";
import { Anton } from "next/font/google";

import "./globals.css";
import AuthContext from "./context/AuthContext";
import { LoginButton } from "./component/LoginButton";
import { YoutubeModal } from "./component/YoutubeModal";
import { Menu } from "./component/Menu";
import { CartButton } from "./component/CartButton";

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
    <>
      <html lang="en">
        <body className={`${inter.className} relative`}>
          <AuthContext>
            <Menu />
            {/* <YoutubeModal /> */}
            <main className="pl-[60px] pr-[50px] pt-[30px] pb-[50px] h-fit">
              {children}
            </main>
          </AuthContext>
        </body>
      </html>
    </>
  );
}
