import Link from "next/link";

import ProductCard, {
  IProductCard,
} from "../product-card/product-card.component";

export interface IProductCardContainerData {
  name: string;
  items: IProductCard[];
}
interface IProductCardContainer {
  productGroup: IProductCardContainerData;
  showName: boolean;
  showLink: boolean;
}

const ProductCardContainer = ({
  productGroup,
  showLink,
  showName,
}: IProductCardContainer) => {
  return (
    <div className="mx-auto max-w-2xl py-6 sm:pt-10 px-4 lg:px-8 lg:max-w-7xl">
      <div className="flex justify-between items-center">
        {showName && (
          <h2 className="capitalize text-2xl font-bold tracking-tight">
            {productGroup.name}
          </h2>
        )}
        {showLink && (
          <Link
            href={
              "/categories/" +
              productGroup.name.toLowerCase()
            }
          >
            <a className="text-blue-700 dark:text-blue-400 hover:underline">
              Shop the collection{" "}
              <span aria-hidden="true">→</span>
            </a>
          </Link>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-6 xl:gap-x-8">
        {productGroup.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCardContainer;
