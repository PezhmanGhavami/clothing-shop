import {
  useState,
  ChangeEvent,
  FormEvent,
  ReactElement,
} from "react";
import Link from "next/link";
import { NextPageWithLayout } from "../_app";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";

import Loading from "../../components/loading/loading.component";
import AuthLayout from "../../components/auth-layout/auth-layout";
import Meta from "../../components/meta/meta.component";

import useUser from "../../hooks/useUser";
import fetcher from "../../utils/fetcher";

interface IUserLoginFrom {
  email: string;
  password: string;
}

const defaultFormFields = {
  email: "",
  password: "",
};

export const formInputStyles = {
  container:
    "border bg-slate-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-600 shadow-md rounded-xl flex justify-around p-4 w-3/4 md:w-80 ",
  inputContainerClasses: "mb-4 relative ",
  labelClasses: "block pb-1 ",
  inputClasses:
    "w-full h-9 rounded-md px-2 dark:bg-slate-900 border dark:border-slate-600 focus:outline-none focus:ring focus:ring-blue-400 ",
  inputWarnClasses:
    "text-sm text-red-700 dark:text-red-400",
  aTagClasses:
    "text-blue-700 dark:text-blue-400 hover:underline ",
  successButtonClasses:
    "bg-green-700 hover:bg-green-800 active:bg-green-900 rounded-md h-9 font-bold w-full text-white ",
};

//TODO - Couldn't get the invalid pseudo class work correctly (always active), fix this later

enum inputStatus {
  EMPTY,
  VALID,
  INVALID,
}

const Login: NextPageWithLayout = () => {
  const [formFields, setFormFields] =
    useState<IUserLoginFrom>(defaultFormFields);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateUser } = useUser();

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
        toast.error(
          emailStatus === inputStatus.EMPTY
            ? "You should provide an email address."
            : "Invalid email address."
        );
    }

    if (password === "" || !password) {
      onSubmit &&
        toast.error("You should provide a password.");
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
      mutateUser(
        await fetcher("/api/auth/login", {
          method: "POST",
          headers,
          body: JSON.stringify(userData),
        }),
        false
      );
      //TODO - maybe add a prop to redirect to the corrct page after login
    } catch (error) {
      // throw new Error(loginRes.statusText);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <Meta title="Sign in" />
      {/* Page title */}
      <p className="pb-4 text-lg">
        Sign in to Clothing Shop
      </p>
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`${formInputStyles.container} flex-col`}
      >
        {/* inputs container */}
        <div>
          {/* Email container */}
          {/* NOTE - Made the autocomplete off because of input bg color change whenver an autocomplete value is used; TODO - Figure out how to solve the bg change and remove autoComplete=off */}
          <div
            className={
              formInputStyles.inputContainerClasses
            }
          >
            <label
              className={formInputStyles.labelClasses}
              htmlFor={"sign-in-email"}
            >
              Email
            </label>
            <input
              className={formInputStyles.inputClasses}
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
              <span
                className={formInputStyles.inputWarnClasses}
              >
                *Please enter a correct email address
              </span>
            )}
          </div>
          {/* Password container */}
          <div
            className={
              formInputStyles.inputContainerClasses
            }
          >
            <label
              className={formInputStyles.labelClasses}
              htmlFor={"sign-in-password"}
            >
              Password{" "}
              <Link href="/forgot-password">
                <a
                  tabIndex={5}
                  className={
                    formInputStyles.aTagClasses +
                    "float-right"
                  }
                >
                  Forgot Password?
                </a>
              </Link>
            </label>
            <input
              className={
                formInputStyles.inputClasses + " pr-8"
              }
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
          className={formInputStyles.successButtonClasses}
        >
          {isLoading ? <Loading /> : "Login"}
        </button>
      </form>
      {/* Link to sign up */}
      <div
        className={`${formInputStyles.container} h-12 mt-4 items-center`}
      >
        <p>
          {"New here? "}
          <Link href={"/auth/signup"}>
            <a
              className={formInputStyles.aTagClasses}
              tabIndex={6}
            >
              {" "}
              Create an account
            </a>
          </Link>
          {"."}
        </p>
      </div>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
