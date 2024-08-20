export default function CompleteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section> {children}</section>;
}
