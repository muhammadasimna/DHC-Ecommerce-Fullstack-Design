import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, savedItems, updateQuantity, removeFromCart, saveForLater, moveToCart, clearCart, loading } = useCart();
  const { token, backendUrl } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('cart-page');
    return () => {
      document.body.classList.remove('cart-page');
    };
  }, []);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  const discount = subtotal > 100 ? 10 : 0; // Simple example discount logic
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal - discount + tax;

  const handleQtyChange = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQty);
    }
  };

  const query = new URLSearchParams(location.search).get('q')?.toLowerCase().trim() || '';
  const displayedCartItems = query
    ? cartItems.filter((item) =>
        [item.product?.title, item.product?.category, item.product?.description]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query))
      )
    : cartItems;
  const displayedSavedItems = query
    ? savedItems.filter((item) =>
        [item.product?.title, item.product?.category, item.product?.description]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query))
      )
    : savedItems;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '40px', color: 'var(--primary-color)', marginBottom: '15px' }}></i>
        <p style={{ color: 'var(--secondary-color)' }}>Loading your shopping cart...</p>
      </div>
    );
  }

  return (
    <main className="container cart-container">
      {/* Mobile-only Header */}
      <div className="mobile-cart-header mobile-only">
        <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
        <h3>Shopping cart</h3>
        <div style={{ width: '20px' }}></div>
      </div>

      <h2 className="desktop-only" style={{ marginBottom: '20px', marginTop: '20px' }}>My cart ({displayedCartItems.length})</h2>

      {displayedCartItems.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--white)',
          border: '1px solid var(--gray-300)',
          borderRadius: '12px',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          margin: '40px 0'
        }}>
          <i className="fa-solid fa-cart-flatbed-suitcases" style={{ fontSize: '80px', color: 'var(--gray-400)', marginBottom: '20px' }}></i>
          <h3 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--dark-color)' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--secondary-color)', fontSize: '15px', marginTop: '10px', marginBottom: '30px' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/listing" className="btn btn-primary" style={{ padding: '12px 30px', fontWeight: 600 }}>Explore Products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-container">
            <div className="cart-items-box">
              {displayedCartItems.map(item => (
                <div className="cart-item" key={item.id}>
                  <div
                    className="cart-item-img"
                    style={{ cursor: item.productId ? 'pointer' : 'default' }}
                    onClick={() => item.productId && navigate(`/product?id=${item.productId}`)}
                  >
                    <img src={item.product?.image || './public/assets/Layout/alibaba/Image/cloth/Bitmap.png'} alt="" style={{ width: '60px' }} />
                  </div>
                  <div className="cart-item-info" style={{ position: 'relative' }}>
                    <i className="fa-solid fa-ellipsis-vertical mobile-only" style={{ position: 'absolute', right: '0', top: '0', color: '#8B96A5', fontSize: '18px' }}></i>
                    <h4
                      style={{ fontSize: '16px', fontWeight: 500, color: '#1C1C1C', paddingRight: '20px', cursor: item.productId ? 'pointer' : 'default' }}
                      onClick={() => item.productId && navigate(`/product?id=${item.productId}`)}
                    >
                      {item.product?.title}
                    </h4>
                    <p style={{ color: '#8B96A5', fontSize: '14px', marginTop: '5px' }}>Size: {item.size}, Color: {item.color}</p>
                    <p style={{ color: '#8B96A5', fontSize: '14px', marginTop: '5px', marginBottom: '15px' }} className="desktop-only">Seller: Artel Market</p>
                    <div className="cart-item-actions desktop-only">
                      <button className="btn btn-white" onClick={() => removeFromCart(item.id)} style={{ color: 'var(--red)', padding: '6px 12px', fontSize: '13px', fontWeight: 500, borderRadius: '6px', border: '1px solid var(--gray-300)' }}>Remove</button>
                      <button className="btn btn-white" onClick={() => saveForLater(item.id)} style={{ color: 'var(--primary-color)', padding: '6px 12px', fontSize: '13px', fontWeight: 500, borderRadius: '6px', border: '1px solid var(--gray-300)' }}>Save for later</button>
                    </div>
                  </div>
                  <div className="cart-item-price-box">
                    <span className="cart-item-price" style={{ fontWeight: '600', fontSize: '16px', color: '#1C1C1C' }}>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>

                    {/* Qty Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-300)', borderRadius: '6px', overflow: 'hidden', marginTop: '10px' }}>
                      <button
                        onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                        style={{ border: 'none', background: 'var(--gray-200)', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' }}
                      >-</button>
                      <span style={{ padding: '5px 15px', fontWeight: '600', minWidth: '35px', textAlign: 'center', display: 'inline-block', fontSize: '14px' }}>{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                        style={{ border: 'none', background: 'var(--gray-200)', padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold' }}
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Link to="/listing" className="btn btn-primary" style={{ borderRadius: '6px', fontWeight: 500 }}><i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Back to shop</Link>
                <button className="btn btn-white" onClick={clearCart} style={{ color: 'var(--red)', border: '1px solid var(--gray-300)', borderRadius: '6px', fontWeight: 500 }}>Remove all</button>
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
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Discount:</span>
                <span style={{ color: 'var(--red)', fontWeight: 600 }}>- ${discount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%):</span>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>+ ${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span style={{ fontSize: '20px', fontWeight: 700 }}>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={async () => {
                  if (!token) return;
                  const res = await fetch(`${backendUrl}/orders/checkout`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    alert(data.message || 'Checkout failed');
                    return;
                  }
                  alert('Order placed successfully!');
                  await clearCart();
                  navigate('/orders');
                }}
                className="btn btn-green"
                style={{ backgroundColor: '#00B517', color: 'white', width: '100%', border: 'none', padding: '15px', borderRadius: '6px', fontSize: '16px', fontWeight: 600, marginTop: '20px' }}
              >
                Checkout ({cartItems.length} items)
              </button>
              <div className="payment-methods" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" style={{ height: '14px' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" style={{ height: '14px' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" style={{ height: '14px' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/1280px-Apple_Pay_logo.svg.png" alt="Apple Pay" style={{ height: '14px' }} />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Saved for Later - Dynamic from Backend */}
      {displayedSavedItems.length > 0 && (
        <section className="saved-later-box desktop-only" style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '20px' }}>Saved for later ({displayedSavedItems.length})</h3>
          <div className="saved-grid">
            {displayedSavedItems.map(item => (
              <div className="saved-item" key={item.id}>
                <div
                  className="saved-img"
                  style={{ cursor: item.productId ? 'pointer' : 'default' }}
                  onClick={() => item.productId && navigate(`/product?id=${item.productId}`)}
                >
                  <img src={item.product?.image || './public/assets/Layout/alibaba/Image/cloth/Bitmap.png'} alt="" style={{ width: '140px' }} />
                </div>
                <p style={{ fontWeight: 600, marginBottom: '10px' }}>${item.product?.price?.toFixed(2)}</p>
                <p
                  style={{ fontSize: '14px', color: 'var(--secondary-color)', marginBottom: '15px', cursor: item.productId ? 'pointer' : 'default' }}
                  onClick={() => item.productId && navigate(`/product?id=${item.productId}`)}
                >
                  {item.product?.title}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-white" onClick={() => moveToCart(item.id)} style={{ color: 'var(--primary-color)', fontSize: '14px' }}><i className="fa-solid fa-cart-shopping" style={{ marginRight: '5px' }}></i> Move to cart</button>
                  <button className="btn btn-white" onClick={() => removeFromCart(item.id)} style={{ color: 'var(--red)', fontSize: '14px', padding: '6px 10px' }}><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mobile Saved for Later - Dynamic from Backend */}
      {displayedSavedItems.length > 0 && (
        <section className="mobile-saved-later-box mobile-only" style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#1C1C1C' }}>Saved for later ({displayedSavedItems.length})</h3>
          <div className="mobile-saved-list" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
            {displayedSavedItems.map(item => (
              <div className="mobile-saved-card" key={item.id} style={{ display: 'flex', gap: '15px', background: 'var(--white)', padding: '15px', borderRadius: '8px', border: '1px solid var(--gray-300)' }}>
                <div
                  className="mobile-saved-img"
                  style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--gray-200)', borderRadius: '6px', background: '#F7F7F7', cursor: item.productId ? 'pointer' : 'default' }}
                  onClick={() => item.productId && navigate(`/product?id=${item.productId}`)}
                >
                  <img src={item.product?.image || './public/assets/Layout/alibaba/Image/cloth/Bitmap.png'} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </div>
                <div className="mobile-saved-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4
                      style={{ fontSize: '14px', fontWeight: 500, color: '#1C1C1C', margin: 0, cursor: item.productId ? 'pointer' : 'default' }}
                      onClick={() => item.productId && navigate(`/product?id=${item.productId}`)}
                    >
                      {item.product?.title}
                    </h4>
                    <p style={{ fontWeight: 600, fontSize: '15px', color: '#1C1C1C', margin: '5px 0 0 0' }}>${item.product?.price?.toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="btn" onClick={() => moveToCart(item.id)} style={{ color: 'var(--primary-color)', border: '1px solid var(--primary-color)', background: 'transparent', padding: '6px 12px', fontSize: '13px', borderRadius: '6px', fontWeight: 500 }}>Move to cart</button>
                    <button className="btn" onClick={() => removeFromCart(item.id)} style={{ color: 'var(--red)', border: '1px solid var(--red)', background: 'transparent', padding: '6px 12px', fontSize: '13px', borderRadius: '6px', fontWeight: 500 }}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
