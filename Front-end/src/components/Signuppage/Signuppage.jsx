import React from "react";
import Navbar from "../../containers/Navbar/Navbar";
import Footer from "../../containers/Footer/Footer";
import Signupform from "../../containers/Signupform/Signupform";

const Signuppage = () => {
    return(
        <div>
        <Navbar />
        <Signupform />
        <Footer />
        </div>

    );
};

export default Signuppage;