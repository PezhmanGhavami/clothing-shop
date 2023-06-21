import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";

import fetcher from "@/utils/fetcher";
import { IUser } from "@/app/api/auth/route";

const redirectRoutes = ["/auth/signin", "/auth/signup"];

export default function useUser() {
  const { data, mutate } = useSWR<IUser>("/api/auth", fetcher);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (data?.isLoggedIn && redirectRoutes.includes(pathname)) {
      router.replace("/");
    }
    // if (
    //   !data?.isLoggedIn &&
    //   router.pathname.startsWith("/profile")
    // ) {
    //   router.replace("/auth/signin");
    // }
  }, [data, router, pathname]);

  return {
    user: data,
    mutateUser: mutate,
  };
}
