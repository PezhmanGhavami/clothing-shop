import { cookies } from "next/headers";

import { changeTheme } from "./change-theme.action";
import { BsSun, BsMoon } from "react-icons/bs";

function getCurrentTheme() {
  const cookieStore = cookies();

  return cookieStore.get("theme")?.value || "dark";
}

function Footer() {
  const theme = getCurrentTheme();

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
      <form
        action={changeTheme}
        title={`Click to switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className=""
      >
        <button
          type="submit"
          className="flex items-center space-x-1 rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-slate-800"
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
        </button>
      </form>
    </footer>
  );
}

export default Footer;
