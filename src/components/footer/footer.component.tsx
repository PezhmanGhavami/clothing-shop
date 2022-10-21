import { useContext } from "react";
import { BsSun, BsMoon } from "react-icons/bs";

import { ThemeContext } from "../../context/theme.context";

function Footer() {
  const { theme, changeTheme } = useContext(ThemeContext);
  return (
    <footer className="flex justify-between items-center h-14 py-4 px-2 text-sm text-slate-600 dark:text-slate-400">
      <p className="flex flex-col sm:flex-row">
        <span>
          © {new Date().getFullYear() + " "}
          <a
            href="http://127.0.0.1:5173/"
            target="_blank"
            className="hover:underline hover:text-slate-900 dark:hover:text-white"
            rel="noreferrer"
          >
            Clothing Shop™
          </a>
          .&nbsp;
        </span>
        <span> All Rights Are Reserved.</span>
      </p>
      <div
        className="flex items-center space-x-1 p-2 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-md"
        title={`Click to switch to ${
          theme === "dark" ? "light" : "dark"
        } mode`}
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
