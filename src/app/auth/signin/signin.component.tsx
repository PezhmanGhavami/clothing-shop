"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";

import Loading from "@/components/loading/loading.component";
import OtherAuthOption from "@/components/other-auth-option/other-auth-option.component";
import {
  Form,
  Label,
  Input,
  Button,
  FormLink,
  WarningSpan,
  InputContainer,
} from "@/components/form/form.components";

import useUser from "@/hooks/useUser";
import fetcher from "@/utils/fetcher";

interface IUserLoginFrom {
  email: string;
  password: string;
}

const defaultFormFields = {
  email: "",
  password: "",
};

//TODO - Couldn't get the invalid pseudo class work correctly (always active), fix this later

enum inputStatus {
  EMPTY,
  VALID,
  INVALID,
}

const LoginComponent = () => {
  const [formFields, setFormFields] =
    useState<IUserLoginFrom>(defaultFormFields);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateUser } = useUser();

  const { email, password } = formFields;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        email === "" || !email ? inputStatus.EMPTY : inputStatus.INVALID;
      onSubmit &&
        toast.error(
          emailStatus === inputStatus.EMPTY
            ? "You should provide an email address."
            : "Invalid email address.",
        );
    }

    if (password === "" || !password) {
      onSubmit && toast.error("You should provide a password.");
      formIsValid = false;
      passwordStatus = inputStatus.EMPTY;
    }

    return { formIsValid, emailStatus, passwordStatus };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        false,
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
      {/* Page title */}
      <p className="pb-4 text-lg">Sign in to Clothing Shop</p>
      <Form onSubmit={handleSubmit} noValidate>
        {/* inputs container */}
        <div>
          {/* Email container */}
          {/* NOTE - Made the autocomplete off because of input bg color change whenver an autocomplete value is used; TODO - Figure out how to solve the bg change and remove autoComplete=off */}
          <InputContainer>
            <Label htmlFor={"sign-in-email"}>Email</Label>
            <Input
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
            {validateForm().emailStatus === inputStatus.INVALID && (
              <WarningSpan>*Please enter a correct email address</WarningSpan>
            )}
          </InputContainer>
          {/* Password container */}
          <InputContainer>
            <Label htmlFor={"sign-in-password"}>
              Password{" "}
              <FormLink
                href="/forgot-password"
                tabIndex={5}
                className="float-right"
              >
                Forgot Password?
              </FormLink>
            </Label>
            <Input
              className="pr-8"
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
              className="absolute right-1 top-8 cursor-pointer p-1"
              onClick={toggleShowPassword}
              title={`Click to ${showPassword ? "Hide" : "Show"} Password`}
            >
              {showPassword ? (
                <BiShow className="text-lg" />
              ) : (
                <BiHide className="text-lg" />
              )}
            </span>
          </InputContainer>
        </div>
        {/* Login button */}
        <Button tabIndex={4} type="submit">
          {isLoading ? <Loading /> : "Login"}
        </Button>
      </Form>
      {/* Link to sign up */}
      <OtherAuthOption
        pText="New here?"
        linkText="Create an account"
        linkHref="/auth/signup"
        tabIndex={6}
      />
    </>
  );
};

export default LoginComponent;
