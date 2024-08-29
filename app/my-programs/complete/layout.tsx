export default function CompleteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex justify-center"> {children}</section>;
}
