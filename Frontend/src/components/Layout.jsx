import React, { useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('q') || '');
  }, [location.search]);

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsSidebarOpen(false);
    setIsUserMenuOpen(false);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    const value = searchTerm.trim();
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    const qs = params.toString();
    navigate(`${location.pathname}${qs ? `?${qs}` : ''}`);
  };

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
              {user ? (
                <>
                  <span style={{ fontWeight: 600, color: 'var(--dark-color)', display: 'block' }}>Hi, {user.username}</span>
                  <span onClick={handleLogout} style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--red)', fontWeight: 500 }}>Sign out</span>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsSidebarOpen(false)}>Sign in</Link> | <Link to="/signup" onClick={() => setIsSidebarOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li><Link to="/" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-house"></i> Home</Link></li>
            <li><Link to="/listing" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-list"></i> Categories</Link></li>
            {user && <li><Link to="/my-products" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-box"></i> My Products</Link></li>}
            <li><Link to="/cart" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-cart-shopping"></i> My Cart {cartCount > 0 && `(${cartCount})`}</Link></li>
            <li><Link to="#" onClick={() => setIsSidebarOpen(false)}><i className="fa-regular fa-heart"></i> Favorites</Link></li>
            <li><Link to="/orders" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-box"></i> My orders</Link></li>
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
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select defaultValue="All category">
              <option value="All category">All category</option>
            </select>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="header-actions">
            <Link to="/cart" className="action-item" style={{ position: 'relative' }}>
              <i className="fa-solid fa-cart-shopping"></i>
              <span>My cart</span>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '5px',
                  backgroundColor: 'var(--orange)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="action-item"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                    {String(user.username || 'M').charAt(0).toUpperCase()}
                  </div>
                  <span>Me</span>
                </button>

                {isUserMenuOpen && (
                  <div style={{ position: 'absolute', top: '46px', right: 0, minWidth: '150px', background: 'var(--white)', border: '1px solid var(--gray-300)', borderRadius: '8px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', zIndex: 2000, overflow: 'hidden' }}>
                    <Link to="/my-products" onClick={() => setIsUserMenuOpen(false)} style={{ display: 'block', padding: '10px 12px', fontSize: '14px', color: 'var(--dark-color)' }}>
                      <i className="fa-regular fa-user" style={{ marginRight: '8px' }}></i>
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: '10px 12px', fontSize: '14px', color: 'var(--red)', cursor: 'pointer' }}
                    >
                      <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '8px' }}></i>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="action-item">
                <i className="fa-regular fa-user"></i>
                <span>Sign in</span>
              </Link>
            )}
            <Link to="#" className="action-item desktop-only">
              <i className="fa-regular fa-message"></i>
              <span>Message</span>
            </Link>
            <Link to="/orders" className="action-item desktop-only">
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
              {user && <li><Link to="/my-products">My Products</Link></li>}
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
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Register</Link></li>
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
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!isAuthPage && <Header />}
      <Outlet />
      {!isAuthPage && <Footer showNewsletter={!isCart} />}
    </>
  );
}
