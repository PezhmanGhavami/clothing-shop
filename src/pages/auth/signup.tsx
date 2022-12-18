import {
  useState,
  ChangeEvent,
  FormEvent,
  ReactElement,
} from "react";
import Link from "next/link";
import { NextPageWithLayout } from "../_app";
import { toast } from "react-toastify";

import Loading from "../../components/loading/loading.component";
import AuthLayout from "../../components/auth-layout/auth-layout";
import Meta from "../../components/meta/meta.component";

import useUser from "../../hooks/useUser";
import fetcher from "../../utils/fetcher";

import { formInputStyles } from "./signin";

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

enum inputStatus {
  EMPTY,
  VALID,
  INVALID,
}

const SignUp: NextPageWithLayout = () => {
  const [formFields, setFormFields] =
    useState<IUserRegisterFrom>(defaultFormFields);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateUser } = useUser();

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
      onSubmit && toast.error("You should provide a name.");
    }

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

    if (confirmPassword === "" || !confirmPassword) {
      onSubmit &&
        toast.error("You should confirm your password.");
      formIsValid = false;
      confirmPasswordStatus = inputStatus.EMPTY;
    }

    if (password !== confirmPassword) {
      onSubmit && toast.error("Passwords should match.");
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
        await fetcher("/api/auth", {
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
      <Meta title="Register" />
      {/* Page title */}
      <p className="pb-4 text-lg">
        Sign up to Clothing Shop
      </p>
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`${formInputStyles.container} flex-col`}
      >
        {/* inputs container */}
        <div>
          {/* Name container */}
          <div
            className={
              formInputStyles.inputContainerClasses
            }
          >
            <label
              className={formInputStyles.labelClasses}
              htmlFor={"sign-up-name"}
            >
              Name
            </label>
            <input
              className={formInputStyles.inputClasses}
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
          <div
            className={
              formInputStyles.inputContainerClasses
            }
          >
            <label
              className={formInputStyles.labelClasses}
              htmlFor={"sign-up-email"}
            >
              Email
            </label>
            <input
              className={formInputStyles.inputClasses}
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
              htmlFor={"sign-up-password"}
            >
              Password
            </label>
            <input
              className={formInputStyles.inputClasses}
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
          <div
            className={
              formInputStyles.inputContainerClasses
            }
          >
            <label
              className={formInputStyles.labelClasses}
              htmlFor={"sign-up-confirm-password"}
            >
              Confirm Password
            </label>
            <input
              className={formInputStyles.inputClasses}
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
                <span
                  className={
                    formInputStyles.inputWarnClasses
                  }
                >
                  *Your passwords should match.
                </span>
              )}
          </div>
        </div>
        {/* Register button */}
        <button
          tabIndex={5}
          type="submit"
          className={formInputStyles.successButtonClasses}
        >
          {isLoading ? <Loading /> : "Register"}
        </button>
      </form>
      {/* Link to login */}
      <div
        className={`${formInputStyles.container} h-12 mt-4 items-center`}
      >
        <p>
          {"Already have an account? "}
          <Link
            href={"/auth/signin"}
            className={formInputStyles.aTagClasses}
            tabIndex={6}
          >
            Login
          </Link>
          {"."}
        </p>
      </div>
    </>
  );
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default SignUp;
