import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { getServerSession } from "@/utils/session";

async function getUserSession() {
  const headersList = headers();
  const cookieStore = cookies();
  const session = await getServerSession(headersList, cookieStore);

  return session.user ? true : false;
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userExists = await getUserSession();

  if (userExists) {
    return redirect("/");
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
