import Link from "next/link";

function NotFound() {
  return (
    <div className="h-[85vh] flex flex-col justify-center items-center">
      <p className="text-4xl pb-4">
        There&apos;s nothing here!
      </p>
      <Link href={"/"}>
        <a className="pt-4 dark:text-slate-400 hover:underline dark:hover:text-slate-100">
          Go Back Home
        </a>
      </Link>
    </div>
  );
}
export default NotFound;
