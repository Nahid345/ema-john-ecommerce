import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { addToDb, deleteShoppingCart, getStoredCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'


/* pagination

count= loaded
perPage(size): 10
pages = count/perPage
currentpage (page)

*/

const Shop = () => {
     const [products, setProducts] = useState([]);
     const [count, setCount] = useState(0)
    const [cart, setCart] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(() =>{
        const uri = `http://localhost:5000/products?page=${page}&size=${size}`
        fetch(uri)
        .then(res =>res.json())
        .then(data =>{
            setCount(data.count);
            setProducts(data.products);
        })
    }, [page,size])

    const pages = Math.ceil(count / size)



    const clearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }



    useEffect(() => {
        const storedCart = getStoredCart();
        const savedCart = [];
        const ids = Object.keys(storedCart)
        console.log(ids);
        fetch('http://localhost:5000/productsByIds',{
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },

            body: JSON.stringify(ids)

        })
        .then(res => res.json())
        .then(data =>{

             for (const id in storedCart) {
            const addedProudct = data.find(product => product._id === id);
            if (addedProudct) {
                const quantity = storedCart[id];
                addedProudct.quantity = quantity;
                savedCart.push(addedProudct);

            }
        }
        setCart(savedCart);

        })
       
    }, [products])



    const handleAddToCart = (selectedProduct) => {
        // console.log(product);
        let newCart = [];
        const exists = cart.find(product => product._id === selectedProduct._id);
        if (!exists) {
            selectedProduct.quantity = 1;
            newCart = [...cart, selectedProduct]

        }
        else {
            const rest = cart.filter(product => product._id !== selectedProduct._id);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, exists];
        }

        setCart(newCart)
        addToDb(selectedProduct._id);

    }

    return (
        <div className='shop-container'>
            <div className="products-conatiner">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}

                    ></Product>)
                }
            </div>
            <div className="cart-conatiner">
                <Cart clearCart={clearCart} cart={cart}></Cart>
                <Link to='/orders'>
                    <button>Review Order</button></Link>

            </div>
            
            <div className="pagination">
           
              <p>Cuurently selected page:{page} and {size}</p>
             
                {
                    [...Array(pages).keys()].map(number => <button
                    key={number}
                    className={page === number && 'selected'}
                    onClick={() => setPage(number)}
                    >
                        {number +1}
                    </button>)
                }
                  
                  <select onChange={event => setSize(event.target.value)}>
                    <option value="5">5</option>
                    <option value="10" selected>10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
            </div>
          
        </div>
    );
};

export default Shop;