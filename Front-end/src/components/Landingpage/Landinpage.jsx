import React from "react";
import Navbar from "../../containers/Navbar/Navbar";
import Carousal from "../../containers/Carousal/Carousal";
import Categories from "../../containers/Categories/Categories";
//import Section from "../../containers/Section/Section";
import Footer from "../../containers/Footer/Footer";
import Styleslider from "../../containers/Styleslider/Styleslider";
import Interiordiv from "../../containers/Interiordiv/Interiordiv";

const Landingpage = () => {
  return (
    <div>
      <Navbar />
      <Carousal />
      <Styleslider />
      <Categories />
      {/* <Section /> */}
      <Interiordiv />
      <Footer />
    </div>
  );
};

export default Landingpage;
