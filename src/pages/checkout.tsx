import { ReactElement } from "react";

import { NextPageWithLayout } from "./_app";
import Layout from "../components/layout/layout.component";

const Checkout: NextPageWithLayout = () => {
  return <div>Checkout</div>;
};

Checkout.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default Checkout;
