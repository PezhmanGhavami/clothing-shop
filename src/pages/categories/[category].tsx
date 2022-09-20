import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { GetStaticProps, GetStaticPaths } from "next";
import { prisma } from "../../utils/prisma-client";

import Layout from "../../components/layout/layout.component";
import ProductCardContainer from "../../components/product-card-container/product-card-container.component";

import { ICategory } from "./index";
interface ICategoryComp {
  category: ICategory;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categoryNames = await prisma.category.findMany({
    where: {
      name: {
        not: "seed",
      },
    },
    select: {
      name: true,
    },
  });

  const paths = categoryNames.map(({ name }) => ({
    params: {
      category: name,
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
  const category = await prisma.category.findUnique({
    where: {
      name: params.category,
    },
    include: {
      items: true,
    },
  });

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
    },
    revalidate: 60 * 5,
  };
};

const Category: NextPageWithLayout<ICategoryComp> = ({
  category,
}) => {
  return (
    <ProductCardContainer
      isPreview={false}
      category={category}
    />
  );
};

Category.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default Category;
