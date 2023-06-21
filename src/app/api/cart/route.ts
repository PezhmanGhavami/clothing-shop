import { getSession, createResponse } from "@/utils/session";
import { prisma } from "@/utils/prisma-client";

import { IApiMessage } from "../auth/route";
import { IProductCard } from "@/components/product-card/product-card.component";

export interface ICartItem extends IProductCard {
  quantity: number;
}
export interface ICart {
  id?: string;
  items: ICartItem[];
  count: number;
  total: number;
  discountedTotal: number;
}

const emptyCart: ICart = {
  items: [],
  count: 0,
  total: 0.0,
  discountedTotal: 0.0,
};

const checkForItemInCartThenChangeItAccordingly = (
  cartItems: ICartItem[],
  product: IProductCard,
  changeValue: number,
) => {
  const localCartItems = [...cartItems];

  const productIndex = cartItems.findIndex((item) => item.id === product.id);

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
          quantity: localCartItems[productIndex].currentInventory,
        };
      }
      return localCartItems;
    }

    localCartItems[productIndex] = {
      ...localCartItems[productIndex],
      quantity: localCartItems[productIndex].quantity + changeValue,
    };

    if (localCartItems[productIndex].quantity === 0) {
      return localCartItems.filter((item) => item.id !== product.id);
    }

    return localCartItems;
  }

  localCartItems.push({ ...product, quantity: 1 });
  return localCartItems;
};

const cartItemsUpdatePayloadMaker = (
  newCartItems: ICartItem[],
  cart: ICart,
): ICart => {
  const newTotal = newCartItems.reduce(
    (acc, item) => (acc += item.quantity * item.price),
    0,
  );
  const newCount = newCartItems.reduce(
    (acc, item) => (acc += item.quantity),
    0,
  );
  const newDiscountedTotal = newCartItems.reduce(
    (acc, item) =>
      item.dsicountedPrice
        ? (acc += item.quantity * item.dsicountedPrice)
        : (acc += item.quantity * item.price),
    0,
  );
  const payload = {
    ...cart,
    items: newCartItems,
    count: newCount,
    total: newTotal,
    discountedTotal: newDiscountedTotal,
  };

  return payload;
};

export async function GET(req: Request) {
  const res = new Response();
  const session = await getSession(req, res);
  const resInit: ResponseInit = {
    status: 200,
    headers: { "Content-Type": "application/json" },
  };
  const { cart } = session;

  if (cart) {
    const payload: ICart | IApiMessage = {
      ...cart,
    };
    return createResponse(res, JSON.stringify(payload), resInit);
  }

  const newCart = {
    ...emptyCart,
  };
  session.cart = newCart;
  await session.save();

  const payload: ICart | IApiMessage = newCart;

  return createResponse(res, JSON.stringify(payload), resInit);
}

export async function PUT(req: Request) {
  const res = new Response();
  const session = await getSession(req, res);
  const resInit: ResponseInit = {
    status: 200,
    headers: { "Content-Type": "application/json" },
  };
  const { cart } = session;

  try {
    if (cart) {
      const { product, operation } = await req.json();
      if (!product || isNaN(operation)) {
        resInit.status = 400;
        throw new Error("All fields are required.");
      }
      // Remove an item
      if (operation === 0) {
        const cartItems = cart.items.filter((item) => item.id !== product.id);
        const newCart = {
          ...cartItemsUpdatePayloadMaker(cartItems, cart),
        };
        session.cart = newCart;
        await session.save();

        if (cart.id) {
          await prisma.cart.update({
            where: {
              id: cart.id,
            },
            data: {
              items: JSON.stringify(newCart.items),
              count: newCart.count,
              total: newCart.total,
              discountedTotal: newCart.discountedTotal,
            },
          });
        }

        const payload: ICart | IApiMessage = newCart;
        return createResponse(res, JSON.stringify(payload), resInit);
      }
      // Add or deduct an item
      else if (operation === 1 || operation === -1) {
        const cartItems = checkForItemInCartThenChangeItAccordingly(
          cart.items,
          product,
          operation,
        );
        const newCart = {
          ...cartItemsUpdatePayloadMaker(cartItems, cart),
        };
        session.cart = newCart;
        await session.save();

        if (cart.id) {
          await prisma.cart.update({
            where: {
              id: cart.id,
            },
            data: {
              items: JSON.stringify(newCart.items),
              count: newCart.count,
              total: newCart.total,
              discountedTotal: newCart.discountedTotal,
            },
          });
        }

        const payload: ICart | IApiMessage = newCart;
        return createResponse(res, JSON.stringify(payload), resInit);
      }
    }
  } catch (error) {
    const payload: ICart | IApiMessage = {
      status: "ERROR",
      message: (error as Error).message,
    };

    return createResponse(res, JSON.stringify(payload), resInit);
  }
}
