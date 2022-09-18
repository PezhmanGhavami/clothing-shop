import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

import Layout from "../../components/layout/layout.component";

const Category: NextPageWithLayout = () => {
  return <div>Category</div>;
};

Category.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default Category;
