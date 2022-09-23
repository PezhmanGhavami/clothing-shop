import Image from "next/image";
import Link from "next/link";
import { AiFillStar, AiFillHeart } from "react-icons/ai";

import { itemPopulatedWithReviewAndCategoryName } from "../../pages/product/[productID]";

interface IProductOverview {
  product: itemPopulatedWithReviewAndCategoryName;
}

const ProductOverview = ({ product }: IProductOverview) => {
  return (
    <div className="flex flex-col border-b">
      <div className="pb-4 sm:py-4 mx-auto w-11/12 text-sm capitalize order-last sm:order-none">
        <Link
          href={"/categories/" + product.categories[0].name}
        >
          <a className="text-slate-500 dark:text-slate-400 hover:underline hover:text-slate-900 dark:hover:text-white">
            {product.categories[0].name + " "}
          </a>
        </Link>
        / {product.name}
      </div>
      <div className="flex flex-col sm:flex-row sm:w-11/12 sm:mx-auto sm:h-[50vh] sm:pt-6">
        <div className="relative sm:w-2/6 h-[55vh] sm:h-5/6 bg-gray-200">
          <Image
            src={product.images[0]}
            alt={product.name}
            layout="fill"
            priority
            quality={100}
            className="object-cover object-center"
          />
        </div>
        <div className="flex-auto p-4 sm:p-0 sm:pl-10">
          <div className="flex flex-wrap">
            <h1 className="flex-auto text-lg font-semibold text-slate-900">
              {product.name}
            </h1>
            <div className="text-lg font-semibold text-slate-500">
              <p>
                <span
                  className={
                    product.offer ? "line-through" : ""
                  }
                >
                  ${product.price}
                </span>
                {product.offer && (
                  <span className="text-red-700 dark:text-red-400">
                    {" "}
                    ${product.dsicountedPrice}
                  </span>
                )}
              </p>
            </div>
            <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
              {product.currentInventory > 3 ? (
                <span>In stock</span>
              ) : product.currentInventory > 0 &&
                product.currentInventory <= 3 ? (
                <span>
                  Last {product.currentInventory} in stock
                </span>
              ) : (
                <span>Out of stock</span>
              )}
            </div>
          </div>
          <div className="flex items-baseline mt-4 mb-6 pb-6 border-b border-slate-200">
            <div className="space-x-2 flex text-sm">
              <label>
                <input
                  className="sr-only peer"
                  name="size"
                  type="radio"
                  value="xs"
                  defaultChecked
                />
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                  XS
                </div>
              </label>
              <label>
                <input
                  className="sr-only peer"
                  name="size"
                  type="radio"
                  value="s"
                />
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                  S
                </div>
              </label>
              <label>
                <input
                  className="sr-only peer"
                  name="size"
                  type="radio"
                  value="m"
                />
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                  M
                </div>
              </label>
              <label>
                <input
                  className="sr-only peer"
                  name="size"
                  type="radio"
                  value="l"
                />
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                  L
                </div>
              </label>
              <label>
                <input
                  className="sr-only peer"
                  name="size"
                  type="radio"
                  value="xl"
                />
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
                  XL
                </div>
              </label>
            </div>
          </div>
          <div className="flex space-x-4 mb-6 text-sm font-medium">
            {/* TODO - Make this a component */}
            <div className="flex-auto flex space-x-4">
              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium tracking-tight h-9 w-full rounded-md shadow-md">
                Add to cart
              </button>
            </div>
            <button
              className="flex-none flex items-center justify-center w-9 h-9 rounded-md border text-slate-400 dark:text-slate-800 hover:text-slate-500 dark:hover:bg-slate-700 text-lg shadow"
              type="button"
              aria-label="Like"
              title="Add to wishlist"
            >
              <AiFillHeart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
