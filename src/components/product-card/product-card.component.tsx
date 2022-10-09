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
        <a>
          <div className="relative h-72 w-full overflow-hidden rounded-md bg-gray-200">
            <span
              className={`px-2 rounded-md absolute top-1 left-1 z-10 text-white ${
                product.currentInventory <= 0
                  ? "bg-red-600"
                  : product.currentInventory <= 3
                  ? "bg-yellow-600"
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
              layout="fill"
              quality={100}
              priority
              className="object-cover object-center dark:brightness-90 hover:opacity-75"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm">
                <span aria-hidden="true" />
                {product.name}
              </h3>
            </div>
            <p className="text-sm font-medium">
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
        </a>
      </Link>
    </div>
  );
};

export default ProductCard;
