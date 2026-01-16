import React from 'react';
import './cart.css';
import { Link } from 'react-router-dom';
import Total from './Total';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';
import userService from '../../services/UserService';
const Cart = () => {
    const cart = useSelector((state) => state.cart)
    const checkoutValidation = () => {
        window.alert("Log In to Checkout");
        window.location.href = '/account/login';
    }
    
  return (

      <div className="cart-main">
            <div className="cart-items">
                <h1 className="your-cart">Your Cart</h1>

                <div className="cart-header-1">
                    <h6 className="cart-headings">Product</h6>
                
                    <div className="cart-header-2">
                        <h6 className="cart-headings">Quantity</h6>
                        <h6 className="cart-headings">Price</h6>
                    </div>
                </div>

                <hr className="items-sepration"/>

                <div className="cart-item">

        {cart?.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              image={item.image}
              title={item.title}
              price={item.price} 
              quantity={item.quantity}
            />
          ))}

                </div>
                <br />
                <Link to={'/collections/all'}>
                    <h2 className="cont-shop">Continue Shopping</h2>
                </Link>
            </div>

            <div className="cart-order-summary">
                <h1 className="order-summary">Order Summary</h1>

                <div className="notes">
                    <h6 className="add-note">Add notes</h6>
                    <textarea type="text"  className="notes-field" placeholder='Notes'/>

                </div>

                <div className='subtotal'>

                    <h4 className='subtotal'>Subtotal</h4>
                    <h4 className='subtotal'><Total/></h4>
                </div>
                {userService.isLoggedIn() ? (<Link to={"/checkout"}>
                    <button className='checkout-button'>Checkout</button>
                </Link>)
                :
                    <button className='checkout-button' onClick={checkoutValidation}>Checkout</button>
                }
                
            </div>

        </div>




  )
};

export default Cart;