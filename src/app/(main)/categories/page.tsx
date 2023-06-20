import { prisma } from "@/utils/prisma-client";

import ProductCardContainer from "@/components/product-card-container/product-card-container.component";

const getData = async () => {
  const categories = await prisma.category.findMany({
    where: {
      name: {
        not: "seed",
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
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
    categories,
  };
};

export const revalidate = 60;

export const metadata = {
  title: "Categories",
};

const Categories = async () => {
  const { categories } = await getData();

  return (
    <>
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

export default Categories;
