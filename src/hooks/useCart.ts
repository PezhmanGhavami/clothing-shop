import { useEffect, useState } from "react";
import useSWR from "swr";

import fetcher from "../utils/fetcher";

import { IProductCard } from "../components/product-card/product-card.component";
export interface ICartItem extends IProductCard {
  quantity: number;
}
export interface ICartItemsUpdate {
  cartItems: ICartItem[];
  cartTotal: number;
  cartCount: number;
  isLocal: boolean;
}

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
  isLocal: boolean
): ICartItemsUpdate => {
  localStorage.setItem(
    "cartItems",
    JSON.stringify(newCartItems)
  );
  const newCartTotal = newCartItems.reduce(
    (acc, item) => (acc += item.quantity * item.price),
    0
  );
  const newCartCount = newCartItems.reduce(
    (acc, item) => (acc += item.quantity),
    0
  );
  const payload = {
    cartItems: newCartItems,
    cartTotal: newCartTotal,
    cartCount: newCartCount,
    isLocal,
  };

  return payload;
};

export default function useCart() {
  const { data, mutate } = useSWR<ICartItemsUpdate>(
    "/api/cart",
    fetcher
  );
  const [cart, setCart] = useState<ICartItemsUpdate>({
    cartItems: [],
    cartCount: 0,
    cartTotal: 0.0,
    isLocal: true,
  });
  useEffect(() => {
    if (data) setCart({ ...data, isLocal: false });
    else {
      const items =
        window.localStorage.getItem("cartItems");
      const parsedItems: ICartItem[] | null = items
        ? JSON.parse(items)
        : null;
      if (parsedItems) {
        setCart({
          ...cartItemsUpdatePayloadMaker(parsedItems, true),
        });
      }
    }
  }, [data]);

  const addItemToCart = (product: IProductCard) => {
    if (data) {
      const newCartItems =
        checkForItemInCartThenChangeItAccordingly(
          data.cartItems,
          product,
          1
        );
      newCartItems &&
        mutate(
          cartItemsUpdatePayloadMaker(
            newCartItems,
            data.isLocal
          ),
          false
        );
    }
  };

  const removeItemFromCart = (product: IProductCard) => {
    if (data) {
      const newCartItems =
        checkForItemInCartThenChangeItAccordingly(
          data.cartItems,
          product,
          -1
        );
      newCartItems &&
        mutate(
          cartItemsUpdatePayloadMaker(
            newCartItems,
            data.isLocal
          ),
          false
        );
    }
  };

  const deleteItemFromCart = (product: IProductCard) => {
    if (data) {
      const newCartitems = data.cartItems.filter(
        (item) => item.id !== product.id
      );
      newCartitems &&
        mutate(
          cartItemsUpdatePayloadMaker(
            newCartitems,
            data.isLocal
          ),
          false
        );
    }
  };

  return {
    cart,
    addItemToCart,
    removeItemFromCart,
    deleteItemFromCart,
  };
}
