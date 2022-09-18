import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

import Layout from "../../components/layout/layout.component";

const Categories: NextPageWithLayout = () => {
  return (
    <div>
      <p>Categories Index</p>
    </div>
  );
};

Categories.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default Categories;