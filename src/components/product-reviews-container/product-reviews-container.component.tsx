import ProductReview from "../product-review/product-review.component";
import ReviewStars from "../product-review-stars/product-review-stars.component";

import { reviewPopulatedWithUser } from "../../pages/product/[productID]";
interface IProductReviewsContainer {
  avgScore: number;
  reviewsCount: number;
  reviews: reviewPopulatedWithUser[];
}

const ProductReviewsContainer = ({
  reviews,
  avgScore,
  reviewsCount,
}: IProductReviewsContainer) => {
  return (
    <div
      id="reviews-section"
      className="sm:w-3/4 lg:w-2/4 mx-auto p-8 scroll-mt-20"
    >
      <h2 className="text-3xl text-center p-4">
        Customer Reviews
      </h2>
      {/* Score and filter */}
      <div className="flex flex-col items-center sm:flex-row sm:justify-center sm:divide-x border-b pb-12">
        {/* Score */}
        <div className="w-full pb-6 sm:p-0">
          <div className="flex justify-center text-3xl">
            <span className="pr-1 font-medium">
              {avgScore}
            </span>
            <ReviewStars score={avgScore} />
          </div>
          <p className="pt-2 text-center">
            Based on {reviewsCount} reviews
          </p>
        </div>
        {/* Filter */}
        <div className="w-full text-lg sm:pl-6">
          <p className="mb-2">Filter by stars</p>
          <div>
            <div
              title="only show 5 star ratings"
              className="flex items-center"
            >
              <ReviewStars score={5} />
              <div className="bg-neutral-200 h-3 w-full rounded-md overflow-hidden ml-4 mr-2">
                <div className="h-full w-3/4 bg-slate-900" />
              </div>
              <span className="text-sm">{`(${56})`}</span>
            </div>
            <div title="only show 4 star ratings">
              <ReviewStars score={4} />
            </div>
            <div title="only show 3 star ratings">
              <ReviewStars score={3} />
            </div>
            <div title="only show 2 star ratings">
              <ReviewStars score={2} />
            </div>
            <div title="only show 1 star ratings">
              <ReviewStars score={1} />
            </div>
          </div>
        </div>
      </div>
      {/* Reviews */}
      <div className="divide-y">
        {reviews.map((review) => (
          <ProductReview key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ProductReviewsContainer;
