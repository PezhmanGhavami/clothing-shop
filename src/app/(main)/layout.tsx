import Navbar from "@/components/navbar/navbar.component";
import Footer from "@/components/footer/footer.component";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="h-full grow border-y dark:border-y-slate-700">
        {children}
      </main>
      <Footer />
    </div>
  );
}
