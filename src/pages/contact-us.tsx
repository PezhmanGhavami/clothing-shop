import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";

const ContactUs: NextPageWithLayout = () => {
  return <div>Contact US</div>;
};

ContactUs.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default ContactUs;
