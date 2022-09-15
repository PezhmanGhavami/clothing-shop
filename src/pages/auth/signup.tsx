import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Loading from "../../components/loading/loading.component";
import Logo from "../../components/logo/logo.component";

import useUser from "../../utils/useUser";
import fetcher from "../../utils/fetcher";

interface IUserRegisterFrom {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
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

function SignUp() {
  const [formFields, setFormFields] =
    useState<IUserRegisterFrom>(defaultFormFields);
  const [isLoading, setIsLoading] = useState(false);
  const { mutateUser } = useUser();

  //FIXME - location.state causes type error fix it and use the commented codes to do the redirect
  // const location = useLocation();
  const router = useRouter();

  const { displayName, email, password, confirmPassword } =
    formFields;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormFields((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = (onSubmit: boolean = false) => {
    let formIsValid = true;
    let nameStatus = inputStatus.VALID;
    let emailStatus = inputStatus.VALID;
    let passwordStatus = inputStatus.VALID;
    let confirmPasswordStatus = inputStatus.VALID;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //TODO - Add a regex to check password strength (front and back)

    if (displayName === "" || !displayName) {
      nameStatus = inputStatus.EMPTY;
      formIsValid = false;
      onSubmit && alert("You should provide a name.");
    }

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

    if (confirmPassword === "" || !confirmPassword) {
      onSubmit &&
        alert("You should confirm your password.");
      formIsValid = false;
      confirmPasswordStatus = inputStatus.EMPTY;
    }

    if (password !== confirmPassword) {
      onSubmit && alert("Passwords should match.");
      formIsValid = false;
    }

    return {
      formIsValid,
      emailStatus,
      passwordStatus,
      nameStatus,
      confirmPasswordStatus,
    };
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm(true).formIsValid) {
      return;
    }

    setIsLoading(true);

    const userData: IUserRegisterFrom = {
      email,
      password,
      confirmPassword,
      displayName,
    };

    const headers = new Headers({
      "Content-Type": "application/json",
    });
    try {
      mutateUser(
        await fetcher("/api/auth/register", {
          method: "POST",
          headers,
          body: JSON.stringify(userData),
        }),
        false
      );
    } catch (error) {
      // TODO - Add toastify for these kind of messages
      // throw new Error(loginRes.statusText);
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Something went wrong.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-slate-900 text-slate-100">
      <Logo />
      {/* Page title */}
      <p className="pb-4 text-lg">
        Sign up to Clothing Shop
      </p>
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`${container} flex-col`}
      >
        {/* inputs container */}
        <div>
          {/* Name container */}
          <div className={inputContainerClasses}>
            <label
              className={labelClasses}
              htmlFor={"sign-up-name"}
            >
              Name
            </label>
            <input
              className={inputClasses}
              type="text"
              name="displayName"
              id="sign-up-name"
              value={displayName}
              onChange={handleChange}
              autoComplete={"off"}
              tabIndex={1}
              autoFocus
              required
            />
          </div>
          {/* Email container */}
          {/* NOTE - Made the autocomplete off because of input bg color change whenver an autocomplete value is used; TODO - Figure out how to solve the bg change and remove autoComplete=off */}
          <div className={inputContainerClasses}>
            <label
              className={labelClasses}
              htmlFor={"sign-up-email"}
            >
              Email
            </label>
            <input
              className={inputClasses}
              type="email"
              name="email"
              id="sign-up-email"
              value={email}
              onChange={handleChange}
              autoComplete={"off"}
              tabIndex={2}
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
              htmlFor={"sign-up-password"}
            >
              Password
            </label>
            <input
              className={inputClasses}
              type="password"
              name="password"
              id="sign-up-password"
              value={password}
              onChange={handleChange}
              tabIndex={3}
              required
            />
          </div>
          {/*Confirm password container */}
          <div className={inputContainerClasses}>
            <label
              className={labelClasses}
              htmlFor={"sign-up-confirm-password"}
            >
              Confirm Password
            </label>
            <input
              className={inputClasses}
              type="password"
              name="confirmPassword"
              id="sign-up-confirm-password"
              value={confirmPassword}
              onChange={handleChange}
              tabIndex={4}
              required
            />
            {confirmPassword !== "" &&
              password !== "" &&
              confirmPassword !== password && (
                <span className="text-sm text-red-500">
                  *Your passwords should match.
                </span>
              )}
          </div>
        </div>
        {/* Register button */}
        <button
          tabIndex={5}
          type="submit"
          className="bg-green-700 hover:bg-green-800 active:bg-green-900 rounded-md h-9 font-bold w-full"
        >
          {isLoading ? <Loading /> : "Register"}
        </button>
      </form>
      {/* Link to login */}
      <div
        className={`${container} h-12 mt-4 items-center`}
      >
        <p>
          {"Already have an account? "}
          <Link href={"/auth/signin"}>
            <a className=" text-blue-400" tabIndex={6}>
              Login
            </a>
          </Link>
          {"."}
        </p>
      </div>
    </div>
  );
}

export default SignUp;
