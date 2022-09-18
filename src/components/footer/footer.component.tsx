import Link from "next/link";

const footerATags =
  "text-sm text-slate-600 dark:text-slate-400 hover:underline hover:text-slate-900 dark:hover:text-white px-2";

function Footer() {
  return (
    <footer className="flex justify-between items-end h-14">
      <span className="block text-sm text-slate-600 dark:text-slate-400 px-2">
        © {new Date().getFullYear() + " "}
        <a
          href="http://127.0.0.1:5173/"
          target="_blank"
          className="hover:underline hover:text-slate-900 dark:hover:text-white"
          rel="noreferrer"
        >
          Clothing Shop™
        </a>
        . All Rights Reserved.
      </span>
      <div>
        <Link href="contact-us">
          <a className={footerATags}>Contact Us</a>
        </Link>
        <Link href="privacy-policy">
          <a className={footerATags}>Privacy Policy</a>
        </Link>
        <Link href="terms-of-service">
          <a className={footerATags}>Terms of Service</a>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
