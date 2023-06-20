import { prisma } from "@/utils/prisma-client";
import capitalizeWord from "@/utils/capitalize-word";

import ProductCardContainer from "@/components/product-card-container/product-card-container.component";

interface ICategory {
  params: { slug: string };
}
export async function generateStaticParams() {
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

  return categorySlugs;
}

const getData = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: {
      slug,
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
    category,
  };
};

export const revalidate = 60;

// export const dynamicParams = false;

export async function generateMetadata({ params }: ICategory) {
  return { title: capitalizeWord(params.slug) };
}

const Category = async ({ params }: ICategory) => {
  const { category } = await getData(params.slug);

  // <Meta title={category.name} />

  if (!category) {
    return (
      <div className="py-6">
        <h2 className="text-center text-4xl font-bold tracking-tight">
          {capitalizeWord(params.slug)} category doesn&apos;t exist.
        </h2>
      </div>
    );
  }

  return (
    <div className="py-6">
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

export default Category;
