import React, { useState,useEffect } from "react";
import "./productdetail.css";
//import Prod1 from "./prod-1.png";
//import Prod2 from "./prod-2.png";
import { LuArrowRightCircle } from "react-icons/lu";
import { LuArrowLeftCircle } from "react-icons/lu";
//import { TbZoomScan } from "react-icons/tb";
import { VscZoomIn } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import productService from "../../services/ProductsService";
import userService from "../../services/UserService";
import reviewService from "../../services/ReviewService";
import {Modal,Button} from 'react-bootstrap';
import qrcode from '../../assets/qrcode.svg';
import { useDispatch } from 'react-redux';
import {addToCart} from '../../redux/cartSlice';
const Productdetail = () => {
  const productId = useParams();
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
 // const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  var id = products.id;
  var title = products.name;
  var image = products.image;
  var price = 0;
  const priceWithCurrency = products.price !== undefined ? products.price : ''; 
  const priceWithoutCurrencyAndCommas = priceWithCurrency.replace(/[$,]/g, "");
  price = parseInt(priceWithoutCurrencyAndCommas, 10);
  console.log(price); 

  const getData = () => {

    productService
      .getSingleProduct(productId["id"])
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });

    reviewService
      .getReviewByProduct(productId["id"])
      .then((data) => {
        setReviews(data);
        console.log("Added reviews for this product are: ",data);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
      });
  };

  useEffect(getData, [productId]);
  const tasveer = products['image'];
  console.log(tasveer);
  const images = [tasveer];

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!products || products.length === 0) {
    return <p>No data available</p>;
  }
  console.log(products);
  console.log(products.entries);
  const productdet = {
    name: products['name'] || " ",
    id: products['timestamp_id'] || " ",
    specifications: [
      "Size: 35.4” W x 83” D x 49” H (Inches)",
      "Material: Mahogany wood/veneer",
      "Finish: Walnut finish",
      "Legs: Wooden",
      "Recommended Mattress Size: 78” L x 72” W x 8” H – Sold Separately",
    ],
    keyfeatures: [
      "High-Quality Materials: crafted from high-quality solid Mahogany wood/veneer which is highly durable, long-lasting, and easy to maintain",
      "Robust Construction: Sturdy MDF structure offers durability while wooden legs provide additional stability",
      "Elegant Design: The solid wood with walnut finish exudes modern elegance with its natural wood grain feel",
      "Striking Appearance: diagonal grooved design embellished with antique golden metallic motifs gives a striking appearance that blends seamlessly with any interior",
    ],
    description: products['description'] || " ",
    price: products['price'] || " ",
  };


  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleAddtoCart = () => {
    const submitButton = document.querySelector(".add-to-cart-button");
    submitButton.textContent = "Added to Cart";
    submitButton.classList.add("added");

    setTimeout(() => {
      submitButton.textContent = "Add to cart";
      submitButton.classList.remove("added");
    },2000);
  };
  const handleAlertForSubmission = () => {
    const submitButton = document.querySelector(".submit-review-button");
    submitButton.textContent = "Review Submitted";
    submitButton.classList.add("submitted");

    setTimeout(() => {
      submitButton.textContent = "Submit Review";
      submitButton.classList.remove("submitted");
    }, 2000); // 2000 milliseconds = 2 seconds
  };
  const submitReview = () => {
    if (userService.isLoggedIn()) {
      const user_id = userService.getLoggedInUser().id;
      console.log("The value of id of user is ",user_id);
      console.log("Values in the review are ",productId['id'],user_id,rating,reviewTitle,reviewBody);
      if(reviewTitle && reviewBody && rating){
        reviewService
        .addReview({
          product_id: productId["id"],
          user_id: user_id,
          rating: rating,
          title: reviewTitle,
          review: reviewBody,
        })
        .then((response) => {
          getData();
          setRating(0);
          setReviewTitle("");
          setReviewBody("");
          // added alert for now. to add the Review Added logic on Submit button.
          // replace alert with handleAlertForSubmission()
          handleAlertForSubmission()
        })
        .catch((error) => {
          console.error("Error posting review:", error);
        });
      }
      else{
        alert("Fill all required fields (Title, Body and Rating).");
      }
    }
  };
  return (
    <div className="prod-detail-main">
      <div className="prod-images">
        <div className="prod-view">
          <div className="side-images">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${
                  selectedImageIndex === index ? "selected" : ""
                }`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>

          <div className="main-image">
            <div className="zoom-icon-div">
              <VscZoomIn className="zoom-icon" />
            </div>
            <img
              key={selectedImageIndex}
              src={images[selectedImageIndex]}
              alt={`Product Image1 ${selectedImageIndex + 1}`}
              className="main-image"
            />

            <div className="navigation-arrows">
              <LuArrowLeftCircle
                className="arrow-left"
                onClick={handlePrevImage}
              />
              <LuArrowRightCircle
                className="arrow-right"
                onClick={handleNextImage}
              />
            </div>
          </div>
        </div>

        <div className="prod-buttons">
        
          <button className="ar-button" onClick={handleOpenModal}>View in AR</button>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{productdet.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h5>Scan QR code with the camera of your phone to View in AR</h5>
            <img src={qrcode} alt="QR Code" /></Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>

      <div className="prod-details">
        <h1 className="prod-name">{productdet.name}</h1>
        <div>
          <h5 className="prod-id">{productdet.id}</h5>
          <h5 className="prod-id">Shipping calculated at checkout.</h5>
        </div>
        <hr className="sepration" />

        <div className="add-to-cart">          
          <button className="add-to-cart-button"
          onClick={() => {
          dispatch(addToCart({
            id, title, image, price
          }));
          handleAddtoCart()
          }}
          >Add to Cart</button>
          
        </div>

        <p className="delivery-para">
          Delivered in 20 to 30 working days Our Delivery officer shall call you
          to communicate the exact delivery time lines.
        </p>

        <p className="prod-description">{productdet.description}</p>
        <div className="specifications-div">
          <h1 className="specifications-heading">
            <b>Specifications</b>
          </h1>
          <ul className="prod-specifications">
            {productdet.specifications.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
        <div className="key-features-div">
          <h1 className="key-features-heading">
            <b>Key Features</b>
          </h1>
          <ul className="key-features">
            {productdet.keyfeatures.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <hr className="sepration" />
        <div className="prod-reviews-div">


          <h1 className="reviews-heading">
            <b>Customer Reviews</b>
          </h1>

          <div className="user-review-div">
             <div >
              <ol>
              {reviews.map((review) => (<li className="review-display">
                <div className="row review-results">
                  <div className="col-10">
                    <h6 > <b>{review.title}</b></h6>
                  </div>
                  <div className="col-2">
                    <h6>{review.rating} Star</h6>
                  </div>
                </div>
                <h6 >{review.review}</h6>
              </li>))}
              </ol>

             </div>

          </div>
          <b className="reviews-heading">Submit Review</b>
          {/* Display Rating Stars */}
          <div className="ratings-div">
            <h2 className="rating">Rating</h2>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <React.Fragment key={value}>
                  <input
                    type="radio"
                    id={`star${value}`}
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                  />
                  <label htmlFor={`star${value}`} title={`${value} stars`}></label>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div className="review-title-div">
            <h4 className="review-title">Review Title</h4>
            <input
              type="text"
              className="review-title-input"
              placeholder="Title"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
            />
          </div>

          {/* Review Body */}
          <div className="review-body-div">
            <h4 className="body-of-review">Body of review</h4>
            <textarea
              type="text"
              className="body-of-review-input"
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
            />
          </div>

          {/* Submit Review Button (enable/disable based on user login status) */}
            <button
              className="submit-review-button"
              onClick={submitReview}
              disabled={!userService.isLoggedIn()}
            >
              Submit Review
            </button>

        </div>
      </div>
    </div>
  );
};

export default Productdetail;
