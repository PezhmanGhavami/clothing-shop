import { useEffect, useState } from "react";

import ReviewStars from "../product-review-stars/product-review-stars.component";
import Overlay from "../overlay/overlay.component";
import { reviewPopulatedWithUser } from "../../pages/api/review/index";
import { IReviewFormData } from "../product-reviews-container/product-reviews-container.component";
interface IProductReview {
  review: reviewPopulatedWithUser;
  isUsersReview: boolean;
  handleDeleteReview: (reviewID: string) => void;
  handleEditReview: (
    reviewID: string,
    formData: IReviewFormData
  ) => void;
}

const ProductReview = ({
  review,
  isUsersReview,
  handleEditReview,
  handleDeleteReview,
}: IProductReview) => {
  const [reviewDate, setReviewDate] = useState("");
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    setReviewDate(
      new Date(review.createdAt).toLocaleDateString("en-GB")
    );
  }, [review.createdAt]);

  const openOpenModal = () => {
    setOpenModal(true);
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  const editReview = () => {
    handleEditReview(review.id, {
      rating: review.rating,
      title: review.title,
      body: review.body,
    });
  };

  const deleteReview = () => {
    closeModal();
    handleDeleteReview(review.id);
  };

  return (
    <div className="relative pt-6 pb-12 sm:flex">
      {/* Confirm delete modal */}
      {openModal && (
        <>
          <Overlay handleClick={closeModal} />
          <div className="fixed inset-x-0 bottom-1/2 z-30 mx-auto w-11/12 max-w-md translate-y-1/2 rounded-xl border border-neutral-200 bg-slate-50 py-6 shadow-md dark:border-slate-600 dark:bg-slate-800">
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-center text-xl">
                Are you sure you want to delete this review?
              </p>
              <div className="flex w-full justify-center space-x-2 pt-4">
                <button
                  className="h-9 w-2/5 rounded-md bg-green-700 font-semibold text-white hover:bg-green-800 active:bg-green-900"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="h- w-2/5 rounded-md bg-red-700 font-semibold text-white hover:bg-red-800 active:bg-red-900"
                  onClick={deleteReview}
                >
                  Delete review
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {!review.published && (
        <span
          className={
            "absolute top-1 right-0 z-10 rounded-md bg-yellow-600 px-2 text-white"
          }
        >
          Under review
        </span>
      )}
      {/* Name, Rating, Date, edit and delete */}
      <div className="flex flex-col justify-between pr-6 sm:w-1/3 xl:w-1/4 2xl:w-1/5">
        <div>
          <ReviewStars rating={review.rating} />
          <div className="flex items-center space-x-2 sm:flex-col sm:items-start sm:space-x-0 ">
            <p className="py-2 font-medium capitalize">
              {review.user.displayName}
            </p>
            <p className="text-sm tracking-tighter text-slate-600 dark:text-slate-300 sm:pb-2">
              {reviewDate}
            </p>
          </div>
        </div>
        {isUsersReview && (
          <div className="flex space-x-2 pb-2 sm:p-0">
            <p
              onClick={editReview}
              className="cursor-pointer text-blue-700 hover:underline dark:text-blue-400"
            >
              Edit
            </p>
            <p
              onClick={openOpenModal}
              className="cursor-pointer text-blue-700 hover:underline dark:text-blue-400"
            >
              Delete
            </p>
          </div>
        )}
      </div>
      {/* Title and Body */}
      <div className="2xl:4/5 break-words sm:w-2/3 xl:w-3/4">
        <h3 className="text-lg leading-none">
          {review.title}
        </h3>
        <p className="mt-2 font-light dark:text-slate-200">
          {review.body +
            `${
              review.createdAt !== review.updatedAt
                ? "  ----- Edited"
                : ""
            }`}
        </p>
      </div>
    </div>
  );
};

export default ProductReview;
