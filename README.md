An e-commerce prototype website, made to be a playground for trying out different kinds of tech.

It utilizes the best practices of Next.js such as SSG and ISR while taking advantage of the new React Server Components and Server Actions, plus the new Metadata export to deliver lightning fast load times and amazing SEO.

You can checkout the live version [here](https://clothingshop.pezhmanghavami.com/)

## Get Started

```
┌── /.github
|   └── /workflows            # Github Actions workflows
|
├── /prisma                   # Prisma schema and database associated files
|
├── /public                   # Static assets
|
├── /src
│   ├── /app                  # Next.js app router, including renderable pages, some page-specific components, and API endpoints
│   ├── /components           # Shared React components
│   ├── /hooks                # Reusable custom hooks
│   ├── /styles               # Global stylings and some style notes
│   └── /utils                # Utility modules
```

## Stack

This project uses the following libraries and services:

- Framework - [Next.js](https://nextjs.org/)
- Frontend - [React](https://react.dev/)
- Styling - [Tailwind CSS](https://tailwindcss.com/)
- Async state manager - [SWR](https://swr.vercel.app/)
- API - [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- Session utility - [iron-session](https://github.com/vvo/iron-session)
- Database - [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io)

## To run locally:

> 1 - run `npm i`
>
> 2 - Setup your database as instructed by [prisma docs](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgres)
>
> 3 - Populate your database by running the seed script `npx prisma db seed`
>
> 4 - Add the following variable for [iron-session](https://github.com/vvo/iron-session) to your .env file
> `SECRET_COOKIE_PASSWORD="complex_password_at_least_32_characters_long"`
>
> 5 - Add this variable for the root Metadata export to your .env file
> `BASE_URL="http://localhost:3000"`
>
> 6 - Start the project by running `npm run dev`

All images and product names are from the Crwn Clowthing Project of [ZTM React course](https://www.udemy.com/course/complete-react-developer-zero-to-mastery/)
