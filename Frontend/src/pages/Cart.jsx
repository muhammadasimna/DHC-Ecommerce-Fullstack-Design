import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  useEffect(() => {
    document.body.classList.add('cart-page');
    return () => {
      document.body.classList.remove('cart-page');
    };
  }, []);
  return (
    <main className="container cart-container">
      {/* Mobile-only Header */}
      <div className="mobile-cart-header mobile-only">
        <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
        <h3>Shopping cart</h3>
        <div style={{ width: '20px' }}></div>
      </div>

      <h2 className="desktop-only" style={{ marginBottom: '20px', marginTop: '20px' }}>My cart (3)</h2>

      <div className="cart-layout">
        <div className="cart-items-container">
          <div className="cart-items-box">
            {[
              { id: 1, img: './public/assets/Layout/alibaba/Image/cloth/Bitmap.png', title: 'T-shirts with multiple colors for men', desc: 'Size: medium, Color: blue', seller: 'Artel Market', price: '$78.99', qty: 2 },
              { id: 2, img: './public/assets/Layout/alibaba/Image/cloth/image 26.png', title: 'Solid Backpack blue jeans large size', desc: 'Size: medium, Color: blue', seller: 'Artel Market', price: '$78.99', qty: 1 },
              { id: 3, img: './public/assets/Image/interior/image 89.png', title: 'Water boiler black for kitchen, 1200 Watt', desc: 'Size: medium, Color: blue', seller: 'Artel Market', price: '$78.99', qty: 2 }
            ].map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img"><img src={item.img} alt="" style={{ width: '60px' }} /></div>
                <div className="cart-item-info" style={{ position: 'relative' }}>
                  <i className="fa-solid fa-ellipsis-vertical mobile-only" style={{ position: 'absolute', right: '0', top: '0', color: '#8B96A5', fontSize: '18px' }}></i>
                  <h4 style={{ fontSize: '16px', fontWeight: 500, color: '#1C1C1C', paddingRight: '20px' }}>{item.title}</h4>
                  <p style={{ color: '#8B96A5', fontSize: '14px', marginTop: '5px' }}>{item.desc}</p>
                  <p style={{ color: '#8B96A5', fontSize: '14px', marginTop: '5px', marginBottom: '15px' }} className="desktop-only">Seller: {item.seller}</p>
                  <p style={{ color: '#8B96A5', fontSize: '14px', marginTop: '3px' }} className="mobile-only">Seller: {item.seller}</p>
                  <div className="cart-item-actions desktop-only">
                    <button className="btn btn-white" style={{ color: 'var(--red)', padding: '6px 12px', fontSize: '13px', fontWeight: 500, borderRadius: '6px', border: '1px solid var(--gray-300)' }}>Remove</button>
                    <button className="btn btn-white" style={{ color: 'var(--primary-color)', padding: '6px 12px', fontSize: '13px', fontWeight: 500, borderRadius: '6px', border: '1px solid var(--gray-300)' }}>Save for later</button>
                  </div>
                </div>
                <div className="cart-item-price-box">
                  <span className="cart-item-price" style={{ fontWeight: '600', fontSize: '16px', color: '#1C1C1C' }}>{item.price}</span>
                  <div className="mobile-qty-stepper mobile-only">
                    <button className="stepper-btn">-</button>
                    <span className="stepper-val">{item.qty}</span>
                    <button className="stepper-btn">+</button>
                  </div>
                  <select className="form-control desktop-only" style={{ width: '90px', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--gray-300)', color: '#1C1C1C', outline: 'none' }} defaultValue={`Qty: ${item.qty}`}>
                    <option value={`Qty: ${item.qty}`}>Qty: {item.qty}</option>
                  </select>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }} className="desktop-only">
              <Link to="/" className="btn btn-primary" style={{ borderRadius: '6px', fontWeight: 500 }}><i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Back to shop</Link>
              <button className="btn btn-white" style={{ color: 'var(--primary-color)', border: '1px solid var(--gray-300)', borderRadius: '6px', fontWeight: 500 }}>Remove all</button>
            </div>
          </div>

          <div className="service-features desktop-only">
            <div className="feature-item"><div className="feature-icon"><i className="fa-solid fa-lock"></i></div><div><p style={{ color: 'var(--dark-color)', fontWeight: 500 }}>Secure payment</p><p style={{ fontSize: '12px' }}>Have you ever finally just</p></div></div>
            <div className="feature-item"><div className="feature-icon"><i className="fa-solid fa-message"></i></div><div><p style={{ color: 'var(--dark-color)', fontWeight: 500 }}>Customer support</p><p style={{ fontSize: '12px' }}>Have you ever finally just</p></div></div>
            <div className="feature-item"><div className="feature-icon"><i className="fa-solid fa-truck"></i></div><div><p style={{ color: 'var(--dark-color)', fontWeight: 500 }}>Free delivery</p><p style={{ fontSize: '12px' }}>Have you ever finally just</p></div></div>
          </div>
        </div>

        <aside className="cart-summary-sidebar">
          <div className="coupon-card desktop-only">
            <p style={{ marginBottom: '10px' }}>Have a coupon?</p>
            <div style={{ display: 'flex', border: '1px solid var(--gray-300)', borderRadius: '6px', overflow: 'hidden' }}>
              <input type="text" placeholder="Add coupon" style={{ border: 'none', flex: 1, padding: '12px 15px', outline: 'none' }} />
              <button className="btn btn-white" style={{ border: 'none', borderLeft: '1px solid var(--gray-300)', color: 'var(--primary-color)', fontWeight: 500, padding: '12px 20px' }}>Apply</button>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-row">
              <span className="desktop-only">Subtotal:</span>
              <span className="mobile-only">Items (3):</span>
              <span className="desktop-only">$1403.97</span>
              <span className="mobile-only">$32.00</span>
            </div>
            <div className="summary-row">
              <span className="desktop-only">Discount:</span>
              <span className="desktop-only" style={{ color: 'var(--red)' }}>- $60.00</span>
              <span className="mobile-only">Shipping:</span>
              <span className="mobile-only" style={{ color: 'var(--dark-color)' }}>$10.00</span>
            </div>
            <div className="summary-row">
              <span className="desktop-only">Tax:</span>
              <span className="desktop-only" style={{ color: 'var(--green)' }}>+ $14.00</span>
              <span className="mobile-only">Tax:</span>
              <span className="mobile-only" style={{ color: 'var(--dark-color)' }}>$7.00</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span className="desktop-only" style={{ fontSize: '20px', fontWeight: 700 }}>$1357.97</span>
              <span className="mobile-only" style={{ fontSize: '20px', fontWeight: 700 }}>$220.00</span>
            </div>
            <button className="btn btn-green" style={{ backgroundColor: '#00B517', color: 'white', width: '100%', border: 'none', padding: '15px', borderRadius: '6px', fontSize: '16px', fontWeight: 600, marginTop: '20px' }}>
              <span className="desktop-only">Checkout</span>
              <span className="mobile-only">Checkout (3 items)</span>
            </button>
            <div className="payment-methods" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%(2018%).svg/1200px-American_Express_logo_%(2018%).svg.png" alt="Amex" style={{ height: '14px' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" style={{ height: '14px' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" style={{ height: '14px' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" style={{ height: '14px' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/1280px-Apple_Pay_logo.svg.png" alt="Apple Pay" style={{ height: '14px' }} />
            </div>
          </div>
        </aside>
      </div>

      <section className="saved-later-box desktop-only">
        <h3 style={{ marginBottom: '20px' }}>Saved for later</h3>
        <div className="saved-grid">
          {[
            { img: './public/assets/Image/tech/image 32.png', price: '$99.50', title: 'GoPro HERO6 4K Action Camera - Black' },
            { img: './public/assets/Image/tech/image 33.png', price: '$99.50', title: 'GoPro HERO6 4K Action Camera - Black' },
            { img: './public/assets/Image/tech/8.png', price: '$99.50', title: 'GoPro HERO6 4K Action Camera - Black' },
            { img: './public/assets/Image/tech/image 34.png', price: '$99.50', title: 'GoPro HERO6 4K Action Camera - Black' }
          ].map((item, idx) => (
            <div className="saved-item" key={idx}>
              <div className="saved-img"><img src={item.img} alt="" style={{ width: '140px' }} /></div>
              <p style={{ fontWeight: 600, marginBottom: '10px' }}>{item.price}</p>
              <p style={{ fontSize: '14px', color: 'var(--secondary-color)', marginBottom: '15px' }}>{item.title}</p>
              <button className="btn btn-white" style={{ color: 'var(--primary-color)', fontSize: '14px' }}><i className="fa-solid fa-cart-shopping"></i> Move to cart</button>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Saved for Later */}
      <section className="mobile-saved-later-box mobile-only" style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#1C1C1C' }}>Saved for later</h3>
        <div className="mobile-saved-list" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
          {[
            { img: './public/assets/Image/tech/image 32.png', price: '$57.70', title: 'Regular Fit Resort Shirt' },
            { img: './public/assets/Image/tech/image 33.png', price: '$57.70', title: 'Regular Fit Resort Shirt' },
            { img: './public/assets/Image/tech/8.png', price: '$57.70', title: 'Regular Fit Resort Shirt' }
          ].map((item, idx) => (
            <div className="mobile-saved-card" key={idx} style={{ display: 'flex', gap: '15px', background: 'var(--white)', padding: '15px', borderRadius: '8px', border: '1px solid var(--gray-300)' }}>
              <div className="mobile-saved-img" style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--gray-200)', borderRadius: '6px', background: '#F7F7F7' }}>
                <img src={item.img} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </div>
              <div className="mobile-saved-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#1C1C1C', margin: 0 }}>{item.title}</h4>
                  <p style={{ fontWeight: 600, fontSize: '15px', color: '#1C1C1C', margin: '5px 0 0 0' }}>{item.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="btn" style={{ color: 'var(--primary-color)', border: '1px solid var(--primary-color)', background: 'transparent', padding: '6px 12px', fontSize: '13px', borderRadius: '6px', fontWeight: 500 }}>Move to cart</button>
                  <button className="btn" style={{ color: 'var(--red)', border: '1px solid var(--red)', background: 'transparent', padding: '6px 12px', fontSize: '13px', borderRadius: '6px', fontWeight: 500 }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discount Banner */}
      <div className="discount-banner desktop-only" style={{ marginTop: '40px' }}>
        <div className="banner-text">
          <h3 style={{ fontSize: '24px' }}>Super discount on more than 100 USD</h3>
          <p style={{ opacity: 0.8 }}>Have you ever finally just write dummy info</p>
        </div>
        <button className="btn" style={{ backgroundColor: 'var(--orange)', color: 'var(--white)' }}>Shop now</button>
      </div>
    </main>
  );
}
