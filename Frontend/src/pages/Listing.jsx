import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Listing() {
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    document.body.classList.add('listing-page');
    return () => {
      document.body.classList.remove('listing-page');
    };
  }, []);

  const products = [
    {
      id: 1,
      image: './public/assets/Image/tech/image 33.png',
      title: 'Regular Fit Resort Shirt',
      price: '$57.70',
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 2,
      image: './public/assets/Image/tech/image 23.png',
      title: 'Regular Fit Resort Shirt',
      price: '$57.70',
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 3,
      image: './public/assets/Image/tech/image 32.png',
      title: 'Regular Fit Resort Shirt',
      price: '$57.70',
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 4,
      image: './public/assets/Image/tech/image 32.png',
      title: 'Regular Fit Resort Shirt',
      price: '$57.70',
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 5,
      image: './public/assets/Image/tech/6.png',
      title: 'Regular Fit Resort Shirt',
      price: '$57.70',
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 6,
      image: './public/assets/Image/tech/image 23.png',
      title: 'Regular Fit Resort Shirt',
      price: '$57.70',
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 7,
      image: './public/assets/Image/tech/image 34.png',
      title: 'Regular Fit Resort Shirt',
      price: '$57.70',
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 8,
      image: './public/assets/Image/tech/8.png',
      title: 'Regular Fit Resort Shirt',
      price: '$57.70',
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 9,
      image: './public/assets/Image/tech/image 33.png',
      title: 'Regular Fit Resort Shirt',
      price: '$57.70',
      oldPrice: null,
      rating: 7.5,
      stars: 4,
      orders: 154,
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  ];

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

        {/* <div className="mobile-sort-filter-bar">
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
              onClick={() => setViewMode('list')}
            >
              <i className="fa-solid fa-list"></i>
            </button>
          </div>
        </div> */}

        {/* <div className="mobile-active-tags">
          <div className="active-tag-pill">Huawei <i className="fa-solid fa-xmark"></i></div>
          <div className="active-tag-pill">Apple <i className="fa-solid fa-xmark"></i></div>
          <div className="active-tag-pill">64GB <i className="fa-solid fa-xmark"></i></div>
        </div> */}
      </div>

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
        <a href="/">Home</a>
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

          <div className="filter-group">
            <div className="filter-header">
              <h4>Price range</h4>
              <i className={`fa-solid fa-chevron-${viewMode === 'list' ? 'up' : 'down'}`}></i>
            </div>
            {viewMode === 'list' && (
              <div className="filter-content">
                <input type="range" style={{ width: '100%', marginBottom: '10px' }} />
                <div className="price-inputs">
                  <div><label style={{ fontSize: '12px' }}>Min</label><input type="number" placeholder="0" /></div>
                  <div><label style={{ fontSize: '12px' }}>Max</label><input type="number" placeholder="999999" /></div>
                </div>
                <button className="btn btn-white" style={{ width: '100%', marginTop: '15px', color: 'var(--primary-color)' }}>Apply</button>
              </div>
            )}
          </div>

          <div className="filter-group">
            <div className="filter-header">
              <h4>Condition</h4>
              <i className={`fa-solid fa-chevron-${viewMode === 'list' ? 'up' : 'down'}`}></i>
            </div>
            {viewMode === 'list' && (
              <div className="filter-content">
                <label className="checkbox-group"><input type="radio" name="condition" defaultChecked /> <span>Any</span></label>
                <label className="checkbox-group"><input type="radio" name="condition" /> <span>Refurbished</span></label>
                <label className="checkbox-group"><input type="radio" name="condition" /> <span>Brand new</span></label>
                <label className="checkbox-group"><input type="radio" name="condition" /> <span>Old items</span></label>
              </div>
            )}
          </div>

          <div className="filter-group">
            <div className="filter-header">
              <h4>Ratings</h4>
              <i className={`fa-solid fa-chevron-${viewMode === 'list' ? 'up' : 'down'}`}></i>
            </div>
            {viewMode === 'list' && (
              <div className="filter-content">
                <label className="checkbox-group">
                  <input type="checkbox" defaultChecked />
                  <div className="rating-filter">
                    {renderStars(5)}
                  </div>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" defaultChecked />
                  <div className="rating-filter">
                    {renderStars(4)}
                  </div>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" />
                  <div className="rating-filter">
                    {renderStars(3)}
                  </div>
                </label>
                <label className="checkbox-group">
                  <input type="checkbox" />
                  <div className="rating-filter">
                    {renderStars(2)}
                  </div>
                </label>
              </div>
            )}
          </div>

          {viewMode === 'grid' && (
            <div className="filter-group">
              <div className="filter-header">
                <h4>Manufacturer</h4><i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="listing-main">
          <div className="listing-top-bar">
            <div className="item-count"><span>12,911 items in <strong>Mobile accessory</strong></span></div>
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

          {viewMode === 'grid' && (
            <div className="active-filters desktop-only">
              <div className="filter-tag">Samsung <i className="fa-solid fa-xmark"></i></div>
              <div className="filter-tag">Apple <i className="fa-solid fa-xmark"></i></div>
              <div className="filter-tag">Poco <i className="fa-solid fa-xmark"></i></div>
              <div className="filter-tag">Metallic <i className="fa-solid fa-xmark"></i></div>
              <div className="filter-tag">4 star <i className="fa-solid fa-xmark"></i></div>
              <div className="filter-tag">3 star <i className="fa-solid fa-xmark"></i></div>
              <span className="clear-filters" style={{ color: 'var(--primary-color)', cursor: 'pointer', alignSelf: 'center' }}>Clear all filter</span>
            </div>
          )}

          {/* Product List / Grid */}
          <div className={viewMode === 'grid' ? 'product-grid-container' : 'product-list-container'}>
            {products.map(product => (
              <div key={product.id} className={viewMode === 'grid' ? 'product-grid-item' : 'product-list-item'}>
                <div className={viewMode === 'grid' ? 'product-grid-img' : 'product-list-img'}>
                  <img src={product.image} alt="" style={viewMode === 'grid' ? { width: '150px' } : {}} />
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid-item-info">
                    <div className="grid-info-row">
                      <div className="grid-price-box">
                        <div className="price-group">
                          <span className="price">{product.price}</span>
                          {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
                        </div>
                        <div className="grid-rating-row">
                          {renderStars(product.stars)}
                          <span className="rating-num">{product.rating}</span>
                        </div>
                      </div>
                      <div className="heart-btn" style={{ width: '35px', height: '35px', color: 'var(--primary-color)', border: '1px solid var(--gray-300)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <i className="fa-regular fa-heart"></i>
                      </div>
                    </div>
                    <p className="title">{product.title}</p>
                  </div>
                ) : (
                  <>
                    <div className="product-list-info">
                      <a href="#">
                        <h4>{product.title}</h4>
                      </a>
                      <div className="price-row">
                        <span className="price">{product.price}</span>
                        {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
                      </div>
                      <div className="rating-row">
                        {renderStars(product.stars)}
                        <span style={{ color: 'var(--orange)', marginLeft: '5px' }}>{product.rating}</span>
                        <span className="dot-separator" style={{ margin: '0 10px' }}>&bull;</span>
                        <span className="order-count" style={{ color: 'var(--secondary-color)', fontSize: '14px' }}>{product.orders} orders</span>
                        <span className="dot-separator" style={{ margin: '0 10px' }}>&bull;</span>
                        <span className="shipping-status">Free Shipping</span>
                      </div>
                      <p className="product-list-desc">{product.desc}</p>
                      <a href="#" className="view-details-btn">View details</a>
                    </div>
                    <div className="heart-btn"><i className="fa-regular fa-heart"></i></div>
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
            <div className="page-btn">3</div>
            <div className="page-btn"><i className="fa-solid fa-chevron-right"></i></div>
          </div>

          {/* Mobile-only "You may also like" Section */}
          <div className="mobile-recommendations mobile-only">
            <h3 className="section-title">You may also like</h3>
            <div className="recommendations-scroll">
              <div className="recommendation-card">
                <div className="rec-img"><img src="./public/assets/Layout/alibaba/Image/cloth/image 26.png" alt="" /></div>
                <div className="rec-info">
                  <span className="price">$10.30</span>
                  <p className="title">Solid Backpack blue jeans large size</p>
                </div>
              </div>
              <div className="recommendation-card">
                <div className="rec-img"><img src="./public/assets/Image/tech/image 34.png" alt="" /></div>
                <div className="rec-info">
                  <span className="price">$10.30</span>
                  <p className="title">T-shirts with multiple colors, for men</p>
                </div>
              </div>
              <div className="recommendation-card">
                <div className="rec-img"><img src="./public/assets/Layout/alibaba/Image/cloth/Bitmap.png" alt="" /></div>
                <div className="rec-info">
                  <span className="price">$10.30</span>
                  <p className="title">T-shirts with multiple colors for men</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
