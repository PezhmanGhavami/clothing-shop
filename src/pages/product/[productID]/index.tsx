import { ReactElement } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { NextPageWithLayout } from "../../_app";
import { Item, Review, User } from "@prisma/client";

import { prisma } from "../../../utils/prisma-client";

import Layout from "../../../components/layout/layout.component";
import ProductOverview from "../../../components/product-overview/product-overview.component";
import ProductCardContainer, {
  IProductCardContainerData,
} from "../../../components/product-card-container/product-card-container.component";

export type reviewPopulatedWithUser = Review & {
  user: User;
};
export type itemPopulatedWithReviewAndCategoryName =
  Item & {
    reviews: reviewPopulatedWithUser[];
    categories: { name: string }[];
  };
interface IProduct {
  product: itemPopulatedWithReviewAndCategoryName;
  relatedProducts: IProductCardContainerData;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categoryNames = await prisma.item.findMany({
    select: {
      id: true,
    },
  });

  const paths = categoryNames.map(({ id }) => ({
    params: {
      productID: id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}) => {
  const productID = params?.productID as string;

  const product = await prisma.item.findUnique({
    where: {
      id: productID,
    },
    include: {
      reviews: {
        select: {
          title: true,
          body: true,
          score: true,
          votes: true,
          user: {
            select: { displayName: true },
          },
        },
        orderBy: {
          votes: "desc",
        },
        take: 3,
      },
      categories: {
        take: 1,
        where: {
          NOT: {
            name: "seed",
          },
        },
        select: {
          name: true,
          items: {
            where: {
              NOT: {
                id: productID,
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
    items: [],
  };

  if (product?.categories[0]) {
    relatedProducts.items = product.categories[0].items.map(
      (item) => item
    );
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(
        JSON.stringify(relatedProducts)
      ),
    },
    revalidate: 10,
  };
};

const Product: NextPageWithLayout<IProduct> = ({
  product,
  relatedProducts,
}) => {
  return (
    <div>
      <ProductOverview product={product} />
      <ProductCardContainer
        showName={true}
        showLink={false}
        productGroup={relatedProducts}
      />
    </div>
  );
};

Product.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Product;
