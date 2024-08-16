export default function MyProgramLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section> {children}</section>;
}
