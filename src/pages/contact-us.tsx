import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

import Layout from "../components/layout/layout.component";

const ContactUs: NextPageWithLayout = () => {
  return (
    <div>
      <h2>Contact Us</h2>
      <p>Add some sort of live chat and FAQ</p>
    </div>
  );
};

ContactUs.getLayout = function getLayout(
  page: ReactElement
) {
  return <Layout>{page}</Layout>;
};

export default ContactUs;
