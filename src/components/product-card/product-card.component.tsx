import { Item } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface IProductCard {
  product: Item;
}

const ProductCard = ({ product }: IProductCard) => {
  return (
    <div key={product.id} className="group relative">
      <Link href={"/product/" + product.id}>
        <a>
          <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
            <Image
              src={product.images[0]}
              alt={product.images[0]}
              layout="fill"
              className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700">
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                />
                {product.name}
              </h3>
              {/* <p className="mt-1 text-sm text-gray-500">
            {product.color}
          </p> */}
            </div>
            <p className="text-sm font-medium text-gray-900">
              {product.price}
            </p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default ProductCard;
