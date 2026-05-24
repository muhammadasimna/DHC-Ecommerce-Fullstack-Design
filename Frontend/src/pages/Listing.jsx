import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Listing() {
  const [viewMode, setViewMode] = useState('grid');
  const { backendUrl } = useAuth();
  const { addToCart, saveProductDirectly, savedItems = [], removeFromCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [addedMessage, setAddedMessage] = useState('');

  const defaultProducts = [
    {
      id: 1,
      image: './public/assets/Image/tech/image 33.png',
      title: 'Regular Fit Resort Shirt - Cool Tech Style',
      price: 57.70,
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 2,
      image: './public/assets/Image/tech/image 23.png',
      title: 'Water boiler black for kitchen, 1200 Watt',
      price: 78.99,
      oldPrice: 90.00,
      rating: 8.5,
      stars: 4.5,
      orders: 340,
      desc: 'High quality water boiler with fast heating speed, sleek black design, safety auto-shutdown capability.'
    },
    {
      id: 3,
      image: './public/assets/Image/tech/image 32.png',
      title: 'GoPro HERO6 4K Action Camera - Black',
      price: 99.50,
      oldPrice: 120.00,
      rating: 9.3,
      stars: 4.8,
      orders: 154,
      desc: 'Capture stunning 4K video and 12MP photos in Single, Burst, and Time Lapse modes.'
    },
    {
      id: 4,
      image: './public/assets/Layout/alibaba/Image/cloth/Bitmap.png',
      title: 'T-shirts with multiple colors, for men',
      price: 10.30,
      oldPrice: 15.00,
      rating: 7.2,
      stars: 4,
      orders: 98,
      desc: 'Premium multi-color cotton T-shirts. Ideal for everyday use, highly breathable fabric.'
    },
    {
      id: 5,
      image: './public/assets/Layout/alibaba/Image/cloth/image 26.png',
      title: 'Solid Backpack blue jeans large size',
      price: 78.99,
      oldPrice: null,
      rating: 7.9,
      stars: 4,
      orders: 210,
      desc: 'Durable canvas backpack styled in classic denim look. Large volume fits up to 15.6 inch laptops.'
    },
    {
      id: 6,
      image: './public/assets/Image/tech/8.png',
      title: 'Smart watches silver color modern',
      price: 19.00,
      oldPrice: 25.00,
      rating: 8.0,
      stars: 4,
      orders: 520,
      desc: 'Modern smart watch featuring real-time health monitoring, step counter, bluetooth calls.'
    }
  ];

  const [products, setProducts] = useState(defaultProducts);

  useEffect(() => {
    document.body.classList.add('listing-page');

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (err) {
        console.warn('Backend API not responding, using static backup products.', err);
      }
    };

    fetchProducts();

    return () => {
      document.body.classList.remove('listing-page');
    };
  }, [backendUrl]);


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

  const query = new URLSearchParams(location.search).get('q')?.toLowerCase().trim() || '';
  const displayedProducts = query
    ? products.filter((product) =>
        [product.title, product.category, product.description || product.desc]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query))
      )
    : products;

  return (
    <div className="container listing-page-container">
      {/* Mobile Header */}
      <div className="mobile-listing-header mobile-only">
        <div className="mobile-header-top">
          <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
          <h3>Mobile accessory</h3>
          <div className="mobile-header-actions">
            <Link to="/cart"><i className="fa-solid fa-cart-shopping"></i></Link>
            <Link to="#"><i className="fa-regular fa-user"></i></Link>
          </div>
        </div>

        <div className="mobile-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" placeholder="Search" />
        </div>

        <div className="mobile-category-pills">
          <div className="pill active">Tablets</div>
          <div className="pill">Phones</div>
          <div className="pill">Ipads</div>
          <div className="pill">Ipod</div>
          <div className="pill">Jackets</div>
          <div className="pill">Tech</div>
        </div>
      </div>

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

      <div className="mobile-only">
        <div className="mobile-sort-filter-bar">
          <button className="mobile-bar-btn">
            Sort: Newest <i className="fa-solid fa-arrow-down-wide-short" style={{ marginLeft: '5px' }}></i>
          </button>
          <button className="mobile-bar-btn">
            Filter (3) <i className="fa-solid fa-filter" style={{ marginLeft: '5px' }}></i>
          </button>
          <div className="mobile-view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fa-solid fa-table-cells"></i>
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}>
              <i className="fa-solid fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="mobile-only">
        <div className="mobile-active-tags">
          <div className="active-tag-pill">Huawei <i className="fa-solid fa-xmark"></i></div>
          <div className="active-tag-pill">Apple <i className="fa-solid fa-xmark"></i></div>
          <div className="active-tag-pill">64GB <i className="fa-solid fa-xmark"></i></div>
        </div>
      </div>

      <div className="breadcrumbs desktop-only">
        <Link to="/">Home</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <a href="#">Clothings</a>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <a href="#">Men's wear</a>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <span>Summer clothing</span>
      </div>

      <div className="listing-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="filter-group">
            <div className="filter-header">
              <h4>Category</h4><i className="fa-solid fa-chevron-up"></i>
            </div>
            <div className="filter-content">
              <ul>
                <li><a href="#">Mobile accessory</a></li>
                <li><a href="#">Electronics</a></li>
                <li><a href="#">Smartphones</a></li>
                <li><a href="#">Modern tech</a></li>
              </ul>
              <a href="#" className="see-all">See all</a>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header">
              <h4>Brands</h4><i className="fa-solid fa-chevron-up"></i>
            </div>
            <div className="filter-content">
              <label className="checkbox-group"><input type="checkbox" defaultChecked /> <span>Samsung</span></label>
              <label className="checkbox-group"><input type="checkbox" defaultChecked /> <span>Apple</span></label>
              <label className="checkbox-group"><input type="checkbox" /> <span>Huawei</span></label>
              <label className="checkbox-group"><input type="checkbox" defaultChecked /> <span>Pocco</span></label>
              <label className="checkbox-group"><input type="checkbox" /> <span>Lenovo</span></label>
              <a href="#" className="see-all">See all</a>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header">
              <h4>Features</h4><i className="fa-solid fa-chevron-up"></i>
            </div>
            <div className="filter-content">
              <label className="checkbox-group"><input type="checkbox" defaultChecked /> <span>Metallic</span></label>
              <label className="checkbox-group"><input type="checkbox" /> <span>Plastic cover</span></label>
              <label className="checkbox-group"><input type="checkbox" /> <span>8GB Ram</span></label>
              <label className="checkbox-group"><input type="checkbox" /> <span>Super power</span></label>
              <label className="checkbox-group"><input type="checkbox" /> <span>Large Memory</span></label>
              <a href="#" className="see-all">See all</a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="listing-main">
          <div className="listing-top-bar">
            <div className="item-count"><span>{displayedProducts.length} items found</span></div>
            <div className="view-options">
              <label className="checkbox-group" style={{ marginBottom: 0 }}><input type="checkbox" /> <span>Verified only</span></label>
              <select style={{ width: '120px' }} defaultValue="Featured">
                <option value="Featured">Featured</option>
              </select>
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="fa-solid fa-table-cells"></i>
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="fa-solid fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="active-filters desktop-only">
            <div className="filter-tag">Samsung <i className="fa-solid fa-xmark"></i></div>
            <div className="filter-tag">Apple <i className="fa-solid fa-xmark"></i></div>
            <div className="filter-tag">Poco <i className="fa-solid fa-xmark"></i></div>
            <div className="filter-tag">Metallic <i className="fa-solid fa-xmark"></i></div>
            <span className="clear-filters" style={{ color: 'var(--primary-color)', cursor: 'pointer', alignSelf: 'center' }}>Clear all filter</span>
          </div>

          {/* Product List / Grid */}
          <div className={viewMode === 'grid' ? 'product-grid-container' : 'product-list-container'}>
            {displayedProducts.map(product => (
              <div key={product.id} className={viewMode === 'grid' ? 'product-grid-item' : 'product-list-item'}>
                <div className={viewMode === 'grid' ? 'product-grid-img' : 'product-list-img'}>
                  <img src={product.image} alt="" style={viewMode === 'grid' ? { width: '150px' } : {}} />
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid-item-info">
                    <div className="grid-info-row">
                      <div className="grid-price-box">
                        <div className="price-group">
                          <span className="price">{formatPrice(product.price)}</span>
                          {product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}
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
                ) : (
                  <>
                    <div className="product-list-info">
                      <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/product?id=${product.id}`); }}>
                        <h4>{product.title}</h4>
                      </a>
                      <div className="price-row">
                        <span className="price">{formatPrice(product.price)}</span>
                        {product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}
                      </div>
                      <div className="rating-row">
                        {renderStars(product.stars)}
                        <span style={{ color: 'var(--orange)', marginLeft: '5px' }}>{product.rating}</span>
                        <span className="dot-separator" style={{ margin: '0 10px' }}>&bull;</span>
                        <span className="order-count" style={{ color: 'var(--secondary-color)', fontSize: '14px' }}>{product.orders} orders</span>
                        <span className="dot-separator" style={{ margin: '0 10px' }}>&bull;</span>
                        <span className="shipping-status">Free Shipping</span>
                      </div>
                      <p className="product-list-desc">{product.description || product.desc}</p>
                      <a href="#" className="view-details-btn" onClick={(e) => { e.preventDefault(); navigate(`/product?id=${product.id}`); }}>View details</a>
                    </div>
                    <div 
                      className="heart-btn" 
                      onClick={(e) => handleSaveProduct(e, product.id)}
                      style={{ cursor: 'pointer', color: savedItems.some(item => item.productId === product.id) ? 'var(--red)' : 'var(--primary-color)' }}
                    >
                      <i className={savedItems.some(item => item.productId === product.id) ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination desktop-only">
            <div className="page-btn"><i className="fa-solid fa-chevron-left"></i></div>
            <div className="page-btn active">1</div>
            <div className="page-btn">2</div>
            <div className="page-btn"><i className="fa-solid fa-chevron-right"></i></div>
          </div>
        </main>
      </div>
    </div>
  );
}
