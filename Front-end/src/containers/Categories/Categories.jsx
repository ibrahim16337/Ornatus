import React from "react";
import "./categories.css";
import bedroom from '../../assets/bedroom.png';
import sofa from '../../assets/sofa.png';
import chair from '../../assets/chair.png';
import table from '../../assets/table.png';
import kitchen from '../../assets/kitchen.png';
import office from '../../assets/office.png';
import home from '../../assets/home.png';
import { Link } from "react-router-dom";

const Categories = () => {
    return(
         <div className="Categories-main">
         <h5 className="categories-title">Shop By Categories</h5>
         <div className="upper-main">
         <div className="div-1-2">

         <div className="div-1">
            <div className="bedroom">
            <div className="category-text">
            <h5 className="category-title">Beds</h5>
            <Link to={'/collections/Beds'}>
               <h2 className="shop-now">Shop now</h2>
            </Link>
            </div>
            <div className="category-bedroom-image">
            <img src={bedroom} alt=""  className="bedroom-image"/>
            </div>
            </div>
            <div className="sofas">
            <div className="category-text">
            <h5 className="category-title">Sofa</h5>
            <Link to={'/collections/Sofa'}>
               <h2 className="shop-now">Shop now</h2>
            </Link>
            </div>
             <div className="category-sofa-image">
             <img src={sofa} alt=""  className="sofa-image"/>
             </div>


            </div>

         </div>

         <div className="div-2">
            <div className="tables">
            <div className="category-text">
            <h5 className="category-title">Tables</h5>
            <Link to={'/collections/Tables'}>
            <h2 className="shop-now">Shop now</h2>
            </Link>
            </div>
            <div className="category-table-image">
             <img src={table} alt=""  className="table-image"/>
             </div>
                

            </div>

            <div className="home">
            <div className="category-text">
            <h5 className="category-title">Home and Decor</h5>
            <Link to={'/collections/Lamps'}>
            <h2 className="shop-now">Shop now</h2>
            </Link>
            </div>
            <div className="category-sofa-image">
             <img src={home} alt=""  className="sofa-image"/>
             </div>

            </div>

         </div>

         </div>

         <div className="chair">
         <div className="category-text">
            <h5 className="category-title">Chairs</h5>
            <Link to={'/collections/Chairs'}>
            <h2 className="shop-now">Shop now</h2>
            </Link>
            </div>
            <div className="category-chair-image">
             <img src={chair} alt=""  className="chair-image"/>
             </div>

         </div>

         </div>

         <div className="div-3">
            <div className="kitchen">
            <div className="category-text">
            <h5 className="category-title">Kitchen</h5>
            <Link to={'/collections/Tables'}>
            <h2 className="shop-now">Shop now</h2>
            </Link>
            </div>
            <div className="category-kitchen-image">
             <img src={kitchen} alt=""  className="kitchen-image"/>
             </div>
                

            </div>

            <div className="office">
            <div className="category-text">
            <h5 className="category-title">Office</h5>
            <Link to={'/collections/Chairs'}>
            <h2 className="shop-now">Shop now</h2>
            </Link>
            </div>
            <div className="category-office-image">
             <img src={office} alt=""  className="office-image"/>
             </div>


            </div>

         </div>
         </div>


    );
};

export default Categories;