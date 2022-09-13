import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiShow, BiHide } from "react-icons/bi";

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

const container =
  "border border-slate-600 rounded-xl flex justify-around p-4 w-3/4 md:w-80";
const inputContainerClasses = "mb-4 relative";
const labelClasses = "block pb-1";
const inputClasses =
  "w-full h-9 rounded-md px-2 bg-slate-900 border border-slate-600 focus:outline-none focus:ring focus:ring-blue-400 focus:bg-neutral-900";
//TODO - Couldn't get the invalid pseudo class work correctly (always active), fix this later

enum inputStatus {
  EMPTY,
  VALID,
  INVALID,
}

function Login() {
  const [formFields, setFormFields] =
    useState<IUserLoginFrom>(defaultFormFields);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //FIXME - location.state causes type error fix it and use the commented codes to do the redirect
  // const location = useLocation();
  const router = useRouter();

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

  const validateForm = (onSubmit: boolean = false) => {
    let formIsValid = true;
    let emailStatus = inputStatus.VALID;
    let passwordStatus = inputStatus.VALID;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email === "" || !email || !emailRegex.test(email)) {
      formIsValid = false;
      emailStatus =
        email === "" || !email
          ? inputStatus.EMPTY
          : inputStatus.INVALID;
      onSubmit &&
        alert(
          emailStatus === inputStatus.EMPTY
            ? "You should provide an email address."
            : "Invalid email address."
        );
    }

    if (password === "" || !password) {
      onSubmit && alert("You should provide a password.");
      formIsValid = false;
      passwordStatus = inputStatus.EMPTY;
    }

    return { formIsValid, emailStatus, passwordStatus };
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm(true).formIsValid) {
      return;
    }

    setIsLoading(true);

    const userData = {
      email,
      password,
    };

    const headers = new Headers({
      "Content-Type": "application/json",
    });
    try {
      const loginRes = await fetch("/api/users/login", {
        method: "POST",
        headers,
        body: JSON.stringify(userData),
      });
      if (loginRes.ok) {
        const loggedInUser = await loginRes.json();
        console.log(loggedInUser);
        //FIXME
        // setActiveUser({
        //   ...loggedInUser,
        //   token: loginRes.headers.get("L-Auth"),
        // });
        return;
      }
      alert(loginRes.statusText);
      // TODO - Add toastify for these kind of messages
      // throw new Error(loginRes.statusText);
    } catch (err) {
      if (typeof err === "string") {
        console.log(err);
      } else if (err instanceof Error) {
        console.log(err.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-slate-900 text-slate-100">
      <Logo />
      {/* Page title */}
      <p className="pb-4 text-lg">
        Sign in to Clothing Shop
      </p>
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`${container} flex-col`}
      >
        {/* inputs container */}
        <div>
          {/* Email container */}
          {/* NOTE - Made the autocomplete off because of input bg color change whenver an autocomplete value is used; TODO - Figure out how to solve the bg change and remove autoComplete=off */}
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
              autoComplete={"off"}
              tabIndex={1}
              autoFocus
              required
            />
            {validateForm().emailStatus ===
              inputStatus.INVALID && (
              <span className="text-sm text-red-500">
                *Please enter a correct email address
              </span>
            )}
          </div>
          {/* Password container */}
          <div className={inputContainerClasses}>
            <label
              className={labelClasses}
              htmlFor={"sign-in-password"}
            >
              Password{" "}
              <Link
                tabIndex={5}
                className="text-blue-400 float-right"
                href="/forgot-password"
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
              tabIndex={2}
              required
            />
            {/* Show password button */}
            <span
              tabIndex={3}
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
          tabIndex={4}
          type="submit"
          className="bg-green-700 hover:bg-green-800 active:bg-green-900 rounded-md h-9 font-bold w-full"
        >
          {isLoading ? <Loading /> : "Login"}
        </button>
      </form>
      {/* Link to sign up */}
      <div
        className={`${container} h-12 mt-4 items-center`}
      >
        <p>
          {"New here? "}
          <Link
            className=" text-blue-400"
            tabIndex={6}
            href={"/signup"}
          >
            Create an account
          </Link>
          {"."}
        </p>
      </div>
    </div>
  );
}

export default Login;
