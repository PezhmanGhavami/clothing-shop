import ProductReview from "../product-review/product-review.component";
import ReviewStars from "../product-review-stars/product-review-stars.component";

import { reviewPopulatedWithUser } from "../../pages/product/[productID]";
interface IProductReviewsContainer {
  avgScore: number;
  reviewsCount: number;
  reviews: reviewPopulatedWithUser[];
  scoreCounts: number[];
}

const ProductReviewsContainer = ({
  reviews,
  avgScore,
  reviewsCount,
  scoreCounts,
}: IProductReviewsContainer) => {
  return (
    <div
      id="reviews-section"
      className="sm:w-3/4 lg:w-2/4 mx-auto p-8 scroll-mt-20"
    >
      <h2 className="text-3xl text-center p-4 pb-12">
        Customer Reviews
      </h2>
      {/* Score and filter */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-center sm:divide-x border-b pb-12">
        {/* Score */}
        <div className="w-full pb-6 sm:pb-0 sm:pr-6">
          <div className="text-3xl flex justify-center sm:justify-end">
            <span className="pr-1 font-medium">
              {avgScore.toFixed(1)}
            </span>
            <ReviewStars score={avgScore} />
          </div>
          <p className="pt-2 text-center sm:text-right">
            Based on {reviewsCount} reviews
          </p>
        </div>
        {/* Filter */}
        <div className="w-5/6 sm:w-full text-lg sm:pl-6">
          <p className="mb-2">Filter by stars</p>
          <div>
            {[5, 4, 3, 2, 1].map((score, index) => (
              <div
                key={score}
                title={`only show ${score} star ratings`}
                className="flex items-center hover:opacity-75 cursor-pointer"
              >
                <ReviewStars score={score} />
                <div className="bg-neutral-200 h-3 w-2/5 rounded-md overflow-hidden ml-4 mr-2">
                  <div
                    className="h-full bg-slate-900"
                    style={{
                      width: `${(
                        (scoreCounts[index] * 100) /
                        reviewsCount
                      ).toFixed(2)}%`,
                    }}
                  />
                </div>
                <span className="text-sm">{`(${scoreCounts[index]})`}</span>
              </div>
            ))}
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
