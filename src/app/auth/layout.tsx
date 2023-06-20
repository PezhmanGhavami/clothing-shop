import Link from "next/link";

import Footer from "@/components/footer/footer.component";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col items-center justify-start pt-8">
          <div className="pb-6 pt-8 text-3xl font-medium uppercase tracking-wide lg:p-4">
            <Link href={"/"}>Clothing Shop</Link>
          </div>
          {children}
        </div>
        <div className="border-t dark:border-t-slate-700">
          <Footer />
        </div>
      </div>
    </div>
  );
}
