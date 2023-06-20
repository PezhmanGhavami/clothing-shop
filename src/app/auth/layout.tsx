"use client";

import Link from "next/link";

import Loading from "@/components/loading/loading.component";

import useUser from "../../hooks/useUser";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  if (!user || user.isLoggedIn) {
    return (
      <div className="mx-auto mt-96 text-3xl">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-full grow flex-col justify-between bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
      <div className="flex flex-col items-center justify-start pt-8">
        <div className="pb-6 pt-8 text-3xl font-medium uppercase tracking-wide lg:p-4">
          <Link href={"/"}>Clothing Shop</Link>
        </div>
        {children}
      </div>
    </div>
  );
}
