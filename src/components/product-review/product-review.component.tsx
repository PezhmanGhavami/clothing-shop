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
    <div className="pt-6 pb-12 sm:flex relative">
      {/* Confirm delete modal */}
      {openModal && (
        <>
          <Overlay handleClick={closeModal} />
          <div className="fixed inset-x-0 bottom-1/2 z-30 border bg-slate-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-600 shadow-md rounded-xl p-4 pb-6 mx-auto w-11/12 md:w-3/5 xl:w-2/5 h-1/5">
            <div className="flex flex-col justify-center items-center w-full h-full">
              <p className="text-center text-xl">
                Are you sure you want to delete this review?
              </p>
              <div className="pt-4 w-full flex justify-center space-x-2">
                <button
                  className="bg-green-700 hover:bg-green-800 active:bg-green-900 rounded-md h-9 font-semibold w-2/5 text-white"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-md h-9 font-semibold w-2/5 text-white"
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
            "px-2 rounded-md absolute top-1 right-0 z-10 text-white bg-yellow-600"
          }
        >
          Under review
        </span>
      )}
      {/* Name, Rating, Date, edit and delete */}
      <div className="flex flex-col justify-between pr-6 sm:w-1/3 xl:w-1/4 2xl:w-1/5">
        <div>
          <ReviewStars rating={review.rating} />
          <div className="flex sm:flex-col items-center sm:items-start space-x-2 sm:space-x-0 ">
            <p className="py-2 font-medium capitalize">
              {review.user.displayName}
            </p>
            <p className="sm:pb-2 text-sm tracking-tighter text-slate-600 dark:text-slate-300">
              {reviewDate}
            </p>
          </div>
        </div>
        {isUsersReview && (
          <div className="flex pb-2 sm:p-0 space-x-2">
            <p
              onClick={editReview}
              className="text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Edit
            </p>
            <p
              onClick={openOpenModal}
              className="text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
            >
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
                ? "  ----- Edited"
                : ""
            }`}
        </p>
      </div>
    </div>
  );
};

export default ProductReview;
