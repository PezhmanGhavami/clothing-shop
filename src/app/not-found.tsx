import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

const NotFound = () => {
  return (
    <div className="flex h-[85vh] flex-col items-center justify-center">
      <p className="pb-4 text-4xl">There&apos;s nothing here!</p>
      <Link
        href={"/"}
        className="pt-4 text-blue-700 hover:underline dark:text-blue-400"
      >
        Go Back Home <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
};

export default NotFound;
