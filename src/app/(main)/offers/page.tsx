import { prisma } from "@/utils/prisma-client";

import ProductCardContainer from "@/components/product-card-container/product-card-container.component";

import { IProductCardContainerData } from "@/components/product-card-container/product-card-container.component";
interface IOffer {
  offerListing: IProductCardContainerData;
}

const getData = async (): Promise<IOffer> => {
  const items = await prisma.item.findMany({
    where: {
      offer: true,
    },
  });

  return { offerListing: { items, name: "Special Offers" } };
};

export const revalidate = 60;

export const metadata = {
  title: "Special Offers",
};

const Offer = async () => {
  const { offerListing } = await getData();

  return (
    <div className="py-6">
      <h2 className="text-center text-4xl font-bold capitalize tracking-tight">
        {offerListing.name}
      </h2>
      <ProductCardContainer
        showName={false}
        showLink={false}
        gridOnMobile={true}
        productGroup={offerListing}
      />
    </div>
  );
};

export default Offer;
