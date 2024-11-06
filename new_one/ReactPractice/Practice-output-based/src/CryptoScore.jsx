import React, { useState } from 'react';

const CryptoStore = () => {
    // Set static cryptocurrency data
    const cryptocurrencies = [
        { id: 1, name: 'Bitcoin', price: 40000 },
        { id: 2, name: 'Ethereum', price: 2800 },
        { id: 3, name: 'Litecoin', price: 150 },
    ];

    // Component state
    const [cart, setCart] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [error, setError] = useState('');

    // Handle quantity input
    const handleQuantityChange = (id, value) => {
        setQuantity((prevQuantity) => ({
            ...prevQuantity,
            [id]: value,
        }));
    };

    // Add to cart
    const handleAddToCart = (crypto) => {
        const cryptoQuantity = quantity[crypto.id];

        // Check if quantity is valid
        if (!cryptoQuantity || cryptoQuantity <= 0) {
            setError('Please enter a valid quantity');
            return;
        }

        setError('');
        const existingItemIndex = cart.findIndex(item => item.id === crypto.id);

        // If item exists, update quantity; else, add a new item
        if (existingItemIndex >= 0) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity += parseInt(cryptoQuantity, 10);
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...crypto, quantity: parseInt(cryptoQuantity, 10) }]);
        }

        // Clear input for the added item
        setQuantity((prevQuantity) => ({
            ...prevQuantity,
            [crypto.id]: '',
        }));
    };

    // Remove item from cart
    const handleRemoveFromCart = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    // Calculate total cost of items in the cart
    const calculateTotalCost = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="crypto-store">
            <h1>Crypto Purchase Interface</h1>
            
            {/* Display Cryptocurrency Options */}
            <div className="crypto-list">
                {cryptocurrencies.map((crypto) => (
                    <div key={crypto.id} className="crypto-card">
                        <h2>{crypto.name}</h2>
                        <p>Price: ${crypto.price}</p>
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={quantity[crypto.id] || ''}
                            onChange={(e) => handleQuantityChange(crypto.id, e.target.value)}
                        />
                        <button onClick={() => handleAddToCart(crypto)}>Buy</button>
                    </div>
                ))}
            </div>

            {/* Error Message */}
            {error && <p className="error">{error}</p>}

            {/* Display Cart */}
            <div className="cart">
                <h2>Your Cart</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty!</p>
                ) : (
                    <>
                        <ul>
                            {cart.map((item) => (
                                <li key={item.id}>
                                    {item.name} - Quantity: {item.quantity}, Total: ${item.price * item.quantity}
                                    <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <h3>Total Cost: ${calculateTotalCost()}</h3>
                    </>
                )}
            </div>
        </div>
        
    );
};

export default CryptoStore;
