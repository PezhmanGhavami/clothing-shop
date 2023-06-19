import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { GetStaticProps, GetStaticPaths } from "next";
import { prisma } from "../../utils/prisma-client";

import Layout from "../../components/layout/layout.component";
import ProductCardContainer from "../../components/product-card-container/product-card-container.component";
import Meta from "../../components/meta/meta.component";

import { IProductCardContainerData } from "../../components/product-card-container/product-card-container.component";
interface ICategoryComp {
  category: IProductCardContainerData;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categorySlugs = await prisma.category.findMany({
    where: {
      name: {
        not: "seed",
      },
    },
    select: {
      slug: true,
    },
  });

  const paths = categorySlugs.map(({ slug }) => ({
    params: {
      slug: slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categorySlug = params?.slug as string;

  const category = await prisma.category.findUnique({
    where: {
      slug: categorySlug,
    },
    select: {
      name: true,
      // slug: true,
      items: {
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
      category: JSON.parse(JSON.stringify(category)),
    },
    revalidate: 60,
  };
};

const Category: NextPageWithLayout<ICategoryComp> = ({ category }) => {
  return (
    <div className="py-6">
      <Meta title={category.name} />
      <h2 className="text-center text-4xl font-bold capitalize tracking-tight">
        {category.name}
      </h2>
      <ProductCardContainer
        showName={false}
        showLink={false}
        gridOnMobile={true}
        productGroup={category}
      />
    </div>
  );
};

Category.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Category;
