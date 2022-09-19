import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { GetStaticProps } from "next";
import { prisma } from "../../utils/prisma-client";
import { Category, Item } from "@prisma/client";

import Layout from "../../components/layout/layout.component";
import ProductCardContainer from "../../components/product-card-container/product-card-container.component";

const products = [
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 2,
    name: "Basic Tee 2",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  // More products...
];

export interface ICategory extends Category {
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
    include: {
      items: {
        take: 4,
      },
    },
  });

  //TODO - Change the date in db to UNIX date so this whole json parsing can be avoided

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
      {categories.map((category) => (
        <ProductCardContainer
          key={category.id}
          category={category}
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
