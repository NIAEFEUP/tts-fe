import React from "react";

import Header from "../Header";
import Footer from "../Footer";

const PageLayout = ({ children }) => (
    <div className="layout">
        <Header />
        {children}
        <Footer />
    </div>
);

export default PageLayout;
