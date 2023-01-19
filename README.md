An e-commerce prototype website, made to be a playground for trying out different kinds of tech.

It utilizes the best practices of Next.js such as SSG and ISR while taking advantage of the next image and next head modules to deliver lightning fast load times and amazing SEO.

You can checkout the live version [here](https://clothingshop.pejmanghavami.com/)

To run locally:

> 1 - run `npm i`
>
> 2 - Setup your database as instructed by [prisma docs](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgres)
>
> 3 - Populate your database by running the seed script `npx prisma db seed`
>
> 4 - Add the following variable for [iron-session](https://github.com/vvo/iron-session) to your .env file
> `SECRET_COOKIE_PASSWORD="complex_password_at_least_32_characters_long"`
>
> 5 - Start the project by running `npm run dev`

All images and product names are from the Crwn Clowthing Project of [ZTM React course](https://www.udemy.com/course/complete-react-developer-zero-to-mastery/)
