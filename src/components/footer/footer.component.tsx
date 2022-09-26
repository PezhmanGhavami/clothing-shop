function Footer() {
  return (
    <footer className="flex justify-center sm:justify-start items-center h-14 py-4 px-2">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        © {new Date().getFullYear() + " "}
        <a
          href="http://127.0.0.1:5173/"
          target="_blank"
          className="hover:underline hover:text-slate-900 dark:hover:text-white"
          rel="noreferrer"
        >
          Clothing Shop™
        </a>
        .&nbsp; All Rights Are Reserved.
      </p>
    </footer>
  );
}

export default Footer;
