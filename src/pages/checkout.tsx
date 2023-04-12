import { ReactElement, MouseEvent, FormEvent } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";
import CartItemsContainer from "../components/cart-items-container/cart-items-container.component";
import Loading from "../components/loading/loading.component";
import Meta from "../components/meta/meta.component";

import useCart from "../hooks/useCart";

import { formInputStyles } from "./auth/signin";
import currencyFormatter from "../utils/currencyFormatter";

const Checkout: NextPageWithLayout = () => {
  const { cart, cartIsUpdating } = useCart();

  if (!cart) {
    return (
      <div className="mx-auto mt-80 text-3xl">
        <Loading />
      </div>
    );
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };
  const handleOrder = () => {
    toast.info("Not implemented yet.");
  };

  return (
    <div className="mx-auto flex flex-col px-5 py-6 sm:flex-row sm:py-10 md:w-4/5 lg:px-8">
      <Meta title="Checkout" />
      {/* Form */}
      <div className="w-full p-4">
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col space-y-4`}
        >
          {/* Contact info */}
          <div>
            <h2 className="mb-4 text-xl font-medium md:text-2xl">
              Contact information
            </h2>
            <div
              className={
                formInputStyles.inputContainerClasses
              }
            >
              <label
                className={formInputStyles.labelClasses}
                htmlFor={"contact-email"}
              >
                Email
              </label>
              <input
                className={formInputStyles.inputClasses}
                type="email"
                name="email"
                id="contact-email"
                // value={email}
                // onChange={handleChange}
                autoComplete={"off"}
                tabIndex={1}
                autoFocus
                required
              />
            </div>
          </div>
          {/* Payment info */}
          <div className="pt-4">
            <h2 className="mb-4 text-xl font-medium md:text-2xl">
              Payment
            </h2>
            <div
              className={
                formInputStyles.inputContainerClasses
              }
            >
              <label
                className={formInputStyles.labelClasses}
                htmlFor={"card-number"}
              >
                Card number
              </label>
              <input
                className={formInputStyles.inputClasses}
                type="text"
                name="cardNumber"
                id="card-number"
                // value={email}
                // onChange={handleChange}
                autoComplete={"off"}
                tabIndex={2}
                required
              />
            </div>
            <div
              className={
                formInputStyles.inputContainerClasses
              }
            >
              <label
                className={formInputStyles.labelClasses}
                htmlFor={"name-on-card"}
              >
                Name on card
              </label>
              <input
                className={formInputStyles.inputClasses}
                type="text"
                name="nameOnCard"
                id="name-on-card"
                // value={email}
                // onChange={handleChange}
                autoComplete={"off"}
                tabIndex={3}
                required
              />
            </div>
            <div
              className={
                formInputStyles.inputContainerClasses +
                "flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0"
              }
            >
              <div>
                <label
                  className={formInputStyles.labelClasses}
                  htmlFor={"expiration-date"}
                >
                  Expiration date (MM/YY)
                </label>
                <input
                  className={formInputStyles.inputClasses}
                  type="text"
                  name="expirationDate"
                  id="expiration-date"
                  // value={email}
                  // onChange={handleChange}
                  autoComplete={"off"}
                  tabIndex={4}
                  required
                />
              </div>
              <div>
                <label
                  className={formInputStyles.labelClasses}
                  htmlFor={"cvc"}
                >
                  CVC
                </label>
                <input
                  className={formInputStyles.inputClasses}
                  type="text"
                  name="cvc"
                  id="cvc"
                  // value={email}
                  // onChange={handleChange}
                  autoComplete={"off"}
                  tabIndex={5}
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* Order Summary */}
      <div className="w-full p-4">
        <h2 className="text-xl font-medium md:text-2xl">
          Order Summary
        </h2>
        <div>
          {cart.count > 0 ? (
            <CartItemsContainer cartItems={cart.items} />
          ) : (
            <div className="py-12">
              <p className="pb-4">Your cart is empty!</p>
              <Link
                href={"/categories"}
                className="text-blue-700 hover:underline dark:text-blue-400"
              >
                Start shopping{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
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
          <button
            onClick={handleOrder}
            className={`mt-4 flex h-10 w-full items-center justify-center rounded-md bg-green-700 font-bold text-white hover:bg-green-800 active:bg-green-900 ${
              (cartIsUpdating || cart.count === 0) &&
              "cursor-not-allowed opacity-75"
            }`}
          >
            {cartIsUpdating ? (
              <Loading />
            ) : cart.count === 0 ? (
              "Cart is empty"
            ) : (
              "Confirm order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

Checkout.getLayout = function getLayout(
  page: ReactElement,
) {
  return <Layout>{page}</Layout>;
};

export default Checkout;
