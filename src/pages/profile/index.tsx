import { useState, ReactElement } from "react";
import { useRouter } from "next/router";
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
        <p>Addresses</p>
        <p>Orders</p>
        <p>Transactions</p>
        <p>Edit Profile</p>
        <p>Reviews</p>
        <p>Privacy Policy</p>
        <p>Terms and Conditions</p>
        <p>
          Authentication (Change Password, Email, Phone)
        </p>
        <a
          className="bg-red-500"
          href="/api/auth/logout"
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
        >
          {isLoading ? <Loading /> : "Logout"}
        </a>
      </div>
    </div>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Profile;
