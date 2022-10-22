import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { GetStaticProps } from "next";
import { prisma } from "../../utils/prisma-client";
import { Category, Item } from "@prisma/client";

import Layout from "../../components/layout/layout.component";
import ProductCardContainer from "../../components/product-card-container/product-card-container.component";
import Meta from "../../components/meta/meta.component";

interface ICategory extends Category {
  items: Item[];
}
interface ICategories {
  categories: ICategory[];
}

export const getStaticProps: GetStaticProps = async () => {
  const categories = await prisma.category.findMany({
    where: {
      name: {
        not: "seed",
      },
    },
    select: {
      id: true,
      name: true,
      items: {
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
        orderBy: {
          reviewsAvgRating: "desc",
        },
      },
    },
  });

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
    revalidate: 10,
  };
};

const Categories: NextPageWithLayout<ICategories> = ({
  categories,
}) => {
  return (
    <>
      <Meta title="Categories" />
      {categories.map((category) => (
        <ProductCardContainer
          key={category.id}
          showName={true}
          showLink={true}
          productGroup={category}
        />
      ))}
    </>
  );
};

Categories.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default Categories;
