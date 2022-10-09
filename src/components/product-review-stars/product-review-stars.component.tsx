import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface IReviewStars {
  score: number;
}

const ReviewStars = ({ score }: IReviewStars) => {
  const roundedScore = Math.round(score);
  return (
    <div
      title={`Rated ${score} out of 5`}
      className="flex items-center"
    >
      {[1, 2, 3, 4, 5].map((rating) =>
        roundedScore >= rating ? (
          <AiFillStar key={rating} />
        ) : (
          <AiOutlineStar key={rating} />
        )
      )}
    </div>
  );
};

export default ReviewStars;
