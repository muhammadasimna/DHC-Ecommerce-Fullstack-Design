import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProductDetail() {
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const productImages = [
    './public/assets/Layout/alibaba/Image/cloth/Bitmap.png',
    './public/assets/Layout/alibaba/Image/cloth/image 30.png',
    './public/assets/Layout/alibaba/Image/cloth/2 1.png',
    './public/assets/Layout/alibaba/Image/cloth/Bitmap (2).png',
    './public/assets/Layout/alibaba/Image/cloth/image 24.png'
  ];

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  useEffect(() => {
    document.body.classList.add('product-detail-page');
    return () => {
      document.body.classList.remove('product-detail-page');
    };
  }, []);

  return (
    <div className="container">
      {/* Mobile-only Header */}
      <div className="mobile-product-header mobile-only">
        <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
        <div className="mobile-header-actions">
          <Link to="/cart"><i className="fa-solid fa-cart-shopping"></i></Link>
          <Link to="#"><i className="fa-regular fa-user"></i></Link>
        </div>
      </div>

      <div className="breadcrumbs desktop-only">
        <Link to="/">Home</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <Link to="#">Clothings</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <Link to="#">Men's wear</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <span>Summer clothing</span>
      </div>

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
          <h2 className="product-title">Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle</h2>
          <div className="rating-row">
            <div className="stars">
              <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
              <span style={{ color: 'var(--orange)', marginLeft: '5px' }}>9.3</span>
            </div>
            <span className="dot-separator" style={{ margin: '0 10px' }}>&bull;</span>
            <span className="rating-count"><i className="fa-regular fa-message"></i> 32 reviews</span>
            <span className="dot-separator" style={{ margin: '0 10px' }}>&bull;</span>
            <span className="rating-count"><i className="fa-solid fa-basket-shopping"></i> 154 sold</span>
          </div>

          <div className="price-tiers">
            <div className="tier-item">
              <span className="tier-price">$98.00</span>
              <span className="tier-label">50-100 pcs</span>
            </div>
            <div className="tier-item desktop-only">
              <span className="tier-price">$90.00</span>
              <span className="tier-label">100-700 pcs</span>
            </div>
            <div className="tier-item desktop-only">
              <span className="tier-price">$78.00</span>
              <span className="tier-label">700+ pcs</span>
            </div>
          </div>

          <div className="mobile-action-buttons mobile-only">
            <button className="btn btn-primary">Send inquiry</button>
            <button className="btn btn-white heart-btn-mobile"><i className="fa-regular fa-heart"></i></button>
          </div>

          <div className="mobile-read-more mobile-only">
            <p>Info about edu item is an ideal companion for anyone engaged in learning. The drone provides precise and ...</p>
            <Link to="#">Read more</Link>
          </div>

          <div className="detail-specs desktop-only">
            <div className="spec-row">
              <span className="spec-label">Price:</span>
              <span className="spec-value">Negotiable</span>
            </div>
            <div className="spec-row" style={{ marginTop: '20px' }}>
              <span className="spec-label">Type:</span>
              <span className="spec-value">Classic shoes</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Material:</span>
              <span className="spec-value">Plastic material</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Design:</span>
              <span className="spec-value">Modern nice</span>
            </div>
          </div>

          <div className="detail-specs" style={{ borderTop: 'none', paddingTop: 0 }}>
            <div className="spec-row" style={{ marginTop: '20px' }}>
              <span className="spec-label">Customization:</span>
              <span className="spec-value">Customized logo and design custom packages</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Protection:</span>
              <span className="spec-value">Refund Policy</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Warranty:</span>
              <span className="spec-value">2 years full warranty</span>
            </div>
          </div>
        </div>

        {/* Supplier */}
        <aside className="supplier-card">
          <div className="supplier-header">
            <div className="supplier-logo">R</div>
            <div className="supplier-info">
              <h5>Supplier</h5>
              <p style={{ fontSize: '14px' }}>Guanjoi Trading LLC</p>
            </div>
          </div>
          <div className="supplier-details">
            <div className="supplier-detail-item"><img src="./public/assets/Layout1/Image/flags/DE@2x.png" alt="" style={{ width: '20px' }} /><span>Germany, Berlin</span></div>
            <div className="supplier-detail-item"><i className="fa-solid fa-shield-halved"></i><span>Verified Seller</span></div>
            <div className="supplier-detail-item"><i className="fa-solid fa-earth-americas"></i><span>Worldwide shipping</span></div>
          </div>
          <div className="supplier-card-actions desktop-only">
            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '10px' }}>Send inquiry</button>
            <button className="btn btn-white" style={{ width: '100%', color: 'var(--primary-color)' }}>Seller's profile</button>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Link to="#" style={{ color: 'var(--primary-color)', fontSize: '15px', fontWeight: '500', textDecoration: 'none' }}>
                <i className="fa-regular fa-heart" style={{ marginRight: '8px' }}></i> Save for later
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
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                <table className="spec-table">
                  <tbody>
                    <tr><td>Model</td><td>#8786867</td></tr>
                    <tr><td>Style</td><td>Classic style</td></tr>
                    <tr><td>Certificate</td><td>ISO-898921212</td></tr>
                    <tr><td>Size</td><td>34mm x 450mm x 19mm</td></tr>
                    <tr><td>Memory</td><td>36GB RAM</td></tr>
                  </tbody>
                </table>
                <div className="features-list" style={{ marginTop: '20px' }}>
                  <p style={{ marginBottom: '8px', color: 'var(--secondary-color)', fontSize: '14px' }}><i className="fa-solid fa-check" style={{ marginRight: '10px' }}></i> Some great feature name here</p>
                  <p style={{ marginBottom: '8px', color: 'var(--secondary-color)', fontSize: '14px' }}><i className="fa-solid fa-check" style={{ marginRight: '10px' }}></i> Lorem ipsum dolor sit amet, consectetur</p>
                  <p style={{ marginBottom: '8px', color: 'var(--secondary-color)', fontSize: '14px' }}><i className="fa-solid fa-check" style={{ marginRight: '10px' }}></i> Duis aute irure dolor in reprehenderit</p>
                  <p style={{ color: 'var(--secondary-color)', fontSize: '14px' }}><i className="fa-solid fa-check" style={{ marginRight: '10px' }}></i> Some great feature name here</p>
                </div>
              </>
            )}
            {activeTab !== 'description' && <p>Content for {activeTab}</p>}
          </div>
        </div>

        <aside className="you-may-like">
          <h4>You may like</h4>
          {[
            { img: './public/assets/Layout/alibaba/Image/cloth/image 30.png', title: 'Men Blazers Sets Elegant Formal', price: '$7.00 - $99.50' },
            { img: './public/assets/Layout/alibaba/Image/cloth/Bitmap.png', title: 'Men Shirt Sleeve Polo Contrast', price: '$7.00 - $99.50' },
            { img: './public/assets/Image/tech/8.png', title: 'Apple Watch Series Space Gray', price: '$7.00 - $99.50' },
            { img: './public/assets/Layout/alibaba/Image/cloth/Bitmap (1).png', title: 'Basketball Crew Socks Long Stuff', price: '$7.00 - $99.50' },
            { img: './public/assets/Layout/alibaba/Image/tech/image 34.png', title: 'New Summer Men\'s castrol T-Shirts', price: '$7.00 - $99.50' },
          ].map((item, idx) => (
            <div className="mini-product" key={idx}>
              <div className="mini-img"><img src={item.img} alt="" style={{ width: '30px' }} /></div>
              <div className="mini-info"><h5>{item.title}</h5><span>{item.price}</span></div>
            </div>
          ))}
        </aside>
      </div>

      <aside className="mobile-you-may-like mobile-only">
        <h4>Similar products</h4>
        <div className="mobile-similar-scroll">
          {[
            { img: './public/assets/Layout/alibaba/Image/cloth/image 30.png', title: 'T-shirts with multiple colors, for men', price: '$10.30' },
            { img: './public/assets/Layout/alibaba/Image/cloth/Bitmap.png', title: 'T-shirts with multiple colors, for men', price: '$10.30' },
            { img: './public/assets/Image/tech/8.png', title: 'T-shirts with multiple colors, for men', price: '$10.30' }
          ].map((item, idx) => (
            <div className="mobile-similar-item" key={idx}>
              <div className="mobile-similar-img"><img src={item.img} alt="" style={{ width: '100%' }} /></div>
              <p className="mobile-similar-price">{item.price}</p>
              <p className="mobile-similar-title">{item.title}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Related Products */}
      <section className="related-products-box desktop-only">
        <h3>Related products</h3>
        <div className="related-grid">
          {[
            { img: './public/assets/Layout/alibaba/Image/cloth/image 24.png', title: 'Xiaomi Redmi 8 Original', price: '$32.00-$40.00' },
            { img: './public/assets/Image/tech/8.png', title: 'Xiaomi Redmi 8 Original', price: '$32.00-$40.00' },
            { img: './public/assets/Layout/alibaba/Image/tech/image 86.png', title: 'Xiaomi Redmi 8 Original', price: '$32.00-$40.00' },
            { img: './public/assets/Layout/alibaba/Image/cloth/Bitmap (2).png', title: 'Xiaomi Redmi 8 Original', price: '$32.00-$40.00' },
            { img: './public/assets/Layout/alibaba/Image/tech/image 85.png', title: 'Xiaomi Redmi 8 Original', price: '$32.00-$40.00' },
            { img: './public/assets/Layout/alibaba/Image/interior/image 90.png', title: 'Xiaomi Redmi 8 Original', price: '$32.00-$40.00' },
          ].map((item, idx) => (
            <div className="related-item" key={idx}>
              <div className="related-item-img"><img src={item.img} alt="" style={{ height: '110px' }} /></div>
              <p style={{ fontSize: '14px', color: '#1C1C1C', marginTop: '10px' }}>{item.title}</p>
              <p style={{ fontSize: '14px', color: 'var(--secondary-color)', marginTop: '5px' }}>{item.price}</p>
            </div>
          ))}
        </div>
      </section>

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
