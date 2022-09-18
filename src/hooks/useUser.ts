import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import fetcher from "../utils/fetcher";
import { IUser } from "../pages/api/auth/index";

const redirectRoutes = ["/auth/signin", "/auth/signup"];

export default function useUser() {
  const { data, mutate } = useSWR<IUser>(
    "/api/auth",
    fetcher
  );

  const router = useRouter();

  useEffect(() => {
    if (
      data?.isLoggedIn &&
      redirectRoutes.includes(router.pathname)
    ) {
      router.replace("/profile");
    }
    if (
      !data?.isLoggedIn &&
      router.pathname.startsWith("/profile")
    ) {
      router.replace("/auth/signin");
    }
  }, [data, router]);

  return {
    user: data,
    mutateUser: mutate,
  };
}
