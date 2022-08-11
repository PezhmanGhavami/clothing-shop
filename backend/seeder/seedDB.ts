import prisma from "../utils/prisma-client";
import { SHOP_DATA, BRANDS } from "./shop-data";

async function seedDB() {
  const deleteItems = prisma.item.deleteMany({});
  const deleteCategories = prisma.category.deleteMany({});
  const deleteBrands = prisma.brand.deleteMany({});

  await prisma.$transaction([
    deleteItems,
    deleteCategories,
    deleteBrands,
  ]);

  await prisma.brand.createMany({
    data: BRANDS,
    skipDuplicates: true,
  });

  for (const category of SHOP_DATA) {
    await prisma.category.create({
      data: {
        name: category.title,
      },
    });

    const brands = await prisma.brand.findMany({});
    for (const itemOfCategory of category.items) {
      const brandIndex = Math.floor(Math.random() * 4);

      await prisma.item.create({
        data: {
          name: itemOfCategory.name,
          price: itemOfCategory.price,
          images: [itemOfCategory.imageUrl],
          brand: { connect: { id: brands[brandIndex].id } },
          currentInventory: Math.floor(Math.random() * 20),
          description: `test description for an item that is of brand ${brands[brandIndex].name}`,
          categories: {
            connectOrCreate: [
              {
                create: {
                  name: "seed",
                },
                where: {
                  name: "seed",
                },
              },
              {
                create: {
                  name: category.title,
                },
                where: {
                  name: category.title,
                },
              },
            ],
          },
        },
      });
    }
  }
}

seedDB();
