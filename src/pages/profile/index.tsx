import { useState } from "react";
import { useRouter } from "next/router";

import Loading from "../../components/loading/loading.component";

function Profile() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    console.log("signout?");
    setIsLoading(false);
  };

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
      <button
        type="button"
        onClick={handleSignOut}
        className="bg-rose-700 hover:bg-rose-800 active:bg-rose-900 rounded-md h-8 font-bold w-full"
      >
        {isLoading ? <Loading /> : "Logout"}
      </button>
    </div>
  );
}

export default Profile;
