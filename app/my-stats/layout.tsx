export default function MyStatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex justify-center">{children}</section>;
}
