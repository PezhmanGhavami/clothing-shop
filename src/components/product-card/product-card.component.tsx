import Image from "next/image";
import Link from "next/link";

import currencyFormatter from "../../utils/currency-formatter";

export interface IProductCard {
  id: string;
  images: string[];
  name: string;
  price: number;
  offer: boolean;
  dsicountedPrice: number | null;
  currentInventory: number;
}

interface IProductCardComponent {
  product: IProductCard;
  gridOnMobile: boolean;
}

const ProductCard = ({ product, gridOnMobile }: IProductCardComponent) => {
  return (
    <div className={gridOnMobile ? "" : "w-[50vw] sm:w-auto"}>
      <Link href={"/product/" + product.id}>
        <div className="relative h-72 w-full overflow-hidden rounded-md bg-gray-200">
          <span
            className={`absolute left-1 top-1 z-10 rounded-md px-2 ${
              product.currentInventory <= 0
                ? "bg-red-600 text-white"
                : product.currentInventory <= 3
                ? "bg-yellow-400 text-slate-900 dark:bg-yellow-500"
                : ""
            }`}
          >
            {product.currentInventory <= 0
              ? "Out of stock"
              : product.currentInventory <= 3
              ? `Last ${product.currentInventory} in stock`
              : ""}
          </span>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="100%"
            quality={100}
            className="object-cover object-center hover:opacity-75 dark:brightness-90"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <h3 className="w-2/3 text-sm">
            <span aria-hidden="true" />
            {product.name}
          </h3>
          <div className="text-sm font-medium">
            <p className={product.offer ? "line-through" : ""}>
              {currencyFormatter.format(product.price)}
            </p>
            {product.dsicountedPrice && (
              <p className="text-red-700 dark:text-red-400">
                {" "}
                {currencyFormatter.format(product.dsicountedPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
