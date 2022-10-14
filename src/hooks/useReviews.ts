import useSWR from "swr";

import fetcher from "../utils/fetcher";

import { IReviewResponse } from "../pages/api/review/index";
interface IUseReviews {
  itemID: string;
  sortBy: string;
  sortMethod: string;
  selectedFilter: string;
}

const useReviews = ({
  itemID,
  sortBy,
  sortMethod,
  selectedFilter,
}: IUseReviews) => {
  const query = `itemID=${itemID}&sortBy=${sortBy}&sortMethod=${sortMethod}${selectedFilter}`;
  const { data, mutate } = useSWR<IReviewResponse>(
    "/api/reviews?" + query,
    fetcher
  );

  return {
    reviews: data,
    mutateReviews: mutate,
  };
};

export default useReviews;
