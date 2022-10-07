import {
  useState,
  ReactElement,
  ChangeEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { AiOutlineClose } from "react-icons/ai";

import Layout from "../components/layout/layout.component";
import Loading from "../components/loading/loading.component";

const Search: NextPageWithLayout = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="mx-auto py-6 sm:py-10 px-5 lg:px-8">
      {/* Search input */}
      <div className="border bg-slate-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-600 shadow-md rounded-xl p-4 mx-auto md:w-3/5 xl:w-2/5">
        {/* Heading */}
        <div className="flex items-center justify-between">
          <label
            htmlFor="search"
            className="text-xl md:text-2xl font-medium"
          >
            Search
          </label>
          <button
            type="button"
            title="Close"
            className="hover:text-slate-600 dark:hover:text-slate-300"
            onClick={() => router.back()}
          >
            <AiOutlineClose
              className="h-6 w-6"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            name="searchInput"
            id="search"
            className="w-full h-9 rounded-md px-2 dark:bg-slate-900 border dark:border-slate-600 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Search for products or categories"
            value={searchInput}
            onChange={handleChange}
            tabIndex={1}
            autoFocus
          />
          <button
            className="bg-green-700 hover:bg-green-800 active:bg-green-900 rounded-md h-9 font-medium tracking-tight w-full text-white mt-2"
            tabIndex={2}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Search;
