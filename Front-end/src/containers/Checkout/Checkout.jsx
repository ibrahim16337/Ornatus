import React, { useState, useEffect } from "react";
import "./checkout.css";
import userService from "../../services/UserService";
import CheckoutItem from "./CheckoutItem";
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import orderService from "../../services/OrderService";

const Checkout = () => {
  const apiUrl = 'http://localhost:4000/api';
  const cart = useSelector((state) => state.cart);

  // State for form fields, initialized from localStorage or defaults
  const [contactInfo, setContactInfo] = useState(localStorage.getItem("contactInfo") || (userService.isLoggedIn() ? userService.getLoggedInUser().email : ""));
  const [firstName, setFirstName] = useState(localStorage.getItem("firstName") || "");
  const [lastName, setLastName] = useState(localStorage.getItem("lastName") || "");
  const [address, setAddress] = useState(localStorage.getItem("address") || "");
  const [city, setCity] = useState(localStorage.getItem("city") || "");
  const [postalCode, setPostalCode] = useState(localStorage.getItem("postalCode") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [errors, setErrors] = useState({});

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("contactInfo", contactInfo);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("address", address);
    localStorage.setItem("city", city);
    localStorage.setItem("postalCode", postalCode);
    localStorage.setItem("phone", phone);
  }, [contactInfo, firstName, lastName, address, city, postalCode, phone]);

  // Validate form fields
  const validateForm = () => {
    let errors = {};
    if (!contactInfo) errors.contactInfo = "Contact info is required.";
    if (!firstName) errors.firstName = "First Name is required.";
    if (!lastName) errors.lastName = "Last Name is required.";
    if (!address) errors.address = "Address is required.";
    if (!city) errors.city = "City is required.";
    if (!postalCode) errors.postalCode = "Postal Code is required.";
    if (!phone) errors.phone = "Phone number is required.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;
    cart.forEach(item => {
      totalQuantity += item.quantity;
      totalPrice += item.price * item.quantity;
    });
    return { totalPrice, totalQuantity };
  };

  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51MKzBiAY8SZCVCcYbvKyRhl6OWUuKO1ZrnwtuEC68ejd2lCbSBi2dhapAkQuZFHpx9QZMCpMwnPSLe8omPDRqWje00Z1eeK9h0');
    const body = { products: cart };
    const headers = {
      "Content-Type": "application/json"
    };
    const response = await fetch(`${apiUrl}/orders/create-checkout-session`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    const session = await response.json();
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });
    if (result.error) {
      console.log(result.error);
    }
  };

  const createOrder = () => {
    if (!validateForm()) {
      // If form is not valid, do not proceed
      return;
    }

    if (userService.isLoggedIn()) {
      const user_id = userService.getLoggedInUser().id;
      orderService
        .addOrder({
          user_id: user_id,
          amount: getTotal().totalPrice,
          items: cart
        })
        .then((response) => {
          alert("Order has been placed successfully!");
          // Clear form data and localStorage
          setContactInfo("");
          setFirstName("");
          setLastName("");
          setAddress("");
          setCity("");
          setPostalCode("");
          setPhone("");
          localStorage.removeItem("contactInfo");
          localStorage.removeItem("firstName");
          localStorage.removeItem("lastName");
          localStorage.removeItem("address");
          localStorage.removeItem("city");
          localStorage.removeItem("postalCode");
          localStorage.removeItem("phone");

          // Redirect to home page using a link
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error posting Order:", error);
        });
    }
  };

  return (
    <div className="checkout-main">
      <div className="checkout-info">
        <div className="checkout-contact-info">
          <h4 className="contact">Contact</h4>
          <input
            type="text"
            className={`contact-input ${errors.contactInfo ? 'input-error' : ''}`}
            placeholder="Email or Mobile number"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
          {errors.contactInfo && <div className="error-message">{errors.contactInfo}</div>}
          <label htmlFor="" className="contact-label">
            <input type="checkbox" className="contact-checkbox" /> Email me with news and offers
          </label>
        </div>

        <div className="checkout-delivery-info">
          <h4 className="delivery">Delivery</h4>
          <div className="name-fields">
            <input
              type="text"
              className={`input-first-name ${errors.firstName ? 'input-error' : ''}`}
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            <input
              type="text"
              className={`input-last-name ${errors.lastName ? 'input-error' : ''}`}
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
          </div>

          <input
            type="text"
            className={`delivery-address-info ${errors.address ? 'input-error' : ''}`}
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <div className="error-message">{errors.address}</div>}

          <div className="name-fields">
            <input
              type="text"
              className={`input-first-name ${errors.city ? 'input-error' : ''}`}
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && <div className="error-message">{errors.city}</div>}
            <input
              type="text"
              className={`input-last-name ${errors.postalCode ? 'input-error' : ''}`}
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
          </div>

          <input
            type="text"
            className={`delivery-address-info ${errors.phone ? 'input-error' : ''}`}
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}

          <label htmlFor="" className="contact-label">
            <input type="checkbox" className="contact-checkbox" /> Save info for next time
          </label>
        </div>

        <div className="checkout-payment-info">
          <h4 className="payment">Payment</h4>
          <h6 className="payment">All transactions are secure and protected</h6>

          <form className="payment-method-form">
            <label htmlFor="debitCreditCard" className="payment-label">
              <input
                type="radio"
                id="debitCreditCard"
                name="paymentMethod"
                className="payment-radiobtn"
                onClick={makePayment}
              />{" "}
              Debit-Credit card
            </label>
            <br />

            <label htmlFor="cashOnDelivery" className="payment-label">
              <input
                type="radio"
                id="cashOnDelivery"
                name="paymentMethod"
                className="payment-radiobtn"
              />{" "}
              Cash on delivery
            </label>
            <br />

            <label htmlFor="bankDeposit" className="payment-label">
              <input
                type="radio"
                id="bankDeposit"
                name="paymentMethod"
                className="payment-radiobtn"
              />{" "}
              Bank Deposit
            </label>
          </form>
        </div>

        <div className="checkout-billing-info">
          <h4 className="payment">Billing Address</h4>

          <form className="billing-address-form">
            <label htmlFor="sameAsShipping" className="billing-label">
              <input
                type="radio"
                id="sameAsShipping"
                name="billingmethod"
                className="billing-radiobtn"
              />{" "}
              Same as shipping address
            </label>
            <br />

            <label htmlFor="differentBilling" className="billing-label">
              <input
                type="radio"
                id="differentBilling"
                name="billingmethod"
                className="billing-radiobtn"
              />{" "}
              Use a different billing address
            </label>
          </form>
        </div>

        <button className="complete-order-btn" onClick={createOrder}>Complete Order</button>
      </div>

      <div className="checkout-items-bill">
        {cart?.map((item) => (
          <CheckoutItem
            key={item.id}
            id={item.id}
            image={item.image}
            title={item.title}
            price={item.price} 
            quantity={item.quantity}
          />
        ))}
        <div className="checkout-items-bill">
          <div className="checkout-shipping">
            <h6 className="checkout-subtotal-title">Shipping</h6>
            <h6 className="checkout-subtotal-amount">Free</h6>
          </div>
          
          <div className="checkout-total">
            <h6 className="checkout-subtotal-title">Total </h6>
            <h6 className="checkout-subtotal-amount">Rs {getTotal().totalPrice}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
