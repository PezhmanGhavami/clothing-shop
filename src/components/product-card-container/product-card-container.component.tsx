import Link from "next/link";

import ProductCard from "../product-card/product-card.component";

import { ICategory } from "../../pages/categories/index";

interface IProductCardContainer {
  category: ICategory;
  isPreview: boolean;
}

const ProductCardContainer = ({
  category,
  isPreview,
}: IProductCardContainer) => {
  return (
    <div className="mx-auto max-w-2xl py-6 px-4 sm:pt-10 lg:max-w-7xl lg:px-8">
      <div className="flex justify-between items-center">
        <h2 className="capitalize text-2xl font-bold tracking-tight">
          {category.name}
        </h2>
        {isPreview && (
          <Link
            href={
              "/categories/" + category.name.toLowerCase()
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
        {category.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCardContainer;
