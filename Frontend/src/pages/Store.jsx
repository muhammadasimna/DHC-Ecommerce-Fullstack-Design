import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Store() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null);
  const { backendUrl, token } = useAuth();
  const { addToCart, saveProductDirectly, savedItems = [], removeFromCart } = useCart();
  const navigate = useNavigate();
  const [addedMessage, setAddedMessage] = useState('');

  const normalizeProduct = (product) => ({
    ...product,
    title: product.title || product.name || 'Untitled product',
    price: Number(product.price || 0),
    oldPrice: product.oldPrice == null ? null : Number(product.oldPrice),
    rating: Number(product.rating || 0),
    stars: Number(product.stars || 0),
  });

  const getOfferPercent = (product) => {
    const oldPrice = Number(product.oldPrice || 0);
    const price = Number(product.price || 0);
    if (oldPrice > price && price > 0) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }
    return 0;
  };

  useEffect(() => {
    document.body.classList.add('store-page');

    const fetchSellerData = async () => {
      if (!id) return;
      try {
        // Fetch Seller Details
        const sellerRes = await fetch(`${backendUrl}/auth/user/${id}`);
        if (sellerRes.ok) {
          const sellerData = await sellerRes.json();
          setSeller(sellerData.user);
        }

        // Fetch Seller's Products
        const prodRes = await fetch(`${backendUrl}/products/user/${id}`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData && prodData.length > 0) {
            setProducts(prodData.map(normalizeProduct));
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.warn('Backend API not responding or error fetching store data', err);
      }
    };

    fetchSellerData();

    return () => {
      document.body.classList.remove('store-page');
    };
  }, [backendUrl, id]);

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    e.preventDefault();
    setAddedMessage('');
    try {
      await addToCart(productId, 1);
      setAddedMessage('Item added to cart!');
      setTimeout(() => setAddedMessage(''), 3000);
    } catch (err) {
      setAddedMessage(err.message || 'Please log in first!');
      setTimeout(() => setAddedMessage(''), 3000);
    }
  };

  const handleSaveProduct = async (e, productId) => {
    e.stopPropagation();
    e.preventDefault();
    setAddedMessage('');
    const savedItem = savedItems.find(item => item.productId === productId);
    try {
      if (savedItem) {
        await removeFromCart(savedItem.id);
        setAddedMessage('Removed from saved items!');
      } else {
        await saveProductDirectly(productId);
        setAddedMessage('Item saved for later!');
      }
      setTimeout(() => setAddedMessage(''), 3000);
    } catch (err) {
      setAddedMessage(err.message || 'Please log in first!');
      setTimeout(() => setAddedMessage(''), 3000);
    }
  };

  const renderStars = (stars) => {
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    const emptyStars = 5 - Math.ceil(stars);

    return (
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fa-solid fa-star"></i>)}
        {hasHalfStar && <i className="fa-solid fa-star-half-stroke"></i>}
        {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="fa-regular fa-star"></i>)}
      </div>
    );
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    return price;
  };

  const sellerName = seller?.username || 'Unknown Seller';
  const initial = sellerName.charAt(0).toUpperCase();
  const sellerEmail = seller?.email || 'No email provided';
  const totalProducts = products.length;
  const totalOrders = products.reduce((acc, p) => acc + (p.orders || 0), 0);
  const avgRating = products.length > 0 
    ? (products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length).toFixed(1) 
    : '0.0';

  return (
    <div className="container" style={{ padding: '20px 0', minHeight: '80vh' }}>
      {addedMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: (addedMessage.includes('added') || addedMessage.includes('saved')) ? '#E8F5E9' : '#FFF2F2',
          border: '1px solid ' + ((addedMessage.includes('added') || addedMessage.includes('saved')) ? 'var(--green)' : 'var(--red)'),
          color: (addedMessage.includes('added') || addedMessage.includes('saved')) ? 'var(--green)' : 'var(--red)',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          fontWeight: '500'
        }}>
          {addedMessage}
        </div>
      )}

      {/* Store Banner */}
      <div className="store-banner">
        <div className="store-banner-bg"></div>
        <div className="store-banner-logo">
          {initial}
        </div>
        <div className="store-banner-info">
          <h2>{sellerName}</h2>
          <div className="store-banner-details">
            <div><i className="fa-solid fa-location-dot"></i> {seller?.location || 'Global'}</div>
            {seller?.isVerified !== false && <div><i className="fa-solid fa-shield-halved"></i> Verified Seller</div>}
            <div><i className="fa-solid fa-star"></i> {avgRating} / 5.0 Rating</div>
            <div><i className="fa-solid fa-truck"></i> {seller?.shippingPolicy || 'Worldwide shipping'}</div>
          </div>
        </div>
        <div className="store-banner-actions">
          <button className="btn btn-primary"><i className="fa-solid fa-plus"></i> Follow</button>
          <button className="btn btn-white"><i className="fa-regular fa-envelope"></i> Contact</button>
        </div>
      </div>

      <h3 style={{ marginBottom: '20px', fontSize: '22px' }}>All Products from {sellerName}</h3>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="product-grid-container">
          {products.map(product => {
            const offerPercent = getOfferPercent(product);
            return (
              <div key={product.id} className="product-grid-item">
                <div className="product-grid-img">
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/product?id=${product.id}`); }}>
                    <img src={product.image} alt={product.title} style={{ cursor: 'pointer', objectFit: 'cover' }} />
                  </a>
                </div>
                <div className="grid-item-info">
                  <div className="grid-info-row">
                    <div className="grid-price-box">
                      <div className="price-group">
                        <span className="price">{formatPrice(product.price)}</span>
                        {product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}
                        {offerPercent > 0 && <span className="offer-badge">-{offerPercent}% OFF</span>}
                      </div>
                      <div className="grid-rating-row">
                        {renderStars(product.stars)}
                        <span className="rating-num">{product.rating}</span>
                      </div>
                    </div>
                    <div 
                      className="heart-btn" 
                      onClick={(e) => handleSaveProduct(e, product.id)}
                      style={{ width: '35px', height: '35px', color: savedItems.some(item => item.productId === product.id) ? 'var(--red)' : 'var(--primary-color)', border: '1px solid var(--gray-300)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <i className={savedItems.some(item => item.productId === product.id) ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                    </div>
                  </div>
                  <p className="title">{product.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--white)', borderRadius: '8px', border: '1px solid var(--gray-300)' }}>
          Loading products or no products found for this seller...
        </div>
      )}
    </div>
  );
}
