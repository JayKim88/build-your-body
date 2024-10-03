export default function CommunitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex">{children}</section>;
}
