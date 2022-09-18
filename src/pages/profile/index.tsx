import { useState, ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

import Layout from "../../components/layout/layout.component";
import Loading from "../../components/loading/loading.component";

import useUser from "../../hooks/useUser";

const Profile: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

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
      </div>
    </div>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Profile;
