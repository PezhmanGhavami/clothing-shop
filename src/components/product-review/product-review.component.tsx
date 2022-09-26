import ReviewStars from "../product-review-stars/product-review-stars.component";

import { reviewPopulatedWithUser } from "../../pages/product/[productID]";

interface IProductReview {
  review: reviewPopulatedWithUser;
}

const ProductReview = ({ review }: IProductReview) => {
  return (
    <div className="border-b last:border-0 pt-6 pb-12 sm:flex">
      {/* Name, Score, Date */}
      <div className="mb-4 pr-6 sm:w-1/3">
        <ReviewStars score={review.score} />
        <p className="py-2 font-medium">
          {review.user.displayName}
        </p>
        <p className="pb-2 text-sm text-slate-600 dark:text-slate-300">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>
      {/* Title and Body */}
      <div className="sm:w-full">
        <h3 className="text-lg leading-none">
          {review.title}
        </h3>
        <p className=" font-light dark:text-slate-200">
          {review.body}
        </p>
      </div>
    </div>
  );
};

export default ProductReview;
