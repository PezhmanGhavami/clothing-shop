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

const landingDir = [
  {
    id: 1,
    title: "hats",
    imageUrl: "https://i.ibb.co/cvpntL1/hats.png",
  },
  {
    id: 2,
    title: "jackets",
    imageUrl: "https://i.ibb.co/px2tCc3/jackets.png",
  },
  {
    id: 3,
    title: "sneakers",
    imageUrl: "https://i.ibb.co/0jqHpnp/sneakers.png",
  },
  {
    id: 4,
    title: "womens",
    imageUrl: "https://i.ibb.co/GCCdy8t/womens.png",
  },
  {
    id: 5,
    title: "mens",
    imageUrl: "https://i.ibb.co/R70vBrQ/men.png",
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
      <div className="relative bg-slate-500 h-[65vh]">
        {/* Slides container */}
        <div className="h-full overflow-x-hidden">
          <div className="h-full flex justify-between items-center bg-[url('https://i.ibb.co/R70vBrQ/men.png')] bg-center bg-cover">
            <div>Back</div>
            <div className="border h-12">
              <h3>Mens</h3>
              <p>Shop now</p>
            </div>
            <div>Next</div>
          </div>
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
