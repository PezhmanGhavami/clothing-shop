import { ReactElement } from "react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import {
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";

import Layout from "../components/layout/layout.component";
import CartItemsContainer from "../components/cart-items-container/cart-items-container.component";

import useCart from "../hooks/useCart";

const Cart: NextPageWithLayout = () => {
  const { cart } = useCart();
  const router = useRouter();

  console.log(cart);
  if (!cart) {
    return <div>Laoding...</div>;
  }
  return (
    <div className="flex flex-col justify-center py-6 px-4 lg:px-8">
      {/* Heading */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-medium text-gray-900">
          Shopping Cart
        </h2>
        <button
          type="button"
          title="Close"
          className="text-gray-400 hover:text-gray-500"
          onClick={() => router.back()}
        >
          <AiOutlineClose
            className="h-6 w-6"
            aria-hidden="true"
          />
        </button>
      </div>
      {/* Cart Items */}
      <CartItemsContainer cartItems={cart.cartItems} />

      {/* Order summary */}

      <div className="bg-gray-50 p-6 sm:p-8 sm:rounded-lg">
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>

        <div className="flex flex-col divide-y">
          <div className="flex h-10 justify-between">
            <p>Subtotla</p>
            <p>{cart.cartTotal}</p>
          </div>
          <div className="flex h-10 justify-between">
            <p>Your saving</p>
            <p>Some number</p>
          </div>
          <div className="flex h-10 justify-between">
            <p>Order total</p>
            <p>Actual Total</p>
          </div>
          <button className="h-10">Checkout</button>
        </div>
      </div>
    </div>
  );
};

Cart.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Cart;
