import React from 'react';
import './Cart.css'

const Cart = ({cart}) => {
    console.log(cart);
    let total = 0;
    let shipping =0;
    for(const product of cart){
        total =total + product.price;
        shipping = shipping + product.shipping;
    }

    const tax = parseFloat((total * 0.1).toFixed(2));
    const grandTotal = total+shipping+tax;
    return (
        <div className='cart'>
            <h4>Order Summary</h4>
             <h4>Selected items: {cart.length}</h4>
             <p>Total Price: ${total} </p>
             <p> Shipping:${shipping} </p>
             <p>Tax:${tax} </p>
             <h5>Grand Total:${grandTotal.toFixed(2)} </h5>
        </div>
    );
};

export default Cart;