import React from "react";
import Navbar from "../../containers/Navbar/Navbar";
import Categoryproducts from "../../containers/Categoryproducts/Categoryproducts";
import Footer from "../../containers/Footer/Footer";
import "./categorypage.css";
import { useParams } from "react-router-dom";
const Categorypage = () => {
  const {category}  = useParams();
  console.log("From category page",category);
  return (
    <div>
      <Navbar />
      <Categoryproducts category = {category}/>
      <Footer />
    </div>
  );
};

export default Categorypage;
