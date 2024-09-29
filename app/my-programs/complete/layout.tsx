export default function CompleteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex"> {children}</section>;
}
