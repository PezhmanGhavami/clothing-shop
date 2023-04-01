import Link from "next/link";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";
import Meta from "../components/meta/meta.component";

const NotFound: NextPageWithLayout = () => {
  return (
    <div className="flex h-[85vh] flex-col items-center justify-center">
      <Meta title="Page not found" />
      <p className="pb-4 text-4xl">
        There&apos;s nothing here!
      </p>
      <Link
        href={"/"}
        className="pt-4 text-blue-700 hover:underline dark:text-blue-400"
      >
        Go Back Home <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
};

NotFound.getLayout = function getLayout(
  page: ReactElement,
) {
  return <Layout>{page}</Layout>;
};

export default NotFound;
