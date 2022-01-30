import "./CartScreen.css";
import React from "react";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import StripeCheckout from 'react-stripe-checkout';
import axios from "axios";
import { toast } from "react-toastify";
// Components
import CartItem from "../components/CartItem";

// Actions
import { addToCart, removeFromCart } from "../redux/actions/cartActions";
import "react-toastify/dist/ReactToastify.css";
//import "./styles.css";

toast.configure();



const CartScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {}, []);

  const qtyChangeHandler = (id, qty) => {
    dispatch(addToCart(id, qty));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(item.qty) + qty, 0);
  };

  const getCartSubTotal = () => {
    return cartItems
      .reduce((price, item) => price + item.price * item.qty, 0)
      .toFixed(2);
  };

  const price = getCartSubTotal();

  const [product] = React.useState({
    name: "Tesla Roadster",
    price: price,
    description: "Cool car"
  });
  async function handleToken(token, addresses) {
	  console.log({ token, addresses });
	  const response = await axios.post(
		"https://uno-ecommerce.herokuapp.com/cart",
		{ token, product }
	  );
	  const { status } = response.data;
	  console.log("Response:", response.data);
	  if (status === "success") {
		toast("Success! Check email for details", { type: "success" });
	  } else {
		toast("Something went wrong", { type: "error" });
	  }
  };
  
  //console.log(price);

  return (
    <>
      <div className="cartscreen">
        <div className="cartscreen__left">
          <h2>Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <div>
              Your Cart Is Empty <Link to="/">Go Back</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.product}
                item={item}
                qtyChangeHandler={qtyChangeHandler}
                removeHandler={removeFromCartHandler}
              />
            ))
          )}
        </div>

        <div className="cartscreen__right">
          <div className="cartscreen__info">
            <p>Subtotal ({getCartCount()}) items</p>
            <p>${getCartSubTotal()}</p>
          </div>
          <div>
            <StripeCheckout
			stripeKey="pk_test_51KNXCBIIQnKtwtkJ7y26OKUg6U2JAlMMqOjcMBn555yuTWEEU24g7Ulgi0dtm0b39QM4mAcfHgcoq9IsfvfcwDOQ00B4JaYIUd" 
			token={handleToken}
			billingAddress
			shippingAddress
			amount={price * 100}
			name="Books"
			/>
          </div>
		  <div>
            <button>Checkout with M-Pesa</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartScreen;
