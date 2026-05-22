import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="mobile-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header-top">
          <div className="sidebar-user">
            <i className="fa-solid fa-circle-user avatar-icon"></i>
            <div className="auth-links">
              <Link to="#">Sign in</Link> | <Link to="#">Register</Link>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li><Link to="/" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-house"></i> Home</Link></li>
            <li><Link to="/listing" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-list"></i> Categories</Link></li>
            <li><Link to="#" onClick={() => setIsSidebarOpen(false)}><i className="fa-regular fa-heart"></i> Favorites</Link></li>
            <li><Link to="#" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-box"></i> My orders</Link></li>
          </ul>
          <hr className="sidebar-divider" />
          <ul className="sidebar-menu">
            <li><Link to="#" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-globe"></i> English | USD</Link></li>
            <li><Link to="#" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-headset"></i> Contact us</Link></li>
            <li><Link to="#" onClick={() => setIsSidebarOpen(false)}><i className="fa-regular fa-building"></i> About</Link></li>
          </ul>
          <hr className="sidebar-divider" />
          <ul className="sidebar-footer-menu">
            <li><Link to="#" onClick={() => setIsSidebarOpen(false)}>User agreement</Link></li>
            <li><Link to="#" onClick={() => setIsSidebarOpen(false)}>Partnership</Link></li>
            <li><Link to="#" onClick={() => setIsSidebarOpen(false)}>Privacy policy</Link></li>
          </ul>
        </div>
      </div>

      <header className="header-main">
        <div className="container">
          <div className="mobile-menu-icon" onClick={() => setIsSidebarOpen(true)}>
            <i className="fa-solid fa-bars"></i>
          </div>
          <div className="logo">
            <Link to="/">
              <img src="/assets/Layout/Brand/logo-colored.png" alt="Brand Logo" />
            </Link>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <select defaultValue="All category">
              <option value="All category">All category</option>
            </select>
            <button className="btn btn-primary">Search</button>
          </div>
          <div className="header-actions">
            <Link to="/cart" className="action-item">
              <i className="fa-solid fa-cart-shopping"></i>
              <span>My cart</span>
            </Link>
            <Link to="#" className="action-item">
              <i className="fa-regular fa-user"></i>
              <span>Profile</span>
            </Link>
            <Link to="#" className="action-item desktop-only">
              <i className="fa-regular fa-message"></i>
              <span>Message</span>
            </Link>
            <Link to="#" className="action-item desktop-only">
              <i className="fa-regular fa-heart"></i>
              <span>Orders</span>
            </Link>
          </div>
        </div>
      </header>

      <nav className="nav-bottom">
        <div className="container">
          <div className="nav-left">
            <div className="category-toggle">
              <i className="fa-solid fa-bars"></i>
              <span>All category</span>
            </div>
            <ul className="nav-links">
              <li><Link to="/listing">Hot offers</Link></li>
              <li><Link to="/product">Gift boxes</Link></li>
              <li><Link to="#">Projects</Link></li>
              <li><Link to="#">Menu item</Link></li>
              <li><Link to="#">Help</Link> <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i></li>
            </ul>
          </div>
          <div className="nav-right">
            <div className="lang-currency">
              <span>English, USD</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
            </div>
            <div className="shipping-to" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>Ship to</span>
              <img src="/assets/Layout1/Image/flags/DE@2x.png" alt="Germany Flag" style={{ width: '20px' }} />
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="container">
        <h2>Subscribe on our newsletter</h2>
        <p>Get daily news on upcoming offers from many suppliers all over the world</p>
        <div className="newsletter-form">
          <div style={{ flex: 1, position: 'relative' }}>
            <i className="fa-regular fa-envelope" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-color)' }}></i>
            <input type="email" placeholder="Email" style={{ paddingLeft: '40px' }} />
          </div>
          <button className="btn btn-primary">Subscribe</button>
        </div>
      </div>
    </section>
  );
}

export function Footer({ showNewsletter = true, showLinks = true }) {
  return (
    <>
      {showNewsletter && <Newsletter />}
      <footer style={!showLinks ? { paddingBottom: '20px' } : {}}>
        <div className="container">
          {showLinks && (
            <div className="footer-top">
              <div className="footer-brand">
                <div className="logo"><img src="/assets/Layout/Brand/logo-colored.png" alt="Brand Logo" /></div>
                <p>Best information about the company gies here but now lorem ipsum is</p>
                <div className="social-links">
                  <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="#"><i className="fa-brands fa-twitter"></i></a>
                  <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                  <a href="#"><i className="fa-brands fa-instagram"></i></a>
                  <a href="#"><i className="fa-brands fa-youtube"></i></a>
                </div>
              </div>
              <div className="footer-links">
                <div className="footer-col">
                  <h4>About</h4>
                  <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Find store</a></li>
                    <li><a href="#">Categories</a></li>
                    <li><a href="#">Blogs</a></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>Partnership</h4>
                  <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Find store</a></li>
                    <li><a href="#">Categories</a></li>
                    <li><a href="#">Blogs</a></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>Information</h4>
                  <ul>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Money Refund</a></li>
                    <li><a href="#">Shipping</a></li>
                    <li><a href="#">Contact us</a></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>For users</h4>
                  <ul>
                    <li><a href="#">Login</a></li>
                    <li><a href="#">Register</a></li>
                    <li><a href="#">Settings</a></li>
                    <li><a href="#">My Orders</a></li>
                  </ul>
                </div>
              </div>
              <div className="footer-col">
                <h4>Get app</h4>
                <div className="app-buttons">
                  <a href="#"><img src="/assets/Layout/Misc/market-button.png" alt="App Store" style={{ display: 'block', marginBottom: '10px', width: '120px' }} /></a>
                  <a href="#"><img src="/assets/Layout/Misc/Group.png" alt="Google Play" style={{ display: 'block', width: '120px' }} /></a>
                </div>
              </div>
            </div>
          )}
          <div className="footer-bottom" style={!showLinks ? { border: 'none', padding: 0 } : {}}>
            <p>&copy; 2023 Ecommerce.</p>
            <div className="lang-select">
              <img src="/assets/Layout1/Image/flags/US@2x.png" alt="" style={{ width: '20px', verticalAlign: 'middle', marginRight: '5px' }} />
              <select defaultValue="English">
                <option value="English">English</option>
              </select>
              <i className="fa-solid fa-chevron-up" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export function Layout() {
  const location = useLocation();
  const isCart = location.pathname === '/cart';
  const isProduct = location.pathname === '/product';

  return (
    <>
      <Header />
      <Outlet />
      <Footer showNewsletter={!isCart} />
    </>
  );
}
