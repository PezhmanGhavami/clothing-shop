import Image from "next/image";
import Link from "next/link";

import useCart from "../../hooks/useCart";

import { ICartItem } from "../../pages/api/cart";

interface ICartItemComponent {
  item: ICartItem;
}

const CartItem = ({ item }: ICartItemComponent) => {
  const {
    addItemToCart,
    removeItemFromCart,
    deleteItemFromCart,
  } = useCart();
  const handleAdd = () => {
    addItemToCart(item);
  };
  const handleRemove = () => {
    removeItemFromCart(item);
  };
  const handleDelete = () => {
    deleteItemFromCart(item);
  };
  return (
    <li
      key={item.id}
      className="py-8 flex justify-between text-sm"
    >
      {/* Image */}
      <div className="relative flex-none w-24 sm:w-32 h-24 sm:h-32 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={item.images[0]}
          alt={item.name}
          layout="fill"
          quality={100}
          priority
          className="object-cover object-center dark:brightness-90"
        />
      </div>
      {/* Info */}
      <div className="flex flex-col justify-between flex-1 pl-4 sm:pl-6 lg:pl-8">
        {/* Name and price */}
        <div className="flex justify-between items-center w-full pb-6">
          <Link href={"/product/" + item.id}>
            <p>{item.name}</p>
          </Link>
          <p>${item.price}.00</p>
        </div>
        {/* Qty - Add or remove */}
        <div className="flex justify-between items-center">
          <p>Quantity: {item.quantity}</p>
          {/* Buttons */}
          <div className="w-20">
            {/* Add or minus */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleRemove}
                title="Reduce the quantity of this item"
                className="w-6 h-6 border rounded-md hover:bg-neutral-100 dark:hover:bg-slate-700"
              >
                -
              </button>
              <span className="text-xs">
                {item.quantity}
              </span>
              <button
                onClick={handleAdd}
                title="Add to the quantity of this item"
                className="w-6 h-6 border rounded-md hover:bg-neutral-100 dark:hover:bg-slate-700"
              >
                +
              </button>
            </div>
            {/* Remove */}
            <button
              onClick={handleDelete}
              title="Remove this item from your cart"
              className="w-full mt-3 text-center text-blue-700 dark:text-blue-400 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
