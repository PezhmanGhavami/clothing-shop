import { Item, Review, User } from "@prisma/client";

import { prisma } from "@/utils/prisma-client";

import ProductOverview from "@/components/product-overview/product-overview.component";
import ProductCardContainer, {
  IProductCardContainerData,
} from "@/components/product-card-container/product-card-container.component";
import ProductReviewsContainer from "@/components/product-reviews-container/product-reviews-container.component";

export type itemPopulatedWithCategoryName = Item & {
  categories: { name: string; slug: string }[];
};
interface IProduct {
  params: { productId: string };
}

export async function generateStaticParams() {
  const categoryNames = await prisma.item.findMany({
    select: {
      id: true,
    },
  });

  const paths = categoryNames.map(({ id }) => ({
    productId: id,
  }));

  return paths;
}

const getData = async (productId: string) => {
  const product = await prisma.item.update({
    where: {
      id: productId,
    },
    data: {
      viewed: {
        increment: 1,
      },
    },
    include: {
      categories: {
        take: 1,
        where: {
          NOT: {
            name: "seed",
          },
        },
        select: {
          name: true,
          slug: true,
          items: {
            where: {
              NOT: {
                id: productId,
              },
            },
            take: 6,
            select: {
              id: true,
              images: true,
              name: true,
              price: true,
              offer: true,
              dsicountedPrice: true,
              currentInventory: true,
            },
          },
        },
      },
    },
  });

  const relatedProducts: IProductCardContainerData = {
    name: "Related Products",
    slug: "", //TODO - when you complete search, use it to show a link so that users can continue viewing relevant products
    items: [],
  };

  if (product?.categories[0]) {
    relatedProducts.items = product.categories[0].items.map((item) => item);
  }

  return {
    product: product,
    relatedProducts: relatedProducts,
  };
};

export const revalidate = 60;

/* <Meta
title={product.name}
description={product.description}
oGImageUrl={product.images[0]}
/> */

const Product = async ({ params }: IProduct) => {
  const { product, relatedProducts } = await getData(params.productId);

  return (
    <div>
      <ProductOverview product={product} />
      <ProductCardContainer
        showName={true}
        showLink={false}
        productGroup={relatedProducts}
      />
      <ProductReviewsContainer
        productId={product.id}
        avgRating={product.reviewsAvgRating}
        reviewsCount={product.reviewsCount}
        ratingCounts={{
          rated1: product.reviewsRated1Count,
          rated2: product.reviewsRated2Count,
          rated3: product.reviewsRated3Count,
          rated4: product.reviewsRated4Count,
          rated5: product.reviewsRated5Count,
        }}
      />
    </div>
  );
};

export default Product;
