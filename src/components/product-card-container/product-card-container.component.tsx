import Link from "next/link";

import ProductCard, {
  IProductCard,
} from "../product-card/product-card.component";

export interface IProductCardContainerData {
  name: string;
  slug?: string;
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
    <div className="mx-auto max-w-2xl py-6 px-4 sm:pt-10 lg:max-w-7xl lg:px-8">
      <div className="flex items-center justify-between">
        {showName && (
          <h2 className="text-2xl font-bold capitalize tracking-tight">
            {productGroup.name}
          </h2>
        )}
        {showLink && productGroup.slug && (
          <Link
            href={"/categories/" + productGroup.slug}
            className="text-blue-700 hover:underline dark:text-blue-400"
          >
            Shop the collection{" "}
            <span aria-hidden="true">→</span>
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
