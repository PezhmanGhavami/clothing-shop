import Link from "next/link";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";
import Meta from "../components/meta/meta.component";

const NotFound: NextPageWithLayout = () => {
  return (
    <div className="h-[85vh] flex flex-col justify-center items-center">
      <Meta title="Page not found" />
      <p className="text-4xl pb-4">
        There&apos;s nothing here!
      </p>
      <Link
        href={"/"}
        className="pt-4 text-blue-700 dark:text-blue-400 hover:underline"
      >
        Go Back Home <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
};

NotFound.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default NotFound;
