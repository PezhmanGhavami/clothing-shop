import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";

const Offers: NextPageWithLayout = () => {
  return <div>Special Offers</div>;
};

Offers.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Offers;
