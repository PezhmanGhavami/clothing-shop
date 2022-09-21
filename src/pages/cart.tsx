import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";

const Cart: NextPageWithLayout = () => {
  return (
    <div>
      <h2>Cart</h2>
      <p>Cart!</p>
    </div>
  );
};

Cart.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Cart;
