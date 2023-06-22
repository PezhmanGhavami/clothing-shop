import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const SHOP_DATA = [
  {
    title: "Hats",
    slug: "hats",
    items: [
      {
        id: 1,
        name: "Brown Brim",
        imageUrl: "https://i.ibb.co/ZYW3VTp/brown-brim.png",
        price: 25,
      },
      {
        id: 2,
        name: "Blue Beanie",
        imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
        price: 18,
      },
      {
        id: 3,
        name: "Brown Cowboy",
        imageUrl: "https://i.ibb.co/QdJwgmp/brown-cowboy.png",
        price: 35,
      },
      {
        id: 4,
        name: "Grey Brim",
        imageUrl: "https://i.ibb.co/RjBLWxB/grey-brim.png",
        price: 25,
      },
      {
        id: 5,
        name: "Green Beanie",
        imageUrl: "https://i.ibb.co/YTjW3vF/green-beanie.png",
        price: 18,
      },
      {
        id: 6,
        name: "Palm Tree Cap",
        imageUrl: "https://i.ibb.co/rKBDvJX/palm-tree-cap.png",
        price: 14,
      },
      {
        id: 7,
        name: "Red Beanie",
        imageUrl: "https://i.ibb.co/bLB646Z/red-beanie.png",
        price: 18,
      },
      {
        id: 8,
        name: "Wolf Cap",
        imageUrl: "https://i.ibb.co/1f2nWMM/wolf-cap.png",
        price: 14,
      },
      {
        id: 9,
        name: "Blue Snapback",
        imageUrl: "https://i.ibb.co/X2VJP2W/blue-snapback.png",
        price: 16,
      },
    ],
  },
  {
    title: "Sneakers",
    slug: "sneakers",
    items: [
      {
        id: 10,
        name: "Adidas NMD",
        imageUrl: "https://i.ibb.co/0s3pdnc/adidas-nmd.png",
        price: 220,
      },
      {
        id: 11,
        name: "Adidas Yeezy",
        imageUrl: "https://i.ibb.co/dJbG1cT/yeezy.png",
        price: 280,
      },
      {
        id: 12,
        name: "Black Converse",
        imageUrl: "https://i.ibb.co/bPmVXyP/black-converse.png",
        price: 110,
      },
      {
        id: 13,
        name: "Nike White AirForce",
        imageUrl: "https://i.ibb.co/1RcFPk0/white-nike-high-tops.png",
        price: 160,
      },
      {
        id: 14,
        name: "Nike Red High Tops",
        imageUrl: "https://i.ibb.co/QcvzydB/nikes-red.png",
        price: 160,
      },
      {
        id: 15,
        name: "Nike Brown High Tops",
        imageUrl: "https://i.ibb.co/fMTV342/nike-brown.png",
        price: 160,
      },
      {
        id: 16,
        name: "Air Jordan Limited",
        imageUrl: "https://i.ibb.co/w4k6Ws9/nike-funky.png",
        price: 190,
      },
      {
        id: 17,
        name: "Timberlands",
        imageUrl: "https://i.ibb.co/Mhh6wBg/timberlands.png",
        price: 200,
      },
    ],
  },
  {
    title: "Jackets",
    slug: "jackets",
    items: [
      {
        id: 18,
        name: "Black Jean Shearling",
        imageUrl: "https://i.ibb.co/XzcwL5s/black-shearling.png",
        price: 125,
      },
      {
        id: 19,
        name: "Blue Jean Jacket",
        imageUrl: "https://i.ibb.co/mJS6vz0/blue-jean-jacket.png",
        price: 90,
      },
      {
        id: 20,
        name: "Grey Jean Jacket",
        imageUrl: "https://i.ibb.co/N71k1ML/grey-jean-jacket.png",
        price: 90,
      },
      {
        id: 21,
        name: "Brown Shearling",
        imageUrl: "https://i.ibb.co/s96FpdP/brown-shearling.png",
        price: 165,
      },
      {
        id: 22,
        name: "Tan Trench",
        imageUrl: "https://i.ibb.co/M6hHc3F/brown-trench.png",
        price: 185,
      },
    ],
  },
  {
    title: "Women's",
    slug: "womens",
    items: [
      {
        id: 23,
        name: "Blue Tanktop",
        imageUrl: "https://i.ibb.co/7CQVJNm/blue-tank.png",
        price: 25,
      },
      {
        id: 24,
        name: "Floral Blouse",
        imageUrl: "https://i.ibb.co/4W2DGKm/floral-blouse.png",
        price: 20,
      },
      {
        id: 25,
        name: "Floral Dress",
        imageUrl: "https://i.ibb.co/KV18Ysr/floral-skirt.png",
        price: 80,
      },
      {
        id: 26,
        name: "Red Dots Dress",
        imageUrl: "https://i.ibb.co/N3BN1bh/red-polka-dot-dress.png",
        price: 80,
      },
      {
        id: 27,
        name: "Striped Sweater",
        imageUrl: "https://i.ibb.co/KmSkMbH/striped-sweater.png",
        price: 45,
      },
      {
        id: 28,
        name: "Yellow Track Suit",
        imageUrl: "https://i.ibb.co/v1cvwNf/yellow-track-suit.png",
        price: 135,
      },
      {
        id: 29,
        name: "White Blouse",
        imageUrl: "https://i.ibb.co/qBcrsJg/white-vest.png",
        price: 20,
      },
    ],
  },
  {
    title: "Men's",
    slug: "mens",
    items: [
      {
        id: 30,
        name: "Camo Down Vest",
        imageUrl: "https://i.ibb.co/xJS0T3Y/camo-vest.png",
        price: 325,
      },
      {
        id: 31,
        name: "Floral T-shirt",
        imageUrl: "https://i.ibb.co/qMQ75QZ/floral-shirt.png",
        price: 20,
      },
      {
        id: 32,
        name: "Black & White Longsleeve",
        imageUrl: "https://i.ibb.co/55z32tw/long-sleeve.png",
        price: 25,
      },
      {
        id: 33,
        name: "Pink T-shirt",
        imageUrl: "https://i.ibb.co/RvwnBL8/pink-shirt.png",
        price: 25,
      },
      {
        id: 34,
        name: "Jean Long Sleeve",
        imageUrl: "https://i.ibb.co/VpW4x5t/roll-up-jean-shirt.png",
        price: 40,
      },
      {
        id: 35,
        name: "Burgundy T-shirt",
        imageUrl: "https://i.ibb.co/mh3VM1f/polka-dot-shirt.png",
        price: 25,
      },
    ],
  },
];
const BRANDS = new Array(5).fill(false).map(() => ({
  name: faker.lorem.word(),
}));

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash("123456", salt);
const USERS = new Array(100).fill(false).map(() => ({
  email: `${faker.lorem.word()}@mail.com`,
  password: hashedPassword,
  displayName: faker.person.fullName(),
}));

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};
const getReviewRatings = (ratingType, reviewsLength) => {
  if (ratingType < 5 && ratingType >= 0) {
    return {
      5: Math.floor(reviewsLength * 0.8),
      4: Math.floor(reviewsLength * 0.05),
      3: Math.floor(reviewsLength * 0.05),
      2: Math.floor(reviewsLength * 0.05),
      1: Math.floor(reviewsLength * 0.05),
    };
  } else if (ratingType >= 5 && ratingType < 8) {
    return {
      5: Math.floor(reviewsLength * 0.2),
      4: Math.floor(reviewsLength * 0.55),
      3: Math.floor(reviewsLength * 0.05),
      2: Math.floor(reviewsLength * 0.15),
      1: Math.floor(reviewsLength * 0.05),
    };
  } else if (ratingType === 8) {
    return {
      5: Math.floor(reviewsLength * 0.05),
      4: Math.floor(reviewsLength * 0.05),
      3: Math.floor(reviewsLength * 0.05),
      2: Math.floor(reviewsLength * 0.3),
      1: Math.floor(reviewsLength * 0.55),
    };
  } else if (ratingType === 9) {
    return {
      5: Math.floor(reviewsLength * 0.05),
      4: Math.floor(reviewsLength * 0.1),
      3: Math.floor(reviewsLength * 0.4),
      2: Math.floor(reviewsLength * 0.4),
      1: Math.floor(reviewsLength * 0.05),
    };
  } else {
    return {
      5: Math.floor(reviewsLength * 0.1),
      4: Math.floor(reviewsLength * 0.4),
      3: Math.floor(reviewsLength * 0.4),
      2: Math.floor(reviewsLength * 0.05),
      1: Math.floor(reviewsLength * 0.05),
    };
  }
};
const getReviewRating = (reviewRatings) => {
  let finalRating = 1;
  for (const rating in reviewRatings) {
    if (reviewRatings[rating] > 0) {
      reviewRatings[rating] = reviewRatings[rating] - 1;
      finalRating = parseInt(rating);
      break;
    }
  }
  return finalRating;
};

