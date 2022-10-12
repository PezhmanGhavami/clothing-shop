import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
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

import { reviewPopulatedWithUser } from "../../pages/api/review/index";
interface IProductReviewsContainer {
  avgRating: number;
  reviewsCount: number;
  ratingCounts: number[];
  productID: string;
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
      <div className="text-3xl flex justify-center sm:justify-end">
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
          className={`border hover:bg-neutral-100 dark:hover:bg-slate-800 text-sm font-medium tracking-tight h-9 w-3/5 rounded-md shadow mt-2`}
        >
          Write a review
        </button>
      </div>
    </div>
  );
};
const StarFilters = ({
  ratingCounts,
  reviewsCount,
}: {
  ratingCounts: number[];
  reviewsCount: number;
}) => {
  return (
    <div className="w-5/6 sm:w-full text-lg sm:pl-6">
      <p className="mb-2">Filter by stars</p>
      <div>
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <div
            key={rating}
            title={`only show ${rating} star ratings`}
            className="flex items-center hover:opacity-75 cursor-pointer"
          >
            <ReviewStars rating={rating} />
            <div className="bg-neutral-200 dark:bg-slate-700 h-3 w-2/5 rounded-md overflow-hidden ml-4 mr-2">
              <div
                className="h-full bg-slate-900 dark:bg-white"
                style={{
                  width: `${(
                    (ratingCounts[index] * 100) /
                    reviewsCount
                  ).toFixed(2)}%`,
                }}
              />
            </div>
            <span className="text-sm">{`(${ratingCounts[index]})`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
const FormModal = ({
  closeModal,
  itemID,
}: {
  closeModal: () => void;
  itemID: string;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    rating: 1,
    itemID: itemID,
  });
  const [ratingShadow, setRatingShadow] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement
    >
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
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);

    const headers = new Headers({
      "Content-Type": "application/json",
    });
    console.log(formData);
    try {
      await fetcher("/api/review", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });
      toast.success("Review created successfully.");
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
    <div className="fixed inset-x-0 bottom-1/2 z-30 border bg-slate-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-600 shadow-md rounded-xl p-4 pb-6 mx-auto w-11/12 md:w-3/5 xl:w-2/5">
      {/* Title and close button */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-medium">
          Add a review
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
        <div className="pb-2 space-y-1">
          <label htmlFor="">Rating: </label>
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
        <div className="flex flex-col rounded-md overflow-hidden border border-neutral-200 dark:border-slate-600">
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
            className="h-9 p-2 dark:bg-slate-900 border-2 border-transparent rounded-t-md focus-within:outline-none focus-within:border-blue-400 placeholder:text-slate-500 dark:placeholder:text-slate-300 placeholder:text-xl"
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
            className="h-24 p-2 dark:bg-slate-900 border-2 border-transparent rounded-b-md focus-within:outline-none focus-within:border-blue-400 resize-none placeholder:text-slate-500 dark:placeholder:text-slate-300 placeholder:text-base"
            tabIndex={2}
          />
        </div>
        <button
          className="bg-green-700 hover:bg-green-800 active:bg-green-900 rounded-md h-9 font-medium tracking-tight w-full text-white mt-2"
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

const ProductReviewsContainer = ({
  avgRating,
  reviewsCount,
  ratingCounts,
  productID,
}: IProductReviewsContainer) => {
  const [reviews, setReviews] = useState<
    reviewPopulatedWithUser[] | null
  >(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    let abortPromise = false;
    const query = `itemID=${productID}&sortBy=votes&sortMethod=desc`;
    // asc
    //desc
    fetcher("/api/review?" + query, {
      method: "GET",
    })
      .then((res) => {
        if (!abortPromise) {
          setReviews(res);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong.");
        }
      });

    return () => {
      abortPromise = true;
    };
  }, [productID]);

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
          <Overlay handleClick={closeModal} />
          <FormModal
            closeModal={closeModal}
            itemID={productID}
          />
        </>
      )}
      <div
        id="reviews-section"
        className="sm:w-3/4 lg:w-2/4 mx-auto p-8 scroll-mt-20"
      >
        <h2 className="text-3xl text-center p-4 pb-12">
          Customer Reviews
        </h2>
        {/* Rating and filter */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-center sm:divide-x border-b pb-12">
          {/* Rating */}
          <AverageRating
            handleClick={toggleModal}
            avgRating={avgRating}
            reviewsCount={reviewsCount}
          />
          {/* Filter */}
          <StarFilters
            reviewsCount={reviewsCount}
            ratingCounts={ratingCounts}
          />
        </div>
        {/* Reviews */}
        {reviews ? (
          <div className="divide-y">
            {reviews.map((review) => (
              <ProductReview
                key={review.id}
                review={review}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-3xl">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductReviewsContainer;
