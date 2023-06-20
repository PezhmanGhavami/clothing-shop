"use client";

import { useContext } from "react";
import { BsSun, BsMoon } from "react-icons/bs";

import { ThemeContext } from "../../context/theme.context";

function Footer() {
  const { theme, changeTheme } = useContext(ThemeContext);
  return (
    <footer className="flex h-14 items-center justify-between border-t px-2 py-4 text-sm text-slate-600 dark:border-t-slate-700 dark:text-slate-400">
      <p className="flex flex-col sm:flex-row">
        <span>
          © {new Date().getFullYear() + " "}
          <a
            href="/"
            target="_blank"
            className="hover:text-slate-900 hover:underline dark:hover:text-white"
            rel="noreferrer"
          >
            Clothing Shop™
          </a>
          .&nbsp;
        </span>
        <span> All Rights Are Reserved.</span>
      </p>
      <div
        className="flex items-center space-x-1 rounded-md p-2 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-slate-800"
        title={`Click to switch to ${theme === "dark" ? "light" : "dark"} mode`}
        onClick={changeTheme}
      >
        {theme === "dark" ? (
          <>
            <BsMoon /> <span>Dark mode</span>
          </>
        ) : (
          <>
            <BsSun /> <span>Light mode</span>
          </>
        )}
      </div>
    </footer>
  );
}

export default Footer;
