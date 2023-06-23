"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";

import Loading from "@/components/loading/loading.component";
import OtherAuthOption from "@/components/other-auth-option/other-auth-option.component";
import {
  Form,
  Label,
  Input,
  Button,
  WarningSpan,
  InputContainer,
} from "@/components/form/form.components";

import useUser from "@/hooks/useUser";
import fetcher from "@/utils/fetcher";

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

const SignUpComponent = () => {
  const [formFields, setFormFields] =
    useState<IUserRegisterFrom>(defaultFormFields);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateUser } = useUser();

  const { displayName, email, password, confirmPassword } = formFields;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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

    if (confirmPassword === "" || !confirmPassword) {
      onSubmit && toast.error("You should confirm your password.");
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      <p className="pb-4 text-lg">Sign up to Clothing Shop</p>
      <Form onSubmit={handleSubmit} noValidate>
        {/* inputs container */}
        <div>
          {/* Name container */}
          <InputContainer>
            <Label htmlFor={"sign-up-name"}>Name</Label>
            <Input
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
          </InputContainer>
          {/* Email container */}
          {/* NOTE - Made the autocomplete off because of input bg color change whenver an autocomplete value is used; TODO - Figure out how to solve the bg change and remove autoComplete=off */}
          <InputContainer>
            <Label htmlFor={"sign-up-email"}>Email</Label>
            <Input
              type="email"
              name="email"
              id="sign-up-email"
              value={email}
              onChange={handleChange}
              autoComplete={"off"}
              tabIndex={2}
              required
            />
            {validateForm().emailStatus === inputStatus.INVALID && (
              <WarningSpan>*Please enter a correct email address</WarningSpan>
            )}
          </InputContainer>
          {/* Password container */}
          <InputContainer>
            <Label htmlFor={"sign-up-password"}>Password</Label>
            <Input
              type="password"
              name="password"
              id="sign-up-password"
              value={password}
              onChange={handleChange}
              tabIndex={3}
              required
            />
          </InputContainer>
          {/*Confirm password container */}
          <InputContainer>
            <Label htmlFor={"sign-up-confirm-password"}>Confirm Password</Label>
            <Input
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
                <WarningSpan>*Your passwords should match.</WarningSpan>
              )}
          </InputContainer>
        </div>
        {/* Register button */}
        <Button tabIndex={5} type="submit">
          {isLoading ? <Loading /> : "Register"}
        </Button>
      </Form>
      {/* Link to login */}
      <OtherAuthOption
        pText="Already have an account? "
        linkText="Login"
        linkHref="/auth/signin"
        tabIndex={6}
      />
    </>
  );
};

export default SignUpComponent;
