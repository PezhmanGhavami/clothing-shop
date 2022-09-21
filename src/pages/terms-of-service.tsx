import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";

const TermsOfService: NextPageWithLayout = () => {
  return (
    <div>
      <h2>Terms Of Service</h2>
      <p>
        This is a mock up website; DO NOT make any
        purchases.
      </p>
    </div>
  );
};

TermsOfService.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default TermsOfService;
