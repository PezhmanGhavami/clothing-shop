import Image from "next/image";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";

import ReviewStars from "../product-review-stars/product-review-stars.component";

import useCart from "../../hooks/useCart";

import currencyFormatter from "../../utils/currencyFormatter";

import { itemPopulatedWithReviewAndCategoryName } from "../../pages/product/[productID]";

interface IProductOverview {
  product: itemPopulatedWithReviewAndCategoryName;
}

const ProductOverview = ({ product }: IProductOverview) => {
  const { cart, addItemToCart } = useCart();
  const handleAddItemToCart = () => {
    addItemToCart({
      id: product.id,
      name: product.name,
      currentInventory: product.currentInventory,
      price: product.price,
      offer: product.offer,
      dsicountedPrice: product.dsicountedPrice,
      images: product.images,
    });
  };
  const itemIsInCart = () => {
    return cart?.items.find(
      (item) => item.id === product.id
    );
  };
  const maxInventoryReached = () => {
    const itemQuantityInCart = itemIsInCart()?.quantity;
    return (
      (itemQuantityInCart || 0) >= product.currentInventory
    );
  };
  return (
    <div className="flex flex-col border-b">
      {/* Breadcrumbs */}
      <div className="p-4 pt-0 sm:p-0 sm:py-4 mx-auto w-full sm:w-11/12 lg:w-3/4 text-sm capitalize order-last sm:order-none">
        <Link
          href={"/categories/" + product.categories[0].name}
        >
          <a className="text-slate-500 dark:text-slate-400 hover:underline hover:text-slate-900 dark:hover:text-white">
            {product.categories[0].name}
          </a>
        </Link>
        <span> / </span> {product.name}
      </div>
      {/* Main component */}
      <div className="flex flex-col sm:flex-row sm:w-11/12 lg:w-3/4 sm:mx-auto sm:h-[50vh] lg:h-[70vh] sm:pt-6">
        {/* Image */}
        <div className="relative sm:w-1/3 2xl:w-3/12 h-[60vh] sm:h-5/6 bg-gray-200">
          <Image
            src={product.images[0]}
            alt={product.name}
            layout="fill"
            priority
            quality={100}
            className="object-cover object-center dark:brightness-90"
          />
        </div>
        {/* Other */}
        <div className="flex-auto p-4 sm:p-0 sm:pl-10">
          {/* Price, Name, Availablity and Reviews */}
          <div className="flex flex-col">
            {/* Reviews */}
            <div className="flex">
              <ReviewStars score={product.reviewsScore} />
              <a
                title="Click to see all reviews"
                href="#reviews-section"
                className="ml-3 text-sm font-medium underline text-blue-700 dark:text-blue-400"
              >
                {product.reviewsCount} reviews
              </a>
            </div>
            {/* Price and name */}
            <div className="flex justify-between">
              {/* Product Name */}
              <h1 className="text-lg font-semibold">
                {product.name}
              </h1>
              {/* Price */}
              <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                <span
                  className={
                    product.offer ? "line-through" : ""
                  }
                >
                  {currencyFormatter.format(product.price)}
                </span>
                {product.dsicountedPrice && (
                  <span className="text-red-700 dark:text-red-400">
                    {" "}
                    {currencyFormatter.format(
                      product.dsicountedPrice
                    )}
                  </span>
                )}
              </p>
            </div>
            {/* Availablity */}
            <p className="w-full flex-none text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
              {product.currentInventory > 3 ? (
                <span>In stock</span>
              ) : product.currentInventory > 0 &&
                product.currentInventory <= 3 ? (
                <span className="text-yellow-600 dark:text-yellow-400">
                  *Last {product.currentInventory} in stock
                </span>
              ) : (
                <span className="text-red-500">
                  *Out of stock
                </span>
              )}
            </p>
          </div>
          {/* Description and seperator */}
          <div className="flex mt-4 mb-6 pb-6 border-b border-b-slate-200">
            <p>{product.description}</p>
          </div>
          {/* Buttons (Add to cart and wishlist) */}
          <div className="flex space-x-4 mb-6">
            <button
              disabled={
                product.currentInventory === 0 ||
                maxInventoryReached()
              }
              onClick={handleAddItemToCart}
              className={`bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium tracking-tight h-9 w-full rounded-md shadow-md ${
                maxInventoryReached() &&
                "cursor-not-allowed opacity-75"
              }`}
            >
              {maxInventoryReached()
                ? "Max inventory reached - " +
                  `${itemIsInCart()?.quantity} in cart`
                : itemIsInCart()
                ? `Add to cart - ${
                    itemIsInCart()?.quantity
                  } in cart`
                : product.currentInventory > 0
                ? "Add to cart"
                : "Out of stock"}
            </button>
            {/* Wishlist */}
            <button
              className="flex-none flex items-center justify-center w-9 h-9 rounded-md border text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 text-lg shadow"
              type="button"
              aria-label="Like"
              title="Add to wishlist"
            >
              <AiFillHeart />
            </button>
          </div>
          {/* details */}
          <ul>
            {product.details.map((detail, index) => (
              <li key={index}> - {detail}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
