export default function MyProgramsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex justify-center">{children}</section>;
}
