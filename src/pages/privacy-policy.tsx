import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";

const PrivacyPolicy: NextPageWithLayout = () => {
  return (
    <div>
      <h2>Privacy Policy</h2>
      <p>
        No data collection; only what&apos;s neccessary to run
        the app
      </p>
    </div>
  );
};

PrivacyPolicy.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default PrivacyPolicy;
