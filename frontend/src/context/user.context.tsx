import {
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";

interface IUser {
  displayName?: string;
  email?: string;
  token?: string;
  id?: string;
}
interface IUserState {
  currentUser: IUser | null;
}
// export interface IUserRegister extends IUserLogin {
//   displayName: string;
//   confirmPassword: string;
// }

const user = localStorage.getItem("user");
const parsedUser = user ? JSON.parse(user) : null;

const INITIAL_STATE: IUserState = {
  currentUser: parsedUser,
};

interface IUserContext {
  userState: IUserState;
  setActiveUser: (newUser: IUser) => void;
  signOutUser: () => void;
}
export const UserContext = createContext<IUserContext>(
  {} as IUserContext
);

interface IUserProvider {
  children: ReactNode;
}

export const UserProvider = ({
  children,
}: IUserProvider) => {
  const [userState, setUserState] = useState({
    ...INITIAL_STATE,
  });

  const { currentUser } = userState;

  //TODO - Handle re-login here
  useEffect(() => {
    if (currentUser !== null) {
      //fetch("/users/me").catch(() => {});
    }
  }, []);

  function setActiveUser(newUser: IUser) {
    localStorage.setItem("user", JSON.stringify(user));
    setUserState((prev) => ({
      ...prev,
      currentUser: { ...newUser },
    }));
  }

  function signOutUser() {
    if (currentUser) {
      if (window.confirm("Are sure you want to log out?")) {
        const headers = new Headers({
          Authorization: `Bearer ${currentUser.token}`,
        });
        fetch("/users/logout", { method: "POST", headers })
          .then(() => {
            localStorage.removeItem("user");
            return setUserState((prev) => ({
              ...prev,
              currentUser: null,
            }));
          })
          .catch((err) => console.log(err.message));
        //TODO - Handle error and notify user (probably with toastify)
      }
    }
  }

  const value = { userState, setActiveUser, signOutUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
