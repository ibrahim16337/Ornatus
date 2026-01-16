// Interiordiv.jsx
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './interiordiv.css';

const Interiordiv = () => {
  const handleClick = () => {
    window.open('http://localhost:10001', '_blank');
  };
  const cardsData = [
        {
          title: 'Design Your Personalized Interior',
          detail: 'Create your dream space with our easy-to-use design tools. Choose from a variety of styles, colors, and furniture to make your interior truly personalized.',
          buttonText: 'Design Now',
        },
        {
          title: 'Save and Share Your Design',
          detail: 'Save your design progress and share it with us! Whether you want suggestions or just want to showcase your creativity, saving and sharing your interior has never been easier.',
          buttonText: 'Design Now',
        },
      ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
  autoplaySpeed: 3500,
  arrows: false,
  };

  return (
    <div className="interior-main">

        <div className='interior-slider'>

        <Slider {...sliderSettings}>
  {cardsData.map((card, index) => (
    <div key={index} className="interior-card">

      <div className="interior-card-content">
        <div className="interior-cardtitle">
          <h3 className='interior-card-title'>{card.title}</h3>
        </div>

        <div className='detail-button'>

        <div className="interior-card-detail">
          <p className='interior-card-detail'>{card.detail}</p>
        </div>

        <div className="">
          <button className='interior-card-button' onClick={handleClick}>{card.buttonText}</button>
        </div>

        </div>

      </div>
    </div>
  ))}
</Slider>

        </div>

    </div>
  );
};

export default Interiordiv;
