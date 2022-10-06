import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";

import { sessionOptions } from "../../../utils/session";
import { prisma } from "../../../utils/prisma-client";

import { IApiError } from "../auth/login";
import { IProductCard } from "../../../components/product-card/product-card.component";

export default withIronSessionApiRoute(
  cartRoute,
  sessionOptions
);

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
  cart: ICart
): ICart => {
  const newTotal = newCartItems.reduce(
    (acc, item) => (acc += item.quantity * item.price),
    0
  );
  const newCount = newCartItems.reduce(
    (acc, item) => (acc += item.quantity),
    0
  );
  const newDiscountedTotal = newCartItems.reduce(
    (acc, item) =>
      item.dsicountedPrice
        ? (acc += item.quantity * item.dsicountedPrice)
        : (acc += item.quantity * item.price),
    0
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

async function cartRoute(
  req: NextApiRequest,
  res: NextApiResponse<ICart | IApiError>
) {
  if (req.method === "GET") {
    const cart = req.session.cart;
    if (cart) {
      return res.json({ ...cart });
    }
    const newCart = {
      ...emptyCart,
    };
    req.session.cart = newCart;
    await req.session.save();
    return res.json(newCart);
  } else if (req.method === "PUT") {
    try {
      const cart = req.session.cart;
      if (cart) {
        const { product, operation } = await req.body;
        if (!product || isNaN(operation)) {
          res.status(400);
          throw new Error("All fields are required.");
        }
        //TODO - add the change operations to the db

        // Remove an item
        if (operation === 0) {
          const cartItems = cart.items.filter(
            (item) => item.id !== product.id
          );
          const newCart = {
            ...cartItemsUpdatePayloadMaker(cartItems, cart),
          };
          req.session.cart = newCart;
          await req.session.save();

          return res.json({ ...newCart });
        }
        // Add or deduct an item
        else if (operation === 1 || operation === -1) {
          const cartItems =
            checkForItemInCartThenChangeItAccordingly(
              cart.items,
              product,
              operation
            );
          const newCart = {
            ...cartItemsUpdatePayloadMaker(cartItems, cart),
          };
          req.session.cart = newCart;
          await req.session.save();
          return res.json({ ...newCart });
        }
      }
    } catch (error) {
      return res.json({
        status: "ERROR",
        message: (error as Error).message,
      });
    }
  }
  return res
    .status(400)
    .json({ status: "ERROR", message: "Bad Request." });
}
