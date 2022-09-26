import { useState, ReactElement } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextPageWithLayout } from "../_app";

import Layout from "../../components/layout/layout.component";
import Loading from "../../components/loading/loading.component";

import useUser from "../../hooks/useUser";
import fetcher from "../../utils/fetcher";

const Profile: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { user, mutateUser } = useUser();
  const router = useRouter();

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="p-2">
      <div className="mb-4">
        <p>Reviews</p>
        <p>
          Authentication (Change Password, Email, Phone)
        </p>

        <div>
          <Link href="/api/auth/logout" passHref>
            <a
              onClick={async (e) => {
                e.preventDefault();
                setIsLoading(true);
                mutateUser(
                  await fetcher("/api/auth/logout", {
                    method: "POST",
                  }),
                  false
                );
                setIsLoading(false);
                router.push("/auth/signin");
              }}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium tracking-tight h-9 w-full rounded-md shadow-md"
            >
              {isLoading ? <Loading /> : "Logout"}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Profile;
