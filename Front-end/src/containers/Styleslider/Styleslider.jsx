import React from "react";
import './styleslider.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import Modern from './modern.png';
import Asian from './asian.jpg';
import Rustic from './rustic.jpeg';
import contemporary from './contemporary.jpg';
import Midcentury from './midcentury.jpg';
import Beach from './beach.jpg';
import Industrial from './industrial.jpg';
import craft from './craft.jpg';
import Medi from './medi.jpg';
import farm from './farmhouse.jpeg';
import victorian from './victorian.jpeg';
import traditional from './traditional.jpg';
import transitional from './transitional.jpeg';
//import productService from "../../services/ProductsService";
import { Link } from "react-router-dom";
const Styleslider = () => {
  // Sample card data, replace it with your actual data
  const cardsData = [
    { title: 'Modern', imageUrl: Modern },
    { title: 'Asian', imageUrl: Asian},
    { title: 'Mid Century', imageUrl: Midcentury},
    { title: 'Beach', imageUrl: Beach },
    { title: 'Industrial', imageUrl: Industrial},
    { title: 'Traditional', imageUrl: traditional},
    { title: 'Transitional', imageUrl: transitional},
    { title: 'Crafstman', imageUrl:craft },
    { title: 'Rustic', imageUrl: Rustic},
    { title: 'Contemporary', imageUrl: contemporary},
    { title: 'Victorian', imageUrl: victorian},
    { title: 'Mediterranean', imageUrl: Medi},
    { title: 'Farmhouse', imageUrl: farm},
    // Add more cards as needed
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 4, // Adjust the number of cards to show at once
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Adjust the autoplay speed in milliseconds
  };


  return (
    <div className="style-slider-main">
      <h1 className="style-text">Shop by Styles</h1>
      <div className="slider-div">
      <Slider {...sliderSettings}>
        {cardsData.map((card, index) => (
          <div key={index} className="style-card">
          <Link to={`/collections/${card.title}`}>
            <img src={card.imageUrl} alt={card.title} className="style-card-image"/>
            <div className="style-card-title">
              <h3>{card.title}</h3>
            </div>
            </Link>
          </div>
        ))}
      </Slider>

      </div>
    </div>
  );
};

export default Styleslider;
