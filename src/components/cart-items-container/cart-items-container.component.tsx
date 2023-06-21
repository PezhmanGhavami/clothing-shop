import CartItem from "../cart-item/cart-item.component";

import { ICartItem } from "@/app/api/cart/route";

interface ICartItemContainer {
  cartItems: ICartItem[];
}

const CartItemsContainer = ({ cartItems }: ICartItemContainer) => {
  return (
    <ul className="divide-y">
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default CartItemsContainer;
