import Image from "next/image";
import {
  AiFillStar,
  AiOutlineDollarCircle,
  AiOutlineGlobal,
} from "react-icons/ai";

import { IItemPopulatedWithReview } from "../../pages/product/[productID]";

const policies = [
  {
    name: "International delivery",
    icon: AiOutlineGlobal,
    description: "Get your order in 2 years",
  },
  {
    name: "Loyalty rewards",
    icon: AiOutlineDollarCircle,
    description: "Don't look at other tees",
  },
];

interface IProductOverview {
  product: IItemPopulatedWithReview;
}

const ProductOverview = ({ product }: IProductOverview) => {
  return (
    <div>
      <div className="pt-6 pb-16 sm:pb-24">
        <div className="mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:auto-rows-min lg:gap-x-8">
            <div className="lg:col-start-8 lg:col-span-5">
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900">
                  {product.name}
                </h1>
                <p className="text-xl font-medium text-gray-900">
                  {product.price}
                </p>
              </div>
              {/* Reviews */}
              <div className="mt-4">
                <h2 className="sr-only">Reviews</h2>
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    {product.reviewsScore}
                    <span className="sr-only">
                      {" "}
                      out of 5 stars
                    </span>
                  </p>
                  <div className="ml-1 flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <AiFillStar
                        key={rating}
                        className={
                          product.reviewsScore > rating
                            ? "text-yellow-400"
                            : "text-gray-200" +
                              " h-5 w-5 flex-shrink-0"
                        }
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div
                    aria-hidden="true"
                    className="ml-4 text-sm text-gray-300"
                  >
                    ·
                  </div>
                  <div className="ml-4 flex">
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      See all {product.reviewsCount} reviews
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Image gallery */}
            <div className="mt-8 lg:mt-0">
              <div className="relative h-[50vh] w-full overflow-hidden rounded-md bg-gray-200 hover:opacity-75">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  layout="fill"
                  quality={100}
                  priority
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="mt-8 lg:col-span-5">
              <button className="mt-6 bg-slate-100 shadow-md dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium tracking-tight h-11 w-full rounded-md">
                Add to cart
              </button>

              {/* Product details */}
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">
                  Description
                </h2>

                <div
                  className="mt-4 prose prose-sm text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-sm font-medium text-gray-900">
                  Fabric &amp; Care
                </h2>

                <div className="mt-4 prose prose-sm text-gray-500">
                  <ul role="list">
                    {product.details.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Policies */}
              <section
                aria-labelledby="policies-heading"
                className="mt-10"
              >
                <h2
                  id="policies-heading"
                  className="sr-only"
                >
                  Our Policies
                </h2>

                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"
                    >
                      <p>{review.user.displayName}</p>
                      <p>{review.score}</p>
                      <dt>
                        <span className="mt-4 text-sm font-medium text-gray-900">
                          {review.title}
                        </span>
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500">
                        {review.body}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
