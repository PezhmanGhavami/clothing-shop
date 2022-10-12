import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface IReviewStars {
  rating: number;
}

const ReviewStars = ({ rating }: IReviewStars) => {
  const roundedRating = Math.round(rating);
  return (
    <div
      title={`Rated ${rating} out of 5`}
      className="flex items-center"
    >
      {[1, 2, 3, 4, 5].map((rating) =>
        roundedRating >= rating ? (
          <AiFillStar key={rating} />
        ) : (
          <AiOutlineStar key={rating} />
        )
      )}
    </div>
  );
};

export default ReviewStars;
