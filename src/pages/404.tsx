import Link from "next/link";

import Layout from "../components/layout/layout.component";

function NotFound() {
  return (
    <div className="h-[85vh] flex flex-col justify-center items-center">
      <p className="text-4xl pb-4">
        There&apos;s nothing here!
      </p>
      <Link
        className="pt-4 text-slate-400 hover:underline hover:text-slate-100"
        href={"/"}
      >
        Go Back Home
      </Link>
    </div>
  );
}
export default NotFound;
