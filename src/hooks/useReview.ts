import useSWR from "swr";

import fetcher from "../utils/fetcher";

import { IReviewResponse } from "@/app/api/review/route";
interface IUseReviews {
  itemId: string;
  sortBy: string;
  page: number;
  sortMethod: string;
  selectedFilter: string;
  showUserReviews: boolean;
}

const useReview = ({
  itemId,
  sortBy,
  page,
  sortMethod,
  selectedFilter,
  showUserReviews,
}: IUseReviews) => {
  const query = `itemId=${itemId}&sortBy=${sortBy}&sortMethod=${sortMethod}&page=${
    page - 1
  }&showUserReviews=${showUserReviews}${selectedFilter}`;
  const { data, mutate } = useSWR<IReviewResponse>(
    "/api/review?" + query,
    fetcher,
  );

  return {
    reviewsData: data,
    mutateReviews: mutate,
  };
};

export default useReview;
