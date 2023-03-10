import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { addToDb, deleteShoppingCart, getStoredCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'

const Shop = () => {

  const products = useLoaderData();
    const [cart,setCart] = useState([]);

    const clearCart = ()=>{
        setCart([]);
        deleteShoppingCart();
    }
   

    
    useEffect(()=>{
        const storedCart = getStoredCart();
        const savedCart = [];
        for(const id in storedCart){
            const addedProudct = products.find(product=>product.id === id);
            if(addedProudct){
                const quantity = storedCart[id];
                addedProudct.quantity = quantity;
                savedCart.push(addedProudct);
                
            }
        }
        setCart(savedCart);
    },[products])



    const handleAddToCart = (selectedProduct)=>{
        // console.log(product);
        let newCart =[];
        const exists = cart.find(product => product.id === selectedProduct.id);
        if(!exists){
            selectedProduct.quantity =1;
            newCart = [...cart, selectedProduct]

        }
        else{
            const rest = cart.filter(product=> product.id !== selectedProduct.id);
            exists.quantity = exists.quantity +1;
            newCart =[...rest,exists];
        }
       
        setCart(newCart)
        addToDb(selectedProduct.id);
        
    }

    return (
        <div className='shop-container'>
            <div className="products-conatiner">
            {
                products.map(product => <Product
                key ={product.id}
                product={product}
                handleAddToCart = {handleAddToCart}
                
                ></Product>)
            }
            </div>
            <div className="cart-conatiner">
               <Cart clearCart={clearCart} cart={cart}></Cart>
               <Link to='/orders'>
               <button>Review Order</button></Link>

            </div>
        </div>
    );
};

export default Shop;