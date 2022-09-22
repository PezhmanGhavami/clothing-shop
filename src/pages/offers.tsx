import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import { GetStaticProps } from "next";
import { prisma } from "../utils/prisma-client";

import Layout from "../components/layout/layout.component";
import ProductCardContainer from "../components/product-card-container/product-card-container.component";

import { IProductCardContainerData } from "../components/product-card-container/product-card-container.component";
interface IOffer {
  offerListing: IProductCardContainerData;
}

export const getStaticProps: GetStaticProps = async () => {
  const items = await prisma.item.findMany({
    where: {
      offer: true,
    },
  });

  const offerListing = { items, name: "Special Offers" };

  return {
    props: {
      offerListing: JSON.parse(
        JSON.stringify(offerListing)
      ),
    },
    revalidate: 10,
  };
};

const Offer: NextPageWithLayout<IOffer> = ({
  offerListing,
}) => {
  return (
    <>
      <h2 className="capitalize text-4xl font-bold tracking-tight text-center">
        {offerListing.name}
      </h2>
      <ProductCardContainer
        showName={false}
        showLink={false}
        productGroup={offerListing}
      />
    </>
  );
};

Offer.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Offer;
