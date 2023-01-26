import Image from "next/image";
import Link from "next/link";

import currencyFormatter from "../../utils/currencyFormatter";

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
}

const ProductCard = ({
  product,
}: IProductCardComponent) => {
  return (
    <div>
      <Link href={"/product/" + product.id}>
        <div className="relative h-72 w-full overflow-hidden rounded-md bg-gray-200">
          <span
            className={`px-2 rounded-md absolute top-1 left-1 z-10 ${
              product.currentInventory <= 0
                ? "bg-red-600 text-white"
                : product.currentInventory <= 3
                ? "bg-yellow-400 dark:bg-yellow-500 text-slate-900"
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
            className="object-cover object-center dark:brightness-90 hover:opacity-75"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <h3 className="text-sm w-2/3">
            <span aria-hidden="true" />
            {product.name}
          </h3>
          <div className="text-sm font-medium">
            <p
              className={
                product.offer ? "line-through" : ""
              }
            >
              {currencyFormatter.format(product.price)}
            </p>
            {product.dsicountedPrice && (
              <p className="text-red-700 dark:text-red-400">
                {" "}
                {currencyFormatter.format(
                  product.dsicountedPrice
                )}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
