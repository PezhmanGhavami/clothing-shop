import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface IReviewStars {
  score: number;
}

const ReviewStars = ({ score }: IReviewStars) => {
  return (
    <div
      title={`Rated ${score} out of 5`}
      className="flex items-center"
    >
      {[1, 2, 3, 4, 5].map((rating) =>
        score >= rating ? (
          <AiFillStar key={rating} />
        ) : (
          <AiOutlineStar key={rating} />
        )
      )}
    </div>
  );
};

export default ReviewStars;
