import React from "react";

import Header from "../Header";
import Footer from "../Footer";

const PageLayout = ({ children }) => (
    <div>
        <Header />
        {children}
        <Footer />
    </div>
);

export default PageLayout;
