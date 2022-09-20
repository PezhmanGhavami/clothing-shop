import { ReactElement } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { AiFillStar } from "react-icons/ai";
import { NextPageWithLayout } from "../_app";
import { Item } from "@prisma/client";

import { prisma } from "../../utils/prisma-client";

import Layout from "../../components/layout/layout.component";
import ProductCardContainer, {
  IProductCardContainerData,
} from "../../components/product-card-container/product-card-container.component";

interface IProduct {
  product: Item;
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
        include: {
          items: {
            take: 6,
          },
        },
      },
    },
  });

  const relatedProducts: IProductCardContainerData = {
    name: "Rlated Products",
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
      <ProductCardContainer
        isPreview={false}
        productGroup={relatedProducts}
      />
    </div>
  );
};

Product.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Product;
