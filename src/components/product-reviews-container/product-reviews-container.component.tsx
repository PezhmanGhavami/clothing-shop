import { useState, ChangeEvent, FormEvent } from "react";

import ProductReview from "../product-review/product-review.component";
import ReviewStars from "../product-review-stars/product-review-stars.component";
import Overlay from "../overlay/overlay.component";
import { AiOutlineClose } from "react-icons/ai";

import { reviewPopulatedWithUser } from "../../pages/product/[productID]";
interface IProductReviewsContainer {
  avgScore: number;
  reviewsCount: number;
  reviews: reviewPopulatedWithUser[];
  scoreCounts: number[];
}

const AverageScore = ({
  avgScore,
  reviewsCount,
  handleClick,
}: {
  avgScore: number;
  reviewsCount: number;
  handleClick: () => void;
}) => {
  return (
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
      <div className="flex justify-center sm:justify-end">
        <button
          onClick={handleClick}
          className={`border hover:bg-neutral-100 dark:hover:bg-slate-800 text-sm font-medium tracking-tight h-9 w-3/5 rounded-md shadow mt-2`}
        >
          Write a review
        </button>
      </div>
    </div>
  );
};
const StarFilters = ({
  scoreCounts,
  reviewsCount,
}: {
  scoreCounts: number[];
  reviewsCount: number;
}) => {
  return (
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
            <div className="bg-neutral-200 dark:bg-slate-700 h-3 w-2/5 rounded-md overflow-hidden ml-4 mr-2">
              <div
                className="h-full bg-slate-900 dark:bg-white"
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
  );
};
const FormModal = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    score: 1,
  });
  const handleChange = (
    event: ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement
    >
  ) => {
    setFormData((formData) => ({
      ...formData,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
  };
  return (
    <div className="px-4 lg:px-8">
      <div className="border bg-slate-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-600 shadow-md rounded-xl p-4 mx-auto md:w-3/5 xl:w-2/5">
        {/* Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-medium">
            Add a review
          </h2>
          <button
            type="button"
            title="Close"
            className="hover:text-slate-600 dark:hover:text-slate-300"
            onClick={closeModal}
          >
            <AiOutlineClose
              className="h-6 w-6"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="border bg-white dark:bg-slate-900 dark:border-slate-600 rounded-md overflow-hidden">
            <label
              htmlFor="review-title"
              className="sr-only"
            >
              Review title
            </label>
            <input
              type="text"
              name="title"
              id="review-title"
              className="w-full h-9 px-2 dark:bg-slate-900 focus:outline-none border-2 border-transparent focus:border-blue-400"
              placeholder="Write a title..."
              value={formData.title}
              onChange={handleChange}
              tabIndex={1}
              autoFocus
            />
            <label
              htmlFor="review-body"
              className="sr-only"
            >
              Review body
            </label>
            <textarea
              name="body"
              id="review-body"
              className="w-full h-24 px-2 dark:bg-slate-900 focus:outline-none border-2 border-transparent focus:border-blue-400 resize-none"
              placeholder="Write your review..."
              value={formData.body}
              onChange={handleChange}
              tabIndex={2}
            />
          </div>

          <button
            className="bg-green-700 hover:bg-green-800 active:bg-green-900 rounded-md h-9 font-medium tracking-tight w-full text-white mt-2"
            tabIndex={3}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const ProductReviewsContainer = ({
  reviews,
  avgScore,
  reviewsCount,
  scoreCounts,
}: IProductReviewsContainer) => {
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };
  const closeModal = () => {
    setOpenModal(false);
  };
  return (
    <>
      {openModal && (
        <>
          {/* <Overlay handleClick={closeModal} /> */}
          <FormModal closeModal={closeModal} />
        </>
      )}
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
          <AverageScore
            handleClick={toggleModal}
            avgScore={avgScore}
            reviewsCount={reviewsCount}
          />
          {/* Filter */}
          <StarFilters
            reviewsCount={reviewsCount}
            scoreCounts={scoreCounts}
          />
        </div>
        {/* Reviews */}
        <div className="divide-y">
          {reviews.map((review) => (
            <ProductReview
              key={review.id}
              review={review}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductReviewsContainer;
