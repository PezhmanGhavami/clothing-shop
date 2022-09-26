import ProductReview from "../product-review/product-review.component";

import { reviewPopulatedWithUser } from "../../pages/product/[productID]";
interface IProductReviewsContainer {
  reviews: reviewPopulatedWithUser[];
}

const ProductReviewsContainer = ({
  reviews,
}: IProductReviewsContainer) => {
  return (
    <div id="reviews-section" className="sm:w-3/4 lg:w-2/4 mx-auto p-8">
      <h2 className="text-3xl text-center p-4">Customer Reviews</h2>
      {reviews.map((review) => (
        <ProductReview key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ProductReviewsContainer;
