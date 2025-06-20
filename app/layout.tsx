import type { Metadata } from "next";
import { Anton } from "next/font/google";

import "./globals.css";
import AuthContext from "./context/AuthContext";
import { YoutubeModal } from "./component/YoutubeModal";
import { Menu } from "./component/Menu";

const inter = Anton({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Build Your Body",
  description: "Make your own exercise programs and just do it",
  creator: "Jay Kim",
  keywords: [
    "Training",
    "Home Training",
    "Discipline",
    "Fitness",
    "Workout",
    "Strength Training",
    "Muscle Building",
    "Personal Training",
    "Cardio",
  ],
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
            <main className="pl-6 pr-6 md:pl-[60px] md:pr-[50px] pt-[30px] pb-[50px] h-full w-full">
              {children}
            </main>
          </AuthContext>
        </body>
      </html>
    </>
  );
}
