import { ReactElement } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { NextPageWithLayout } from "../_app";
import { Item, Review, User } from "@prisma/client";

import { prisma } from "../../utils/prisma-client";

import Layout from "../../components/layout/layout.component";
import ProductOverview from "../../components/product-overview/product-overview.component";
import ProductCardContainer, {
  IProductCardContainerData,
} from "../../components/product-card-container/product-card-container.component";
import ProductReviewsContainer from "../../components/product-reviews-container/product-reviews-container.component";
import Meta from "../../components/meta/meta.component";

export type itemPopulatedWithCategoryName = Item & {
  categories: { name: string }[];
};
interface IProduct {
  product: itemPopulatedWithCategoryName;
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
      <Meta
        title={product.name}
        description={product.description}
        oGImageUrl={product.images[0]}
      />
      <ProductOverview product={product} />
      <ProductCardContainer
        showName={true}
        showLink={false}
        productGroup={relatedProducts}
      />
      <ProductReviewsContainer productID={product.id} />
    </div>
  );
};

Product.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Product;
