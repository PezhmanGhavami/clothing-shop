import Image from "next/image";
import Link from "next/link";

import useCart from "../../hooks/useCart";

import currencyFormatter from "../../utils/currencyFormatter";

import { ICartItem } from "../../pages/api/cart";

interface ICartItemComponent {
  item: ICartItem;
}

const CartItem = ({ item }: ICartItemComponent) => {
  const {
    addItemToCart,
    deductItemFromCart,
    removeItemFromCart,
  } = useCart();
  const handleAdd = () => {
    addItemToCart(item);
  };
  const handleDeduct = () => {
    deductItemFromCart(item);
  };
  const handleRemove = () => {
    removeItemFromCart(item);
  };
  return (
    <li
      key={item.id}
      className="flex justify-between py-8 text-sm"
    >
      {/* Image */}
      <Link href={"/product/" + item.id}>
        <div className="relative h-24 w-24 flex-none overflow-hidden rounded-lg border border-gray-200 sm:h-32 sm:w-32">
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="(min-width: 640px) 8rem,
            6rem"
            quality={100}
            className="object-cover object-center dark:brightness-90"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between pl-4 sm:pl-6 lg:pl-8">
        {/* Name and price */}
        <div className="flex w-full items-center justify-between pb-6">
          <Link href={"/product/" + item.id}>
            {item.name}
          </Link>
          <div>
            {" "}
            <p className={item.offer ? "line-through" : ""}>
              {currencyFormatter.format(item.price)}
            </p>
            {item.dsicountedPrice && (
              <p className="text-red-700 dark:text-red-400">
                {" "}
                {currencyFormatter.format(
                  item.dsicountedPrice
                )}
              </p>
            )}
          </div>
        </div>
        {/* Qty - Add or remove */}
        <div className="flex items-center justify-between">
          <p>
            Quantity: {item.quantity}
            {item.quantity >= item.currentInventory && (
              <span className="block text-xs text-red-700 dark:text-red-400">
                *Max inventory reached
              </span>
            )}
          </p>
          {/* Buttons */}
          <div className="w-20">
            {/* Add or minus */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleDeduct}
                title={
                  item.quantity === 1
                    ? "Remove this item from your cart"
                    : "Reduce the quantity of this item"
                }
                className="h-6 w-6 rounded-md border hover:bg-neutral-100 dark:hover:bg-slate-700"
              >
                {item.quantity === 1 ? (
                  <span>&#128465;</span>
                ) : (
                  <span>-</span>
                )}
              </button>
              <span className="text-xs">
                {item.quantity}
              </span>
              <button
                onClick={handleAdd}
                disabled={
                  item.quantity >= item.currentInventory
                }
                title={
                  item.quantity >= item.currentInventory
                    ? "Max inventory reached"
                    : "Add to the quantity of this item"
                }
                className={`h-6 w-6 rounded-md border hover:bg-neutral-100 dark:hover:bg-slate-700 ${
                  item.quantity >= item.currentInventory &&
                  "cursor-not-allowed opacity-50"
                }`}
              >
                <span>+</span>
              </button>
            </div>
            {/* Remove */}
            <button
              onClick={handleRemove}
              title="Remove this item from your cart"
              className="mt-3 w-full text-center text-blue-700 hover:underline dark:text-blue-400"
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
