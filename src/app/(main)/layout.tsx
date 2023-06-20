import Navbar from "@/components/navbar/navbar.component";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="h-full grow border-t dark:border-t-slate-700">
        {children}
      </main>
    </>
  );
}
