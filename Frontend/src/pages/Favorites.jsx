import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Favorites() {
  const { savedItems, moveToCart, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <div className="container" style={{ padding: '40px 15px' }}>Loading favorites...</div>;
  }

  return (
    <main className="container favorites-page">
      <div className="breadcrumbs desktop-only">
        <Link to="/">Home</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <span>Favorites</span>
      </div>

      <div className="page-card">
        <div className="page-card-head">
          <div>
            <h2>Favorites</h2>
            <p>Products saved from your real cart and product listings.</p>
          </div>
          <Link to="/listing" className="btn btn-primary">Browse products</Link>
        </div>

        {savedItems.length === 0 ? (
          <div className="empty-state">
            <i className="fa-regular fa-heart"></i>
            <h3>No saved products yet</h3>
            <p>Tap the heart icon on any product to save it here.</p>
            <Link to="/listing" className="btn btn-primary">Start shopping</Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {savedItems.map((item) => (
              <article key={item.id} className="favorite-card">
                <button
                  type="button"
                  className="favorite-img"
                  onClick={() => item.productId && navigate(`/product?id=${item.productId}`)}
                >
                  <img src={item.product?.image || '/assets/Image/tech/image 29.png'} alt={item.product?.title || 'Saved product'} />
                </button>
                <div className="favorite-info">
                  <h3 onClick={() => item.productId && navigate(`/product?id=${item.productId}`)}>
                    {item.product?.title || 'Saved product'}
                  </h3>
                  <p>{item.product?.category || 'Product'}</p>
                  <strong>${Number(item.product?.price || 0).toFixed(2)}</strong>
                  <div className="favorite-actions">
                    <button type="button" className="btn btn-primary" onClick={() => moveToCart(item.id)}>Move to cart</button>
                    <button type="button" className="btn btn-white" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
