import { useEffect, useState } from "react";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";

import ReviewStars from "../product-review-stars/product-review-stars.component";

import { reviewPopulatedWithUser } from "../../pages/api/review/index";

interface IProductReview {
  review: reviewPopulatedWithUser;
}

const ProductReview = ({ review }: IProductReview) => {
  const [commentDate, setCommentDate] = useState("");
  useEffect(() => {
    setCommentDate(
      new Date(review.createdAt).toLocaleDateString("en-GB")
    );
  }, [review.createdAt]);
  return (
    <div className="pt-6 pb-12 sm:flex">
      {/* Name, Rating, Date */}
      <div className="mb-4 pr-6 sm:w-1/3">
        <ReviewStars rating={review.rating} />
        <p className="py-2 font-medium">
          {review.user.displayName}
        </p>
        <p className="pb-2 text-sm text-slate-600 dark:text-slate-300">
          {commentDate}
        </p>
      </div>
      {/* Title and Body */}
      <div className="sm:w-full overflow-hidden text-clip">
        <h3 className="text-lg leading-none">
          {review.title}
        </h3>
        <p className="mt-2 font-light dark:text-slate-200">
          {review.body}
        </p>
      </div>
    </div>
  );
};

export default ProductReview;
