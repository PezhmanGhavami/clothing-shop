import { useEffect, useState } from "react";

import ReviewStars from "../product-review-stars/product-review-stars.component";

import { reviewPopulatedWithUser } from "../../pages/api/review/index";

interface IProductReview {
  review: reviewPopulatedWithUser;
  isUsersReview: boolean;
}

const ProductReview = ({
  review,
  isUsersReview,
}: IProductReview) => {
  const [commentDate, setCommentDate] = useState("");
  useEffect(() => {
    setCommentDate(
      new Date(review.createdAt).toLocaleDateString("en-GB")
    );
  }, [review.createdAt]);
  return (
    <div className="pt-6 pb-12 sm:flex relative">
      {/* Name, Rating, Date */}
      {!review.published && (
        <span
          className={
            "px-2 rounded-md absolute top-1 right-0 z-10 text-white bg-yellow-600"
          }
        >
          Under review
        </span>
      )}
      <div className="flex flex-col justify-between pr-6 sm:w-1/3 xl:w-1/4 2xl:w-1/5">
        <div>
          <ReviewStars rating={review.rating} />
          <div className="flex sm:flex-col items-center sm:items-start space-x-2 sm:space-x-0 ">
            <p className="py-2 font-medium capitalize">
              {review.user.displayName}
            </p>
            <p className="sm:pb-2 text-sm tracking-tighter text-slate-600 dark:text-slate-300">
              {commentDate}
            </p>
          </div>
        </div>
        {isUsersReview && (
          <div className="flex space-x-2">
            <p className="text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
              Edit
            </p>
            <p className="text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
              Delete
            </p>
          </div>
        )}
      </div>
      {/* Title and Body */}
      <div className="sm:w-2/3 xl:w-3/4 2xl:4/5 break-words">
        <h3 className="text-lg leading-none">
          {review.title}
        </h3>
        <p className="mt-2 font-light dark:text-slate-200">
          {review.body +
            `${
              review.createdAt !== review.updatedAt
                ? "-----Review edited at " +
                  review.updatedAt
                : ""
            }`}
        </p>
      </div>
    </div>
  );
};

export default ProductReview;
