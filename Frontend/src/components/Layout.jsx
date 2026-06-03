import React, { useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('All category');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [navCategories, setNavCategories] = useState([]);
  const { user, logout, backendUrl } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('q') || '');
    setSearchCategory(params.get('category') || 'All category');
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

  React.useEffect(() => {
    const fetchNavCategories = async () => {
      try {
        const res = await fetch(`${backendUrl}/products`);
        if (!res.ok) return;
        const products = await res.json();
        if (!Array.isArray(products)) return;
        const categories = [...new Set(
          products
            .map((product) => String(product.category || '').trim())
            .filter(Boolean)
        )].sort((a, b) => a.localeCompare(b));
        setNavCategories(categories);
      } catch {
        setNavCategories([]);
      }
    };

    fetchNavCategories();
  }, [backendUrl]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsSidebarOpen(false);
    setIsUserMenuOpen(false);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const navCategoryItems = navCategories.slice(0, 8);

  const applySearchToCurrentPage = (value, options = {}) => {
    const params = new URLSearchParams(location.search);
    if (value.trim()) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    if (searchCategory && searchCategory !== 'All category') {
      params.set('category', searchCategory);
    } else {
      params.delete('category');
    }
    const qs = params.toString();
    navigate(`${location.pathname}${qs ? `?${qs}` : ''}`, options);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applySearchToCurrentPage(searchTerm.trim());
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (window.matchMedia('(max-width: 768px)').matches) {
      applySearchToCurrentPage(value, { replace: true });
    }
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
            <li><Link to="/favorites" onClick={() => setIsSidebarOpen(false)}><i className="fa-regular fa-heart"></i> Favorites</Link></li>
            <li><Link to="/orders" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-box"></i> My orders</Link></li>
          </ul>
          <hr className="sidebar-divider" />
          <ul className="sidebar-menu">
            <li>
              <button type="button" className="sidebar-link-button" onClick={() => setIsLanguageOpen((prev) => !prev)}>
                <i className="fa-solid fa-globe"></i> English | USD
                <i className={`fa-solid ${isLanguageOpen ? 'fa-chevron-up' : 'fa-chevron-down'} sidebar-link-chevron`}></i>
              </button>
              {isLanguageOpen && (
                <div className="sidebar-language-panel">
                  <button type="button">English</button>
                  <button type="button">USD</button>
                </div>
              )}
            </li>
            <li><Link to="/?contact=1" onClick={() => setIsSidebarOpen(false)}><i className="fa-solid fa-headset"></i> Contact us</Link></li>
            <li><Link to="/info/about" onClick={() => setIsSidebarOpen(false)}><i className="fa-regular fa-building"></i> About</Link></li>
          </ul>
          <hr className="sidebar-divider" />
          <ul className="sidebar-footer-menu">
            <li><Link to="/info/agreement" onClick={() => setIsSidebarOpen(false)}>User agreement</Link></li>
            <li><Link to="/info/partnership" onClick={() => setIsSidebarOpen(false)}>Partnership</Link></li>
            <li><Link to="/info/privacy" onClick={() => setIsSidebarOpen(false)}>Privacy policy</Link></li>
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
              onChange={handleSearchInputChange}
            />
            <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
              <option value="All category">All category</option>
              <option value="Mobile accessory">Mobile accessory</option>
              <option value="Electronics">Electronics</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Modern tech">Modern tech</option>
              <option value="Home and outdoor">Home and outdoor</option>
              <option value="Clothes and wear">Clothes and wear</option>
            </select>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="header-actions">
            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="action-item action-profile"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                  title={String(user.username).trim()}
                >
                  <i className="fa-solid fa-user"></i>
                  <span>{String(user.username).trim().split(/\s+/)[0]}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="profile-menu">
                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="profile-menu-item">
                      <i className="fa-solid fa-user"></i>
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="profile-menu-item danger"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="action-item action-profile">
                  <i className="fa-solid fa-user"></i>
                  <span>Sign in</span>
              </Link>
            )}
            <Link to="#" className="action-item action-message desktop-only">
              <i className="fa-solid fa-message"></i>
              <span>Message</span>
            </Link>
            <Link to="/orders" className="action-item action-orders desktop-only">
              <i className="fa-solid fa-heart"></i>
              <span>Orders</span>
            </Link>
            <Link to="/cart" className="action-item action-cart" style={{ position: 'relative' }}>
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
          </div>
        </div>
      </header>

      <nav className="nav-bottom">
        <div className="container">
          <div className="nav-left">
            <div className="nav-item nav-dropdown">
              <Link to="/listing" className="category-toggle">
                <i className="fa-solid fa-bars"></i>
                <span>All category</span>
              </Link>
              <div className="nav-menu nav-category-menu">
                {navCategoryItems.length > 0 ? (
                  navCategoryItems.map((category) => (
                    <Link key={category} to={`/listing?category=${encodeURIComponent(category)}`}>
                      {category}
                    </Link>
                  ))
                ) : (
                  <Link to="/my-products">Add products to create categories</Link>
                )}
                <Link to="/listing" className="nav-menu-strong">View all products</Link>
              </div>
            </div>
            <ul className="nav-links">
              <li><Link to="/listing?offers=1">Hot offers</Link></li>
              {user && <li><Link to="/my-products">My Products</Link></li>}
              <li><Link to="/listing?q=gift">Gift boxes</Link></li>
              <li><Link to="/listing?q=project">Projects</Link></li>
              <li className="nav-item nav-dropdown">
                <Link to="/listing">Menu item</Link>
                <div className="nav-menu">
                  {navCategoryItems.length > 0 ? (
                    navCategoryItems.slice(0, 6).map((category) => (
                      <Link key={category} to={`/listing?category=${encodeURIComponent(category)}`}>
                        {category}
                      </Link>
                    ))
                  ) : (
                    <Link to="/my-products">No categories yet</Link>
                  )}
                  <Link to="/listing?offers=1" className="nav-menu-strong">Hot offers</Link>
                </div>
              </li>
              <li className="nav-item nav-dropdown">
                <Link to={user ? '/profile' : '/login'}>Help <i className="fa-solid fa-chevron-down"></i></Link>
                <div className="nav-menu nav-help-menu">
                  <Link to={user ? '/profile' : '/login'}><i className="fa-solid fa-user"></i> Account center</Link>
                  <Link to="/orders"><i className="fa-solid fa-box"></i> My orders</Link>
                  <Link to="/cart"><i className="fa-solid fa-cart-shopping"></i> Cart support</Link>
                  <Link to="/my-products"><i className="fa-solid fa-store"></i> Seller tools</Link>
                </div>
              </li>
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
