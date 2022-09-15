import useSWR from "swr";
import { IUser } from "../pages/api/auth/user";

export default function useUser() {
  const {
    data,
    mutate: mutateUser,
    error,
  } = useSWR<IUser>("/api/auth/user");

  return {
    user: data,
    mutateUser,
    isError: error,
    isLoading: !error && !data,
  };
}
