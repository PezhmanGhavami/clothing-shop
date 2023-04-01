import { ReactElement, MouseEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextPageWithLayout } from "./_app";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

import Layout from "../components/layout/layout.component";
import CartItemsContainer from "../components/cart-items-container/cart-items-container.component";
import Loading from "../components/loading/loading.component";
import Meta from "../components/meta/meta.component";

import useCart from "../hooks/useCart";

import currencyFormatter from "../utils/currencyFormatter";

const Cart: NextPageWithLayout = () => {
  const { cart, cartIsUpdating } = useCart();
  const router = useRouter();

  const handleCheckout = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (cartIsUpdating || !cart || cart.count === 0) {
      event.preventDefault();
      toast.info(
        cartIsUpdating || !cart
          ? "Cart is updating please wait."
          : cart.count === 0
          ? "Cart is empty."
          : "Something went wrong...",
      );
    }
  };

  if (!cart) {
    return (
      <div className="mx-auto mt-80 text-3xl">
        <Loading />
      </div>
    );
  }
  return (
    <div className="mx-auto px-5 py-6 sm:py-10 md:w-3/5 lg:px-8 xl:w-2/5">
      <Meta title="Cart" />
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium md:text-2xl">
          Shopping Cart
        </h2>
        <button
          type="button"
          title="Close"
          className="hover:text-slate-600 dark:hover:text-slate-300"
          onClick={() => router.back()}
        >
          <AiOutlineClose
            className="h-6 w-6"
            aria-hidden="true"
          />
        </button>
      </div>
      {/* Cart Items */}
      {cart.count > 0 ? (
        <CartItemsContainer cartItems={cart.items} />
      ) : (
        <div className="py-12">
          <p className="pb-4">Your cart is empty!</p>
          <Link
            href={"/categories"}
            className="text-blue-700 hover:underline dark:text-blue-400"
          >
            Start shopping <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
      {/* Order summary */}
      <div className="mb-28 rounded-lg border bg-neutral-50 p-4 dark:bg-slate-800 sm:p-8">
        <div className="divide-y">
          <div className="flex h-10 items-center justify-between">
            <p>Subtotal</p>
            <p>{currencyFormatter.format(cart.total)}</p>
          </div>
          <div className="flex h-10 items-center justify-between">
            <p>You are saving</p>
            <p>
              {currencyFormatter.format(
                cart.total - cart.discountedTotal,
              )}
            </p>
          </div>
          <div className="flex h-10 items-center justify-between">
            <p>Order total</p>
            <p>
              {currencyFormatter.format(
                cart.discountedTotal,
              )}
            </p>
          </div>
        </div>
        <Link
          onClick={handleCheckout}
          className={`mt-4 flex h-10 w-full items-center justify-center rounded-md bg-green-700 font-bold text-white hover:bg-green-800 active:bg-green-900 ${
            (cartIsUpdating || cart.count === 0) &&
            "cursor-not-allowed opacity-75"
          }`}
          href={"/checkout"}
        >
          {cartIsUpdating ? (
            <Loading />
          ) : cart.count === 0 ? (
            "Cart is empty"
          ) : (
            "Go to checkout"
          )}
        </Link>
      </div>
    </div>
  );
};

Cart.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Cart;
