import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../context/user.context";
import Loading from "../../components/loading/loading.component";

function Profile() {
  const { userState, signOutUser } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userState.currentUser) {
      navigate("/", { replace: true });
    }
  }, [userState.currentUser]);

  const handleSignOut = async () => {
    setIsLoading(true);
    if (userState.currentUser) {
      try {
        const headers = new Headers({
          Authorization: `Bearer ${userState.currentUser.token}`,
        });
        const signOutRes = await fetch(
          "/api/users/logout",
          {
            method: "POST",
            headers,
          }
        );
        if (signOutRes.ok) {
          navigate("/", { replace: true });
          return signOutUser();
        }
        alert(signOutRes.statusText);
      } catch (err) {
        if (typeof err === "string") {
          console.log(err);
        } else if (err instanceof Error) {
          console.log(err.message);
        }
      }
      //TODO - Handle error and notify user (probably with toastify)
    }
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
