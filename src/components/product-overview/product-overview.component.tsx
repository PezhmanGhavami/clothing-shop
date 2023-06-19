import Image from "next/image";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";
import { toast } from "react-toastify";

import ReviewStars from "../product-review-stars/product-review-stars.component";

import useCart from "../../hooks/useCart";

import currencyFormatter from "../../utils/currencyFormatter";

import { itemPopulatedWithCategoryName } from "../../pages/product/[productID]";

interface IProductOverview {
  product: itemPopulatedWithCategoryName;
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
    return cart?.items.find((item) => item.id === product.id);
  };
  const maxInventoryReached = () => {
    const itemQuantityInCart = itemIsInCart()?.quantity;
    return (itemQuantityInCart || 0) >= product.currentInventory;
  };

  const handleWishlist = () => {
    toast.info("Not implemented yet.");
  };

  return (
    <div className="flex flex-col border-b pb-8 sm:pb-16">
      {/* Breadcrumbs */}
      <div className="order-last mx-auto w-full p-4 pt-0 text-sm capitalize sm:order-none sm:w-11/12 sm:p-0 sm:py-4 lg:w-3/4">
        <Link
          href={"/categories/" + product.categories[0].slug}
          className="text-slate-500 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-white"
        >
          {product.categories[0].name}
        </Link>
        <span> / </span> {product.name}
      </div>
      {/* Main component */}
      <div className="flex h-fit flex-col sm:mx-auto sm:w-11/12 sm:flex-row sm:gap-10 sm:pt-6 lg:w-3/4">
        {/* Image */}
        <div className="relative h-[60vh] w-full bg-gray-200 sm:aspect-[2/3] sm:h-full sm:max-w-xs sm:overflow-hidden sm:rounded-md">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 20rem,
            100%"
            quality={100}
            className="object-cover object-center dark:brightness-90"
          />
        </div>
        {/* Other */}
        <div className="flex-auto p-4 sm:p-0">
          {/* Price, Name, Availablity and Reviews */}
          <div className="flex flex-col">
            {/* Reviews */}
            <div className="flex">
              <ReviewStars rating={product.reviewsAvgRating} />
              <a
                title="Click to see all reviews"
                href="#reviews-section"
                className="ml-3 text-sm font-medium text-blue-700 underline dark:text-blue-400"
              >
                {product.reviewsCount} reviews
              </a>
            </div>
            {/* Price and name */}
            <div className="flex justify-between">
              {/* Product Name */}
              <h1 className="text-lg font-semibold">{product.name}</h1>
              {/* Price */}
              <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                <span className={product.offer ? "line-through" : ""}>
                  {currencyFormatter.format(product.price)}
                </span>
                {product.dsicountedPrice && (
                  <span className="text-red-700 dark:text-red-400">
                    {" "}
                    {currencyFormatter.format(product.dsicountedPrice)}
                  </span>
                )}
              </p>
            </div>
            {/* Availablity */}
            <p className="mt-2 w-full flex-none text-sm font-medium text-slate-500 dark:text-slate-400">
              {product.currentInventory > 3 ? (
                <span>In stock</span>
              ) : product.currentInventory > 0 &&
                product.currentInventory <= 3 ? (
                <span className="text-yellow-600 dark:text-yellow-400">
                  *Last {product.currentInventory} in stock
                </span>
              ) : (
                <span className="text-red-500">*Out of stock</span>
              )}
            </p>
          </div>
          {/* Description and seperator */}
          <div className="mb-6 mt-4 flex border-b border-b-slate-200 pb-6">
            <p>{product.description}</p>
          </div>
          {/* Buttons (Add to cart and wishlist) */}
          <div className="mb-6 flex space-x-4">
            <button
              disabled={product.currentInventory === 0 || maxInventoryReached()}
              onClick={handleAddItemToCart}
              className={`h-9 w-full rounded-md bg-slate-100 text-sm font-medium tracking-tight shadow-md hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 ${
                maxInventoryReached() && "cursor-not-allowed opacity-75"
              }`}
            >
              {product.currentInventory > 0
                ? maxInventoryReached()
                  ? "Max inventory reached - " +
                    `${itemIsInCart()?.quantity} in cart`
                  : itemIsInCart()
                  ? `Add to cart - ${itemIsInCart()?.quantity} in cart`
                  : "Add to cart"
                : "Out of stock"}
            </button>
            {/* Wishlist */}
            <button
              className="flex h-9 w-9 flex-none items-center justify-center rounded-md border text-lg text-slate-400 shadow hover:text-slate-500 dark:hover:text-slate-300"
              type="button"
              aria-label="Like"
              title="Add to wishlist"
              onClick={handleWishlist}
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
