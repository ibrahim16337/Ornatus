//import './cartItem.css'
//import './cart.css';

function CheckoutItem({id, image, title, price, quantity=0}) {
  
  return (
    <div className="cartItem">
      <img className="cartItem__image" src={image} alt='item'/>
      <div className="cartItem__info">
        <p className="cartItem__title">{title}</p>
        <p className="cartItem__price">
        <p>Quantity:{quantity}</p>
          <small>Rs</small>
          <strong>{quantity*price}</strong>
        </p>
      </div>
    </div>
  )
}

export default CheckoutItem;