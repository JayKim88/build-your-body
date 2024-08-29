// import type { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Build Your Body",
//   description: "Make your own exercise programs and do it",
// };

export default function ExercisesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex justify-center">{children}</section>;
}
