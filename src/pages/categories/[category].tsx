import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { GetStaticProps, GetStaticPaths } from "next";
import { prisma } from "../../utils/prisma-client";

import Layout from "../../components/layout/layout.component";
import ProductCardContainer from "../../components/product-card-container/product-card-container.component";

import { IProductCardContainerData } from "../../components/product-card-container/product-card-container.component";
interface ICategoryComp {
  category: IProductCardContainerData;
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
  const categoryName = params?.category as string;

  const category = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
    include: {
      items: true,
    },
  });

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
    },
    revalidate: 10,
  };
};

const Category: NextPageWithLayout<ICategoryComp> = ({
  category,
}) => {
  return (
    <>
      <h2 className="capitalize text-4xl font-bold tracking-tight text-center">
        {category.name}
      </h2>
      <ProductCardContainer
        showName={false}
        showLink={false}
        productGroup={category}
      />
    </>
  );
};

Category.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default Category;
