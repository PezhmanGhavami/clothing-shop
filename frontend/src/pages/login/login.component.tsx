import {
  useContext,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";

import { UserContext } from "../../context/user.context";

import Loading from "../../components/loading/loading.component";
import Logo from "../../components/logo/logo.component";

interface IUserLoginFrom {
  email: string;
  password: string;
}

const defaultFormFields = {
  email: "",
  password: "",
};

const inputContainerClasses = "mb-4 relative";
const labelClasses = "block pb-1";
const inputClasses =
  "w-full h-9 rounded-md px-2 bg-slate-900 border border-slate-600 focus:outline-none focus:ring focus:ring-blue-400 focus:bg-neutral-900";

function Login() {
  const { userState, setActiveUser } =
    useContext(UserContext);

  const [formFields, setFormFields] =
    useState<IUserLoginFrom>(defaultFormFields);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  type FormFieldsKey = keyof typeof formFields;

  const { email, password } = formFields;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormFields((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    let everyThingIsFine = true;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email === "" || !email || !emailRegex.test(email)) {
      alert("Invalid email address.");
      everyThingIsFine = false;
    }

    if (password === "" || !password) {
      alert("You should provide a password.");
      everyThingIsFine = false;
    }

    return everyThingIsFine;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      email,
      password,
    };

    // fetch()
  };

  if (userState.currentUser) {
    return <Navigate to={"/"} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-slate-900 text-slate-100">
      <Logo />
      <p className="pb-4 text-lg">
        Sign in to Clothing Shop
      </p>
      <form
        onSubmit={handleSubmit}
        className="border border-slate-600 rounded-xl flex flex-col justify-around p-4 w-3/4"
      >
        {/* inputs container */}
        <div>
          {/* Email container */}
          <div className={inputContainerClasses}>
            <label
              className={labelClasses}
              htmlFor={"sign-in-email"}
            >
              Email
            </label>
            <input
              className={inputClasses}
              type="email"
              name="email"
              id="sign-in-email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Password container */}
          <div className={inputContainerClasses}>
            <label
              className={labelClasses}
              htmlFor={"sign-in-password"}
            >
              Password{" "}
              <Link
                className="text-blue-400 float-right"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </label>
            <input
              className={inputClasses + " pr-8"}
              type={`${showPassword ? "text" : "password"}`}
              name="password"
              id="sign-in-password"
              value={password}
              onChange={handleChange}
              required
            />
            {/* Show password button */}
            <span
              className="absolute cursor-pointer top-8 right-1 p-1"
              onClick={toggleShowPassword}
              title={`Click to ${
                showPassword ? "Hide" : "Show"
              } Password`}
            >
              {showPassword ? (
                <BiShow className="text-lg" />
              ) : (
                <BiHide className="text-lg" />
              )}
            </span>
          </div>
        </div>
        {/* Login button */}
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 rounded-md h-9 font-bold w-full"
        >
          Login
        </button>
      </form>
      {/* Link to sign up */}
      <div className="border border-slate-600 rounded-xl flex items-center justify-around px-4 mt-4 w-3/4 h-12">
        <p>
          {"New here? "}
          <Link
            className=" text-blue-400"
            to={"/forgot-password"}
          >
            Create an account
          </Link>
          {" ."}
        </p>
      </div>
    </div>
  );
}

export default Login;
