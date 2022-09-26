import { ReactElement } from "react";
import { GetStaticProps } from "next";
import { NextPageWithLayout } from "./_app";

import { prisma } from "../utils/prisma-client";
import Layout from "../components/layout/layout.component";
import ProductCardContainer from "../components/product-card-container/product-card-container.component";

import { IProductCardContainerData } from "../components/product-card-container/product-card-container.component";
interface IHome {
  newestProducts: IProductCardContainerData;
  specialOffers: IProductCardContainerData;
}

export const getStaticProps: GetStaticProps = async () => {
  const newestProducts = await prisma.item.findMany({
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });
  const specialOffers = await prisma.item.findMany({
    take: 6,
    where: {
      offer: true,
    },
  });

  const groupedNewestProducts = {
    name: "Newest arrivals",
    items: newestProducts,
  };

  const groupedOfferedProducts = {
    name: "Special offers",
    items: specialOffers,
  };

  return {
    props: {
      newestProducts: JSON.parse(
        JSON.stringify(groupedNewestProducts)
      ),
      specialOffers: JSON.parse(
        JSON.stringify(groupedOfferedProducts)
      ),
    },
    revalidate: 10,
  };
};

const Home: NextPageWithLayout<IHome> = ({
  specialOffers,
  newestProducts,
}) => {
  return (
    <>
      {/* TODO - Fix the link */}
      <ProductCardContainer
        showName={true}
        showLink={true}
        productGroup={specialOffers}
      />
      <ProductCardContainer
        showName={true}
        showLink={true}
        productGroup={newestProducts}
      />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
