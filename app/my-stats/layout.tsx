export default function MyStatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex">{children}</section>;
}
