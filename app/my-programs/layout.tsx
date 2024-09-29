export default function MyProgramsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex">{children}</section>;
}
