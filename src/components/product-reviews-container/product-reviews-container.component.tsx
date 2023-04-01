import {
  useState,
  ChangeEvent,
  FormEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { toast } from "react-toastify";
import {
  AiOutlineClose,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import ProductReview from "../product-review/product-review.component";
import ReviewStars from "../product-review-stars/product-review-stars.component";
import Overlay from "../overlay/overlay.component";
import Loading from "../loading/loading.component";
import fetcher from "../../utils/fetcher";
import useReview from "../../hooks/useReview";
import useUser from "../../hooks/useUser";

import { reviewPopulatedWithUser } from "../../pages/api/review/index";
interface IRatingCounts {
  rated1: number;
  rated2: number;
  rated3: number;
  rated4: number;
  rated5: number;
}
interface IProductReviewsContainer {
  productID: string;
  avgRating: number;
  reviewsCount: number;
  ratingCounts: IRatingCounts;
}
export interface IReviewFormData {
  rating: number;
  title: string;
  body: string;
}

const AverageRating = ({
  avgRating,
  reviewsCount,
  handleClick,
}: {
  avgRating: number;
  reviewsCount: number;
  handleClick: () => void;
}) => {
  return (
    <div className="w-full pb-6 sm:pb-0 sm:pr-6">
      <div className="flex justify-center text-3xl sm:justify-end">
        <span className="pr-1 font-medium">
          {avgRating.toFixed(1)}
        </span>
        <ReviewStars rating={avgRating} />
      </div>
      <p className="pt-2 text-center sm:text-right">
        Based on {reviewsCount} reviews
      </p>
      <div className="flex justify-center sm:justify-end">
        <button
          onClick={handleClick}
          className={`mt-2 h-9 w-3/5 rounded-md border text-sm font-medium tracking-tight shadow hover:bg-neutral-100 dark:hover:bg-slate-800`}
        >
          Write a review
        </button>
      </div>
    </div>
  );
};
const StarFilters = ({
  handleSetFilter,
  ratingCounts,
  reviewsCount,
}: {
  ratingCounts: IRatingCounts;
  reviewsCount: number;
  handleSetFilter: (rating: number) => void;
}) => {
  const [selectedFilter, setSelectedFilter] = useState(0);
  const selectNewFilter = (newFilter: number) => {
    setSelectedFilter(newFilter);
    handleSetFilter(newFilter);
  };
  type ratingCountKeys = keyof typeof ratingCounts;
  return (
    <div className="w-5/6 text-lg sm:w-full sm:pl-6">
      <div className="flex justify-between">
        <p className="mb-2">Filter by stars</p>
        {selectedFilter !== 0 && (
          <span
            className="cursor-pointer text-blue-700 hover:underline dark:text-blue-400"
            onClick={() => selectNewFilter(0)}
          >
            Reset
          </span>
        )}
      </div>
      <div>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div
            onClick={() => {
              selectNewFilter(rating);
            }}
            key={rating}
            title={`only show ${rating} star reviews`}
            className={`flex items-center justify-center sm:hover:opacity-75 cursor-pointer${
              selectedFilter !== 0 &&
              selectedFilter !== rating
                ? " opacity-60"
                : ""
            }`}
          >
            <ReviewStars rating={rating} />
            <div className="ml-4 mr-2 h-3 w-1/2 overflow-hidden rounded-md bg-neutral-200 dark:bg-slate-700">
              <div
                className="h-full bg-slate-900 dark:bg-white"
                style={{
                  width: `${(
                    (ratingCounts[
                      `rated${rating}` as ratingCountKeys
                    ] *
                      100) /
                    reviewsCount
                  ).toFixed(2)}%`,
                }}
              />
            </div>
            <span className="basis-8 text-sm">{`(${
              ratingCounts[
                `rated${rating}` as ratingCountKeys
              ]
            })`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
const FormModal = ({
  itemID,
  reviewID,
  formData,
  setFormData,
  closeModal,
  mutateReviews,
}: {
  itemID: string;
  reviewID?: string;
  formData: IReviewFormData;
  setFormData: Dispatch<SetStateAction<IReviewFormData>>;
  closeModal: () => void;
  mutateReviews: () => void;
}) => {
  const [ratingShadow, setRatingShadow] = useState(
    formData.rating,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleRatingChange = (newRating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating: newRating,
    }));
    setRatingShadow(newRating);
  };
  const handleMouseOver = (newShadowRating: number) => {
    setRatingShadow(newShadowRating);
  };
  const handleMouseLeave = () => {
    setRatingShadow(formData.rating);
  };
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);

    const headers = new Headers({
      "Content-Type": "application/json",
    });
    try {
      const apiUrl = reviewID
        ? `/api/review/${reviewID}`
        : "/api/review";
      const payload = reviewID
        ? { ...formData }
        : { ...formData, itemID };
      const res = await fetcher(apiUrl, {
        method: reviewID ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });
      toast.success(res.message);
      mutateReviews();
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-x-0 bottom-1/2 z-30 mx-auto w-11/12 translate-y-1/2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 pb-6 shadow-md dark:border-slate-600 dark:bg-slate-800 md:w-3/5 xl:w-2/5">
      {/* Title and close button */}
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-medium md:text-2xl">
          {reviewID ? "Edit your review" : "Add a review"}
        </h2>
        <button
          onClick={closeModal}
          title="Click to close modal"
          className="hover:text-slate-600 dark:hover:text-slate-300"
        >
          <AiOutlineClose
            className="h-6 w-6"
            aria-hidden="true"
          />
        </button>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div
          title={`Rated ${formData.rating} out of 5`}
          className="space-y-1 pb-2"
        >
          <label>Rating: </label>
          <div className="flex items-center text-2xl">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                type="button"
                title={`${rating} ${
                  rating === 1 ? "star" : "stars"
                }`}
                onClick={() => handleRatingChange(rating)}
                onMouseOver={() => handleMouseOver(rating)}
                onMouseLeave={handleMouseLeave}
                key={rating}
              >
                {ratingShadow >= rating ? (
                  <AiFillStar />
                ) : (
                  <AiOutlineStar />
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Text inputs */}
        <div className="flex flex-col overflow-hidden rounded-md border border-neutral-200 dark:border-slate-600">
          <label htmlFor="review-title" className="sr-only">
            Write a title
          </label>
          <input
            type="text"
            name="title"
            id="review-title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="h-9 rounded-t-md border-2 border-transparent p-2 placeholder:text-xl placeholder:text-slate-500 focus-within:border-blue-400 focus-within:outline-none dark:bg-slate-900 dark:placeholder:text-slate-300"
            tabIndex={1}
            autoFocus
          />
          <label htmlFor="review-body" className="sr-only">
            Write your review
          </label>
          <textarea
            name="body"
            id="review-body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Write your review..."
            className="h-24 resize-none rounded-b-md border-2 border-transparent p-2 placeholder:text-base placeholder:text-slate-500 focus-within:border-blue-400 focus-within:outline-none dark:bg-slate-900 dark:placeholder:text-slate-300"
            tabIndex={2}
          />
        </div>
        {/* Submit */}
        <button
          className="mt-2 h-9 w-full rounded-md bg-green-700 font-medium tracking-tight text-white hover:bg-green-800 active:bg-green-900"
          title={
            isLoading
              ? "Submitting your review..."
              : "Click to submit your review"
          }
          tabIndex={3}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loading /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

const sortOptions = {
  // mostPopular: ["votes", "desc"],
  // leastPopular: ["votes", "asc"],
  newest: ["createdAt", "desc"],
  oldest: ["createdAt", "asc"],
};

Object.freeze(sortOptions);

const cleanFormData = {
  title: "",
  body: "",
  rating: 1,
};

const ProductReviewsContainer = ({
  productID,
  avgRating,
  reviewsCount,
  ratingCounts,
}: IProductReviewsContainer) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSortOption, setSelectedSortOption] =
    useState("newest");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showUserReviews, setShowUserReviews] =
    useState(false);
  const [reviewID, setReviewID] = useState<
    string | undefined
  >(undefined);
  const [formData, setFormData] = useState(cleanFormData);

  const [sortBy, sortMethod] =
    sortOptions[
      selectedSortOption as keyof typeof sortOptions
    ];
  const { reviewsData, mutateReviews } = useReview({
    page: page,
    itemID: productID,
    sortBy: sortBy,
    sortMethod: sortMethod,
    selectedFilter: filter,
    showUserReviews: showUserReviews,
  });
  const { user } = useUser();

  const handleSetFilter = (rating: number) => {
    const newFilter =
      rating !== 0 ? `&selectedFilter=${rating}` : "";
    setPage(1);
    setFilter(newFilter);
  };
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      globalThis.document
        .getElementById("reviews-sort")
        ?.scrollIntoView();
    }
  };
  const handleNextPage = () => {
    if (reviewsData && reviewsData.pages >= page) {
      setPage((prev) => prev + 1);
      globalThis.document
        .getElementById("reviews-sort")
        ?.scrollIntoView();
    }
  };
  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };
  const closeModal = () => {
    setOpenModal(false);
    setReviewID(undefined);
    setFormData(cleanFormData);
  };
  const toggleShowUserReviews = () => {
    setShowUserReviews((prev) => !prev);
  };
  const handleSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setPage(1);
    setSelectedSortOption(event.target.value);
  };
  const handleDeleteReview = async (reviewID: string) => {
    try {
      const res = await fetcher("/api/review/" + reviewID, {
        method: "DELETE",
      });
      mutateReviews();
      toast.success(res.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
    }
  };
  const handleEditReview = (
    reviewID: string,
    formData: IReviewFormData,
  ) => {
    setReviewID(reviewID);
    setFormData(formData);
    toggleModal();
  };

  return (
    <div
      id="reviews-section"
      className="mx-auto scroll-mt-20 p-8 sm:w-3/4 lg:w-2/4"
    >
      {/* Form modal */}
      {openModal && (
        <>
          <Overlay handleClick={closeModal} />
          <FormModal
            itemID={productID}
            reviewID={reviewID}
            formData={formData}
            setFormData={setFormData}
            closeModal={closeModal}
            mutateReviews={mutateReviews}
          />
        </>
      )}
      <h2 className="p-4 pb-12 text-center text-3xl">
        Customer Reviews
      </h2>
      {/* Rating, sort and filter */}
      <div>
        {/* Rating and filter */}
        <div className="flex flex-col items-center border-b pb-12 sm:flex-row sm:items-start sm:justify-center sm:divide-x">
          {/* Rating */}
          <AverageRating
            handleClick={toggleModal}
            avgRating={avgRating}
            reviewsCount={reviewsCount}
          />
          {/* Filter */}
          <StarFilters
            handleSetFilter={handleSetFilter}
            reviewsCount={reviewsCount}
            ratingCounts={ratingCounts}
          />
        </div>
        {/* Sort and user reviews */}
        <div
          id="reviews-sort"
          className="flex scroll-mt-20 justify-between border-b py-2"
        >
          {/* Sort */}
          <div className="flex">
            <p className="mr-1">Sort by</p>
            <select
              className="rounded-md bg-white hover:cursor-pointer dark:bg-slate-900 dark:text-white"
              value={selectedSortOption}
              onChange={handleSelectChange}
              name="sortOptionSelector"
              id="sort-option-selector"
            >
              {/* <option value="mostPopular">
                most popular
              </option>
              <option value="leastPopular">
                least popular
              </option> */}
              <option value="newest">newest</option>
              <option value="oldest">oldest</option>
            </select>
          </div>
          {/* User reviews */}
          {user?.isLoggedIn && (
            <div>
              <p
                title={
                  showUserReviews
                    ? "Click to go back to all reviews"
                    : "Click to see your reviews"
                }
                onClick={toggleShowUserReviews}
                className="cursor-pointer text-blue-700 hover:underline dark:text-blue-400"
              >
                {showUserReviews
                  ? "Back to all reviews"
                  : "See your reviews"}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Reviews */}
      <div className="divide-y">
        {reviewsData ? (
          reviewsData.reviews.length > 0 ? (
            reviewsData.reviews.map((review) => (
              <ProductReview
                key={review.id}
                handleEditReview={handleEditReview}
                handleDeleteReview={handleDeleteReview}
                isUsersReview={
                  review.userId === user?.userID
                }
                review={review as reviewPopulatedWithUser}
              />
            ))
          ) : (
            <div className="py-20 text-3xl">
              There are no reviews yet
            </div>
          )
        ) : (
          <div className="py-80 text-3xl sm:py-96">
            <Loading />
          </div>
        )}
      </div>
      {/* Pagination */}
      {/* TODO - Make this infinity scroll */}
      {reviewsData && (
        <div className="flex items-center justify-between space-x-1 pb-6">
          <div className="w-1/2">
            {page > 1 && (
              <button
                onClick={handlePreviousPage}
                className={`h-9 w-full rounded-md border text-sm font-medium tracking-tight shadow sm:hover:bg-neutral-100 sm:dark:hover:bg-slate-800`}
              >
                Previous
              </button>
            )}
          </div>
          <div className="w-1/2">
            {reviewsData.pages >= page && (
              <button
                onClick={handleNextPage}
                className={`h-9 w-full rounded-md border text-sm font-medium tracking-tight shadow sm:hover:bg-neutral-100 sm:dark:hover:bg-slate-800`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewsContainer;
