export default function MyProgramLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex w-full"> {children}</section>;
}
