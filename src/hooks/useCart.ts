import useSWR from "swr";

import fetcher from "../utils/fetcher";

import { IProductCard } from "../components/product-card/product-card.component";
import { ICart, ICartItem } from "../pages/api/cart";

const checkForItemInCartThenChangeItAccordingly = (
  cartItems: ICartItem[],
  product: IProductCard,
  changeValue: number
) => {
  const localCartItems = [...cartItems];

  const productIndex = cartItems.findIndex(
    (item) => item.id === product.id
  );

  if (productIndex !== -1) {
    if (
      localCartItems[productIndex].quantity >=
        localCartItems[productIndex].currentInventory &&
      changeValue === 1
    ) {
      if (
        localCartItems[productIndex].quantity >
        localCartItems[productIndex].currentInventory
      ) {
        localCartItems[productIndex] = {
          ...localCartItems[productIndex],
          quantity:
            localCartItems[productIndex].currentInventory,
        };
      }
      return localCartItems;
    }

    localCartItems[productIndex] = {
      ...localCartItems[productIndex],
      quantity:
        localCartItems[productIndex].quantity + changeValue,
    };

    if (localCartItems[productIndex].quantity === 0) {
      return localCartItems.filter(
        (item) => item.id !== product.id
      );
    }

    return localCartItems;
  }

  localCartItems.push({ ...product, quantity: 1 });
  return localCartItems;
};

const cartItemsUpdatePayloadMaker = (
  newCartItems: ICartItem[],
  cart: ICart
): ICart => {
  const newCartTotal = newCartItems.reduce(
    (acc, item) => (acc += item.quantity * item.price),
    0
  );
  const newCartCount = newCartItems.reduce(
    (acc, item) => (acc += item.quantity),
    0
  );
  const newCartDiscountedTotal = newCartItems.reduce(
    (acc, item) =>
      item.dsicountedPrice
        ? (acc += item.quantity * item.dsicountedPrice)
        : (acc += item.quantity * item.price),
    0
  );
  const payload = {
    ...cart,
    cartItems: newCartItems,
    cartTotal: newCartTotal,
    cartCount: newCartCount,
    cartDiscountedTotal: newCartDiscountedTotal,
  };

  return payload;
};

const updateFunction = (
  product: IProductCard,
  operation: number
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  return fetcher("/api/cart", {
    method: "PUT",
    headers,
    body: JSON.stringify({ product, operation }),
  });
};

export default function useCart() {
  const { data, isValidating, mutate } = useSWR<ICart>(
    "/api/cart",
    fetcher
  );

  const mutateCart = async (
    product: IProductCard,
    operation: number,
    newData: ICart
  ) => {
    try {
      mutate(await updateFunction(product, operation), {
        optimisticData: newData,
        rollbackOnError: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong.");
      }
    }
  };

  const addItemToCart = (product: IProductCard) => {
    if (data) {
      const newCartItems =
        checkForItemInCartThenChangeItAccordingly(
          data.items,
          product,
          1
        );
      const newData = {
        ...cartItemsUpdatePayloadMaker(newCartItems, data),
      };
      mutateCart(product, 1, newData);
    }
  };

  const deductItemFromCart = (product: IProductCard) => {
    if (data) {
      const newCartItems =
        checkForItemInCartThenChangeItAccordingly(
          data.items,
          product,
          -1
        );
      const newData = {
        ...cartItemsUpdatePayloadMaker(newCartItems, data),
      };
      mutateCart(product, -1, newData);
    }
  };

  const removeItemFromCart = (product: IProductCard) => {
    if (data) {
      const newCartItems = data.items.filter(
        (item) => item.id !== product.id
      );
      const newData = {
        ...cartItemsUpdatePayloadMaker(newCartItems, data),
      };
      mutateCart(product, 0, newData);
    }
  };

  return {
    cart: data,
    cartIsUpdating: isValidating,
    addItemToCart,
    deductItemFromCart,
    removeItemFromCart,
  };
}
