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
      className="py-8 flex justify-between text-sm"
    >
      {/* Image */}
      <Link href={"/product/" + item.id}>
        <a className="relative flex-none w-24 sm:w-32 h-24 sm:h-32 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={item.images[0]}
            alt={item.name}
            layout="fill"
            quality={100}
            priority
            className="object-cover object-center dark:brightness-90"
          />
        </a>
      </Link>

      {/* Info */}
      <div className="flex flex-col justify-between flex-1 pl-4 sm:pl-6 lg:pl-8">
        {/* Name and price */}
        <div className="flex justify-between items-center w-full pb-6">
          <Link href={"/product/" + item.id}>
            <a>{item.name}</a>
          </Link>
          <p>
            {" "}
            <span
              className={item.offer ? "line-through" : ""}
            >
              {currencyFormatter.format(item.price)}
            </span>
            {item.dsicountedPrice && (
              <span className="text-red-700 dark:text-red-400">
                {" "}
                {currencyFormatter.format(
                  item.dsicountedPrice
                )}
              </span>
            )}
          </p>
        </div>
        {/* Qty - Add or remove */}
        <div className="flex justify-between items-center">
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
            <div className="flex justify-between items-center">
              <button
                onClick={handleDeduct}
                title={
                  item.quantity === 1
                    ? "Remove this item from your cart"
                    : "Reduce the quantity of this item"
                }
                className="w-6 h-6 border rounded-md hover:bg-neutral-100 dark:hover:bg-slate-700"
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
                className={`w-6 h-6 border rounded-md hover:bg-neutral-100 dark:hover:bg-slate-700 ${
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
