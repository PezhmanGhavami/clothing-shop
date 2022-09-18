import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";
import Slider from "../components/slider/slider.component";

const Home: NextPageWithLayout = () => {
  return (
    <>
      {/* <Slider /> */}
      <div>
        <p>Other Content</p>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
