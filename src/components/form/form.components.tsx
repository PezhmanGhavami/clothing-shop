import {
  HTMLAttributes,
  FormHTMLAttributes,
  LabelHTMLAttributes,
  InputHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
import Link, { LinkProps } from "next/link";

export const Form = ({
  children,
  className,
  ...rest
}: FormHTMLAttributes<HTMLFormElement>) => {
  return (
    <form
      {...rest}
      className={`flex w-3/4 flex-col justify-around rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-md dark:border-slate-700 dark:bg-slate-800 md:w-80${
        className ? " " + className : ""
      }`}
    >
      {children}
    </form>
  );
};

export const InputContainer = ({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...rest}
      className={`relative mb-4${className ? " " + className : ""}`}
    >
      {children}
    </div>
  );
};

export const Label = ({
  children,
  className,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      {...rest}
      className={`block pb-1${className ? " " + className : ""}`}
    >
      {children}
    </label>
  );
};

export const Input = ({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...rest}
      className={`h-9 w-full rounded-md border px-2 focus:outline-none focus:ring focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-900${
        className ? " " + className : ""
      }`}
    />
  );
};

export const WarningSpan = ({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...rest}
      className={`text-sm text-red-700 dark:text-red-400${
        className ? " " + className : ""
      }`}
    >
      {children}
    </span>
  );
};

export const Button = ({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...rest}
      className={`h-9 w-full rounded-md bg-green-700 font-bold text-white hover:bg-green-800 active:bg-green-900${
        className ? " " + className : ""
      }`}
    >
      {children}
    </button>
  );
};

export const FormLink = ({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLAnchorElement> & LinkProps) => {
  return (
    <Link
      {...rest}
      className={`text-blue-700 hover:underline dark:text-blue-400${
        className ? " " + className : ""
      }`}
    >
      {children}
    </Link>
  );
};
