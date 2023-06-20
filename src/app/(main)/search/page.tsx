// TODO - move to server actions

import SearchComponent from "./search.component";

/* <Meta
title={foundProducts ? "Search results for " + searchInput : "Search"}
/> */

export const metadata = {
  title: "Search",
};

const Search = () => {
  return <SearchComponent />;
};

export default Search;
