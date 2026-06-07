import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState('');
  const { cartItems, addToCart, savedItems = [], saveProductDirectly, removeFromCart } = useCart();
  const { user, backendUrl } = useAuth();
  const location = useLocation();

  // Try to parse query string product ID (default to 1)
  const queryParams = new URLSearchParams(location.search);
  const productId = parseInt(queryParams.get('id') || '1');

  const [product, setProduct] = useState({
    id: 1,
    image: '/assets/Layout/alibaba/Image/cloth/Bitmap.png',
    title: 'Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle',
    price: 98.00,
    oldPrice: 120.00,
    rating: 9.3,
    stars: 4.5,
    orders: 154,
    category: 'Clothes and wear',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    additionalImagesJson: '[]'
  });

  const [seller, setSeller] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add('product-detail-page');
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${backendUrl}/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          
          const sellerId = data.userId || data.UserId || 1;
          const sellerRes = await fetch(`${backendUrl}/auth/user/${sellerId}`);
          if (sellerRes.ok) {
            const sellerData = await sellerRes.json();
            setSeller(sellerData.user);
          }

          if (data.category) {
            const relatedRes = await fetch(`${backendUrl}/products?category=${encodeURIComponent(data.category)}`);
            if (relatedRes.ok) {
              const relatedData = await relatedRes.json();
              const filtered = relatedData.filter(p => p.id !== data.id).slice(0, 6);
              setRelatedProducts(filtered);
            }
          }
        }
      } catch (err) {
        console.warn('Backend not running or product not found. Using local mock product.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      document.body.classList.remove('product-detail-page');
    };
  }, [productId, backendUrl]);

  const productImages = (() => {
    const images = [];
    if (product.image) {
      images.push(product.image);
    }

    try {
      const extra = JSON.parse(product.additionalImagesJson || '[]');
      if (Array.isArray(extra)) {
        extra.forEach((img) => {
          if (img && !images.includes(img)) {
            images.push(img);
          }
        });
      }
    } catch {
      // ignore parse errors
    }

    if (images.length === 0) {
      images.push('/assets/Layout/alibaba/Image/cloth/Bitmap.png');
    }

    return images;
  })();

  useEffect(() => {
    setActiveImageIdx(0);
  }, [productId, product.image, product.additionalImagesJson]);

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleAddToCart = async () => {
    setAddedMessage('');
    try {
      await addToCart(product.id, quantity, 'medium', 'blue');
      setAddedMessage('Item added to cart successfully!');
      setTimeout(() => setAddedMessage(''), 4000);
    } catch (err) {
      setAddedMessage(err.message || 'Failed to add item to cart. Are you signed in?');
      setTimeout(() => setAddedMessage(''), 4000);
    }
  };

  const handleSaveProductDetail = async (e) => {
    if (e) e.preventDefault();
    setAddedMessage('');
    const savedItem = savedItems.find(item => item.productId === product.id);
    try {
      if (savedItem) {
        await removeFromCart(savedItem.id);
        setAddedMessage('Removed from saved items!');
      } else {
        await saveProductDirectly(product.id);
        setAddedMessage('Item saved for later successfully!');
      }
      setTimeout(() => setAddedMessage(''), 4000);
    } catch (err) {
      setAddedMessage(err.message || 'Failed to save item. Are you signed in?');
      setTimeout(() => setAddedMessage(''), 4000);
    }
  };

  return (
    <div className="container">
      {/* Mobile-only Header */}
      <div className="mobile-product-header mobile-only">
        <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
        <div className="mobile-header-actions">
          <Link to="/cart"><i className="fa-solid fa-cart-shopping"></i></Link>
          <Link to={user ? '/profile' : '/login'} aria-label={user ? 'Open profile' : 'Sign in'}>
            <i className="fa-regular fa-user"></i>
          </Link>
        </div>
      </div>

      <div className="breadcrumbs desktop-only">
        <Link to="/">Home</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <Link to="#">Clothings</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <Link to="#">Men's wear</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <span>{product.category}</span>
      </div>

      {addedMessage && (
        <div style={{
          backgroundColor: (addedMessage.includes('successfully') || addedMessage.includes('saved')) ? '#E8F5E9' : '#FFF2F2',
          border: '1px solid ' + ((addedMessage.includes('successfully') || addedMessage.includes('saved')) ? 'var(--green)' : 'var(--red)'),
          borderRadius: '8px',
          color: (addedMessage.includes('successfully') || addedMessage.includes('saved')) ? 'var(--green)' : 'var(--red)',
          padding: '15px 20px',
          fontWeight: '500',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <span>{addedMessage}</span>
          <Link to="/cart" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>View Cart</Link>
        </div>
      )}

      <section className="product-detail-container">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="main-img" style={{ position: 'relative' }}>
            <img src={productImages[activeImageIdx]} alt="Product view" style={{ maxHeight: '100%', maxWidth: '100%' }} />
            <div className="mobile-carousel-arrows mobile-only">
              <i className="fa-solid fa-arrow-left" onClick={prevImage} style={{ cursor: 'pointer', padding: '5px' }}></i>
              <i className="fa-solid fa-arrow-right" onClick={nextImage} style={{ cursor: 'pointer', padding: '5px' }}></i>
            </div>
          </div>
          <div className="thumb-gallery desktop-only">
            {productImages.map((imgSrc, idx) => (
              <div
                className={`thumb-item ${idx === activeImageIdx ? 'active' : ''}`}
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
              >
                <img src={imgSrc} alt="" style={{ width: '40px', opacity: idx === activeImageIdx ? 1 : 0.6 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="product-info-main">
          <div className="stock-status desktop-only"><i className="fa-solid fa-check"></i> In stock</div>
          <h2 className="product-title">{product.title}</h2>
          <div className="rating-row">
            <div className="stars">
              <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
              <span style={{ color: 'var(--orange)', marginLeft: '5px' }}>{product.rating}</span>
            </div>
            <span className="dot-separator" style={{ margin: '0 10px' }}>&bull;</span>
            <span className="rating-count"><i className="fa-regular fa-message"></i> 32 reviews</span>
            <span className="dot-separator" style={{ margin: '0 10px' }}>&bull;</span>
            <span className="rating-count"><i className="fa-solid fa-basket-shopping"></i> {product.orders} sold</span>
          </div>

          <div className="price-tiers">
            <div className="tier-item">
              <span className="tier-price">${product.price.toFixed(2)}</span>
              <span className="tier-label">50-100 pcs</span>
            </div>
            <div className="tier-item desktop-only">
              <span className="tier-price">${(product.price * 0.9).toFixed(2)}</span>
              <span className="tier-label">100-700 pcs</span>
            </div>
            <div className="tier-item desktop-only">
              <span className="tier-price">${(product.price * 0.8).toFixed(2)}</span>
              <span className="tier-label">700+ pcs</span>
            </div>
          </div>

          {/* Quantity Selector & Main action block for Desktop */}
          <div className="quantity-select-box" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: 500, color: 'var(--dark-color)' }}>Quantity:</span>
            <div style={{ display: 'flex', border: '1px solid var(--gray-300)', borderRadius: '6px', overflow: 'hidden' }}>
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ border: 'none', background: 'var(--gray-200)', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold' }}
              >-</button>
              <span style={{ padding: '8px 20px', fontWeight: '600', minWidth: '50px', textAlign: 'center', display: 'inline-block' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                style={{ border: 'none', background: 'var(--gray-200)', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold' }}
              >+</button>
            </div>
          </div>

          <div className="mobile-action-buttons mobile-only" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={handleAddToCart} style={{ flex: 1 }}>Add to cart</button>
            <button 
              className="btn btn-white heart-btn-mobile" 
              onClick={handleSaveProductDetail}
              style={{ color: savedItems.some(item => item.productId === product.id) ? 'var(--red)' : 'var(--primary-color)' }}
            >
              <i className={savedItems.some(item => item.productId === product.id) ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
            </button>
          </div>

          <div className="mobile-read-more mobile-only">
            <p>{product.description.substring(0, 100)}...</p>
            <Link to="#">Read more</Link>
          </div>

          <div className="detail-specs desktop-only">
            <div className="spec-row">
              <span className="spec-label">Category:</span>
              <span className="spec-value">{product.category || 'N/A'}</span>
            </div>
            <div className="spec-row" style={{ marginTop: '20px' }}>
              <span className="spec-label">Condition:</span>
              <span className="spec-value">New</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Product ID:</span>
              <span className="spec-value">#{product.id}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Rating:</span>
              <span className="spec-value">{product.rating} / 5.0</span>
            </div>
          </div>

          <div className="detail-specs" style={{ borderTop: 'none', paddingTop: 0 }}>
            <div className="spec-row" style={{ marginTop: '20px' }}>
              <span className="spec-label">Availability:</span>
              <span className="spec-value">In Stock</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Shipping:</span>
              <span className="spec-value">Worldwide Delivery</span>
            </div>
          </div>
        </div>

        {/* Supplier */}
        <aside className="supplier-card">
          <div className="supplier-header">
            <div className="supplier-logo">{seller?.username ? seller.username.charAt(0).toUpperCase() : 'R'}</div>
            <div className="supplier-info">
              <h5>Supplier</h5>
              <p style={{ fontSize: '14px' }}>{seller?.username || 'Unknown Seller'}</p>
            </div>
          </div>
          <div className="supplier-details">
            <div className="supplier-detail-item"><img src="/assets/Layout1/Image/flags/DE@2x.png" alt="" style={{ width: '20px' }} /><span>Germany, Berlin</span></div>
            <div className="supplier-detail-item"><i className="fa-solid fa-shield-halved"></i><span>Verified Seller</span></div>
            <div className="supplier-detail-item"><i className="fa-solid fa-earth-americas"></i><span>Worldwide shipping</span></div>
          </div>
          <div className="supplier-card-actions desktop-only">
            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '10px' }} onClick={handleAddToCart}>Add to cart</button>
            <button className="btn btn-white" style={{ width: '100%', marginBottom: '10px', color: 'var(--primary-color)' }}>Send inquiry</button>
            <Link to={`/store/${product.userId || product.UserId || 1}`} className="btn btn-white" style={{ width: '100%', color: 'var(--primary-color)', display: 'block', textAlign: 'center', boxSizing: 'border-box' }}>Seller's profile</Link>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Link 
                to="#" 
                onClick={handleSaveProductDetail}
                style={{ color: savedItems.some(item => item.productId === product.id) ? 'var(--red)' : 'var(--primary-color)', fontSize: '15px', fontWeight: '500', textDecoration: 'none' }}
              >
                <i className={savedItems.some(item => item.productId === product.id) ? "fa-solid fa-heart" : "fa-regular fa-heart"} style={{ marginRight: '8px' }}></i>
                {savedItems.some(item => item.productId === product.id) ? 'Remove save for later' : 'Save for later'}
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <div className="detail-tabs-section desktop-only">
        <div className="tabs-container">
          <div className="tabs-header">
            <div className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</div>
            <div className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</div>
            <div className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`} onClick={() => setActiveTab('shipping')}>Shipping</div>
            <div className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About seller</div>
          </div>
          <div className="tab-content">
            {activeTab === 'description' && (
              <>
                <p>{product.description}</p>
                <table className="spec-table">
                  <tbody>
                    <tr><td>Category</td><td>{product.category || 'N/A'}</td></tr>
                    <tr><td>Product ID</td><td>#{product.id || 'N/A'}</td></tr>
                    <tr><td>Rating</td><td>{product.rating || 'N/A'}</td></tr>
                    <tr><td>Sales</td><td>{product.orders || 0}</td></tr>
                  </tbody>
                </table>
                <div className="features-list" style={{ marginTop: '20px' }}>
                  <p style={{ marginBottom: '8px', color: 'var(--secondary-color)', fontSize: '14px' }}><i className="fa-solid fa-check" style={{ marginRight: '10px' }}></i> Verified Quality Product</p>
                  <p style={{ marginBottom: '8px', color: 'var(--secondary-color)', fontSize: '14px' }}><i className="fa-solid fa-check" style={{ marginRight: '10px' }}></i> Fast shipping & Global delivery</p>
                  <p style={{ marginBottom: '8px', color: 'var(--secondary-color)', fontSize: '14px' }}><i className="fa-solid fa-check" style={{ marginRight: '10px' }}></i> Trusted Seller: {seller?.username || 'Unknown Seller'}</p>
                </div>
              </>
            )}
            {activeTab !== 'description' && <p>Content for {activeTab}</p>}
          </div>
        </div>

        <aside className="you-may-like">
          <h4>You may like</h4>
          {relatedProducts.length > 0 ? (
            relatedProducts.slice(0, 5).map((item, idx) => (
              <Link to={`/product?id=${item.id}`} className="mini-product" key={idx} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <div className="mini-img" style={{ border: '1px solid var(--gray-300)', padding: '5px', borderRadius: '4px' }}>
                  <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                </div>
                <div className="mini-info" style={{ overflow: 'hidden' }}>
                  <h5 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 5px 0' }}>{item.title}</h5>
                  <span style={{ color: 'var(--secondary-color)', fontSize: '14px' }}>${Number(item.price).toFixed(2)}</span>
                </div>
              </Link>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--secondary-color)' }}>No recommendations</p>
          )}
        </aside>
      </div>

      {relatedProducts.length > 0 && (
        <>
          <aside className="mobile-you-may-like mobile-only">
            <h4>Similar products</h4>
            <div className="mobile-similar-scroll">
              {relatedProducts.map((item, idx) => (
                <Link to={`/product?id=${item.id}`} className="mobile-similar-item" key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="mobile-similar-img">
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p className="mobile-similar-price">${Number(item.price).toFixed(2)}</p>
                  <p className="mobile-similar-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                </Link>
              ))}
            </div>
          </aside>

          <section className="related-products-box desktop-only">
            <h3>Related products</h3>
            <div className="related-grid">
              {relatedProducts.map((item, idx) => (
                <Link to={`/product?id=${item.id}`} className="related-item" key={idx} style={{ textDecoration: 'none' }}>
                  <div className="related-item-img">
                    <img src={item.image} alt={item.title} style={{ height: '110px', width: '100%', objectFit: 'contain' }} />
                  </div>
                  <p style={{ fontSize: '14px', color: '#1C1C1C', marginTop: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                  <p style={{ fontSize: '14px', color: 'var(--secondary-color)', marginTop: '5px' }}>${Number(item.price).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Discount Banner */}
      <div className="discount-banner desktop-only">
        <div className="banner-text">
          <h3 style={{ fontSize: '24px' }}>Super discount on more than 100 USD</h3>
          <p style={{ opacity: 0.8 }}>Have you ever finally just write dummy info</p>
        </div>
        <button className="btn" style={{ backgroundColor: 'var(--orange)', color: 'var(--white)' }}>Shop now</button>
      </div>
    </div>
  );
}