async function seedDB() {
  const deleteItems = prisma.item.deleteMany({});
  const deleteCategories = prisma.category.deleteMany({});
  const deleteBrands = prisma.brand.deleteMany({});
  const deleteReviews = prisma.review.deleteMany({});
  const deleteUsers = prisma.user.deleteMany({});
  const deleteCarts = prisma.cart.deleteMany({});

  await prisma.$transaction([
    deleteReviews,
    deleteUsers,
    deleteCarts,
    deleteItems,
    deleteCategories,
    deleteBrands,
  ]);

  await prisma.brand.createMany({
    data: BRANDS,
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  });

  const brands = await prisma.brand.findMany({});
  const users = await prisma.user.findMany({});

  for (const category of SHOP_DATA) {
    for (const itemOfCategory of category.items) {
      const brandIndex = getRandomNumber(0, brands.length - 1);

      const discountChance = getRandomNumber(1, 10);
      const discount =
        discountChance <= 3
          ? {
              dsicountedPrice: itemOfCategory.price * 0.8,
              offer: true,
            }
          : {};

      const viewed = getRandomNumber(0, 10000);
      let sold = getRandomNumber(0, 1000);
      while (sold > viewed) {
        sold = getRandomNumber(0, 1000);
      }
      let reviewsLength = getRandomNumber(0, sold);
      const reviewRatings = getReviewRatings(
        getRandomNumber(0, 10),
        reviewsLength,
      );

      await prisma.item.create({
        data: {
          name: itemOfCategory.name,
          price: itemOfCategory.price,
          images: [itemOfCategory.imageUrl],
          brand: { connect: { id: brands[brandIndex].id } },
          currentInventory: getRandomNumber(0, 20),
          viewed,
          sold,
          description: `Test description for ${itemOfCategory.name} that is of brand ${brands[brandIndex].name}`,

          details: new Array(4).fill(false).map(() => faker.lorem.sentence()),

          reviews: {
            create: new Array(reviewsLength).fill(false).map(() => ({
              title: faker.lorem.sentence(),
              body: faker.lorem.paragraph(),
              rating: getReviewRating(reviewRatings),
              // votes:
              //   Math.floor(
              //     (Math.random() * reviewsLength) / 2
              //   ) -
              //   Math.floor(
              //     (Math.random() * reviewsLength) / 2
              //   ),
              published: true,
              user: {
                connect: {
                  id: users[getRandomNumber(0, users.length - 1)].id,
                },
              },
            })),
          },

          categories: {
            connectOrCreate: [
              {
                create: {
                  name: "seed",
                  slug: "seed",
                },
                where: {
                  name: "seed",
                },
              },
              {
                create: {
                  name: category.title.toLowerCase(),
                  slug: category.slug,
                },
                where: {
                  name: category.title.toLowerCase(),
                },
              },
            ],
          },
          ...discount,
        },
      });
    }
  }

  const items = await prisma.item.findMany({
    select: { id: true, reviews: true },
  });

  for (const item of items) {
    await prisma.item.update({
      where: {
        id: item.id,
      },
      data: {
        reviewsCount: item.reviews.length,
        reviewsAvgRating:
          item.reviews.length > 0
            ? parseFloat(
                (
                  item.reviews.reduce((acc, { rating }) => acc + rating, 0) /
                  item.reviews.length
                ).toFixed(1),
              )
            : 0,
      },
    });

    for (let index = 1; index <= 5; index++) {
      const foundItem = await prisma.item.findUnique({
        where: {
          id: item.id,
        },
        select: {
          reviews: {
            where: {
              rating: index,
            },
          },
        },
      });
      await prisma.item.update({
        where: { id: item.id },
        data: {
          [`reviewsRated${index}Count`]: foundItem.reviews.length,
        },
      });
    }
  }
}

seedDB()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
