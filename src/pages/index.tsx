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

import Slide from "../components/slide/slide.component";

const landingDir = [
  {
    id: 5,
    name: "mens",
    imageUrl: "https://i.ibb.co/R70vBrQ/men.png",
  },
  {
    id: 4,
    name: "womens",
    imageUrl: "https://i.ibb.co/GCCdy8t/womens.png",
  },
  {
    id: 1,
    name: "hats",
    imageUrl: "https://i.ibb.co/cvpntL1/hats.png",
  },
  {
    id: 2,
    name: "jackets",
    imageUrl: "https://i.ibb.co/px2tCc3/jackets.png",
  },
  {
    id: 3,
    name: "sneakers",
    imageUrl: "https://i.ibb.co/0jqHpnp/sneakers.png",
  },
];

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
    orderBy: {
      sold: "desc",
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
      <div className="relative bg-slate-500 h-[65vh] overflow-x-hidden">
        {/* Slides container */}
        <div className="h-full inline-flex">
          <Slide slide={landingDir[0]} />
          <Slide slide={landingDir[1]} />
          <Slide slide={landingDir[2]} />
          <Slide slide={landingDir[3]} />
          <Slide slide={landingDir[4]} />
        </div>
        {/* The buttons to change slides */}
        <div className="absolute bottom-0 w-full flex justify-center items-center">
          <p>button</p>
          <p>button</p>
          <p>button</p>
        </div>
      </div>
      <ProductCardContainer
        showName={true}
        showLink={false}
        productGroup={specialOffers}
      />
      <ProductCardContainer
        showName={true}
        showLink={false}
        productGroup={newestProducts}
      />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
