"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

import CartItemsContainer from "@/components/cart-items-container/cart-items-container.component";
import Loading from "@/components/loading/loading.component";
import {
  Label,
  Input,
  InputContainer,
} from "@/components/form/form.components";

import useCart from "@/hooks/useCart";

import currencyFormatter from "@/utils/currency-formatter";

const CheckoutComponent = () => {
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
      {/* Form */}
      <div className="w-full p-4">
        <form onSubmit={handleSubmit} className={`flex flex-col space-y-4`}>
          {/* Contact info */}
          <div>
            <h2 className="mb-4 text-xl font-medium md:text-2xl">
              Contact information
            </h2>
            <InputContainer>
              <Label htmlFor={"contact-email"}>Email</Label>
              <Input
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
            </InputContainer>
          </div>
          {/* Payment info */}
          <div className="pt-4">
            <h2 className="mb-4 text-xl font-medium md:text-2xl">Payment</h2>
            <InputContainer>
              <Label htmlFor={"card-number"}>Card number</Label>
              <Input
                type="text"
                name="cardNumber"
                id="card-number"
                // value={email}
                // onChange={handleChange}
                autoComplete={"off"}
                tabIndex={2}
                required
              />
            </InputContainer>
            <InputContainer>
              <Label htmlFor={"name-on-card"}>Name on card</Label>
              <Input
                type="text"
                name="nameOnCard"
                id="name-on-card"
                // value={email}
                // onChange={handleChange}
                autoComplete={"off"}
                tabIndex={3}
                required
              />
            </InputContainer>
            <InputContainer
              className={
                "flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0"
              }
            >
              <div>
                <Label htmlFor={"expiration-date"}>
                  Expiration date (MM/YY)
                </Label>
                <Input
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
                <Label htmlFor={"cvc"}>CVC</Label>
                <Input
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
            </InputContainer>
          </div>
        </form>
      </div>
      {/* Order Summary */}
      <div className="w-full p-4">
        <h2 className="text-xl font-medium md:text-2xl">Order Summary</h2>
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
                Start shopping <span aria-hidden="true">→</span>
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
                {currencyFormatter.format(cart.total - cart.discountedTotal)}
              </p>
            </div>
            <div className="flex h-10 items-center justify-between">
              <p>Order total</p>
              <p>{currencyFormatter.format(cart.discountedTotal)}</p>
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

export default CheckoutComponent;
