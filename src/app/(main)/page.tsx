import { prisma } from "@/utils/prisma-client";
import ProductCardContainer from "@/components/product-card-container/product-card-container.component";
import Slideshow from "@/components/slideshow/slideshow.component";
import Meta from "@/components/meta/meta.component";

const landingDir = [
  {
    id: 5,
    name: "mens",
    imageUrl:
      "https://res.cloudinary.com/drsgyshsf/image/upload/v1664706429/clothing-shop/selected/joshua-lawrence-0HuiKa8AFls-unsplash_gfju7b.jpg",
  },
  {
    id: 4,
    name: "womens",
    imageUrl:
      "https://res.cloudinary.com/drsgyshsf/image/upload/v1664706239/clothing-shop/selected/fabian-albert-_Wt5CgwWk1k-unsplash_u4t2vj.jpg",
  },
  {
    id: 1,
    name: "hats",
    imageUrl:
      "https://res.cloudinary.com/drsgyshsf/image/upload/v1664706305/clothing-shop/selected/jenn-lopez-YsR3K2yylMc-unsplash_s6yaaz.jpg",
  },
  {
    id: 2,
    name: "jackets",
    imageUrl:
      "https://res.cloudinary.com/drsgyshsf/image/upload/v1664701577/clothing-shop/selected/wallpaperflare.com_wallpaper_w8lyvl.jpg",
  },
  {
    id: 3,
    name: "sneakers",
    imageUrl:
      "https://res.cloudinary.com/drsgyshsf/image/upload/v1664701720/clothing-shop/selected/hermes-rivera-OX_en7CXMj4-unsplash_fv5kev.jpg",
  },
];

const getData = async () => {
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
    slug: "/offers",
  };

  return {
    newestProducts: groupedNewestProducts,
    specialOffers: groupedOfferedProducts,
  };
};

const Home = async () => {
  const { newestProducts, specialOffers } = await getData();

  return (
    <>
      <Meta title="Home" />
      <Slideshow slides={landingDir} />
      <ProductCardContainer
        showName={true}
        showLink={true}
        linkIsCategory={false}
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

export default Home;
