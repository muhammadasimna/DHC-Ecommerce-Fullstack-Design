import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Listing() {
  const [viewMode, setViewMode] = useState('grid');
  const [sortMode, setSortMode] = useState('newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { backendUrl, token, user } = useAuth();
  const { addToCart, saveProductDirectly, savedItems = [], removeFromCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [addedMessage, setAddedMessage] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(999999);
  const [tempMinPrice, setTempMinPrice] = useState(0);
  const [tempMaxPrice, setTempMaxPrice] = useState(999999);
  const defaultBrandOptions = ['Samsung', 'Apple', 'Huawei', 'Pocco', 'Lenovo'];
  const defaultFeatureOptions = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'];
  const defaultCategoryOptions = ['Mobile accessory', 'Electronics', 'Smartphones', 'Modern tech'];
  const [selectedBrands, setSelectedBrands] = useState(['Samsung', 'Apple', 'Pocco']);
  const [selectedFeatures, setSelectedFeatures] = useState(['Metallic']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('Any');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [showAllSections, setShowAllSections] = useState({
    category: false,
    brands: false,
    features: false,
    condition: false,
    ratings: false
  });
  const hasSyncedInitialFilters = useRef(false);
  const [openSections, setOpenSections] = useState({
    category: true,
    brands: true,
    features: true,
    price: true,
    condition: true,
    ratings: true
  });

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

  const normalizeProduct = (product) => ({
    ...product,
    title: product.title || product.name || 'Untitled product',
    description: product.description || product.desc || '',
    price: Number(product.price || 0),
    oldPrice: product.oldPrice == null ? null : Number(product.oldPrice),
    rating: Number(product.rating || 0),
    stars: Number(product.stars || 0),
    orders: Number(product.orders || 0)
  });

  const getOfferPercent = (product) => {
    const oldPrice = Number(product.oldPrice || 0);
    const price = Number(product.price || 0);
    if (oldPrice > price && price > 0) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }
    return 0;
  };

  const [products, setProducts] = useState(defaultProducts.map(normalizeProduct));

  useEffect(() => {
    document.body.classList.add('listing-page');

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProducts(data.map(normalizeProduct));
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
  }, [backendUrl, token]);


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

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q')?.toLowerCase().trim() || '';
  const categoryFromUrl = queryParams.get('category')?.trim() || '';
  const offersOnly = queryParams.get('offers') === '1';

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const visibleProducts = products.filter((product) => {
    const ownerId = Number(product.userId ?? product.UserId ?? 0);
    const currentUserId = Number(user?.id ?? 0);
    return !(currentUserId > 0 && ownerId === currentUserId);
  });

  const displayedProducts = query
    ? visibleProducts.filter((product) =>
        [product.title, product.category, product.description || product.desc]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query))
      )
    : visibleProducts;

  const uniqueSorted = (arr) =>
    [...new Set(arr.map((x) => String(x || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const categoriesFromProducts = uniqueSorted(visibleProducts.map((p) => p.category));
  const brandsFromProducts = uniqueSorted(
    visibleProducts.flatMap((p) => (Array.isArray(p.brands) ? p.brands : p.brand ? [p.brand] : []))
  );
  const featuresFromProducts = uniqueSorted(
    visibleProducts.flatMap((p) => (Array.isArray(p.features) ? p.features : p.feature ? [p.feature] : []))
  );

  const categoryOptions = uniqueSorted([...defaultCategoryOptions, ...categoriesFromProducts]);
  const brandOptions = uniqueSorted([...defaultBrandOptions, ...brandsFromProducts]);
  const featureOptions = uniqueSorted([...defaultFeatureOptions, ...featuresFromProducts]);

  const visibleCategories = showAllSections.category ? categoryOptions : categoryOptions.slice(0, 4);
  const visibleBrands = showAllSections.brands ? brandOptions : brandOptions.slice(0, 5);
  const visibleFeatures = showAllSections.features ? featureOptions : featureOptions.slice(0, 5);
  const conditionOptions = ['Any', 'Refurbished', 'Brand new', 'Old items'];
  const visibleConditions = showAllSections.condition ? conditionOptions : conditionOptions.slice(0, 4);
  const ratingOptions = [5, 4, 3, 2];
  const visibleRatings = showAllSections.ratings ? ratingOptions : ratingOptions.slice(0, 4);

  useEffect(() => {
    if (hasSyncedInitialFilters.current) return;
    if (!visibleProducts.length) return;

    const containsTag = (product, tag) => {
      const haystack = `${product.title || ''} ${product.category || ''} ${product.description || product.desc || ''} ${product.brand || ''} ${(product.features || []).join(' ')}`.toLowerCase();
      if (tag === 'Pocco') return haystack.includes('pocco') || haystack.includes('poco');
      return haystack.includes(String(tag).toLowerCase());
    };

    const nextBrands = selectedBrands.filter((brand) =>
      visibleProducts.some((product) => containsTag(product, brand))
    );
    const nextFeatures = selectedFeatures.filter((feature) =>
      visibleProducts.some((product) => containsTag(product, feature))
    );

    if (nextBrands.length !== selectedBrands.length) {
      setSelectedBrands(nextBrands);
    }
    if (nextFeatures.length !== selectedFeatures.length) {
      setSelectedFeatures(nextFeatures);
    }

    hasSyncedInitialFilters.current = true;
  }, [visibleProducts, selectedBrands, selectedFeatures]);

  const offerFilteredProducts = offersOnly
    ? displayedProducts.filter((product) => Number(product.oldPrice || 0) > Number(product.price || 0))
    : displayedProducts;

  const priceFilteredProducts = offerFilteredProducts.filter((product) => {
    const p = Number(product.price || 0);
    return p >= appliedMinPrice && p <= appliedMaxPrice;
  });

  const finalFilteredProducts = priceFilteredProducts.filter((product) => {
    const haystack = `${product.title || ''} ${product.category || ''} ${product.description || product.desc || ''}`.toLowerCase();
    const productCategory = String(product.category || '').toLowerCase();

    const matchesCategory =
      !selectedCategory ||
      productCategory.includes(selectedCategory.toLowerCase());

    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.some((brand) => {
        if (brand === 'Pocco') return haystack.includes('pocco') || haystack.includes('poco');
        return haystack.includes(brand.toLowerCase());
      });

    const matchesFeature =
      selectedFeatures.length === 0 ||
      selectedFeatures.some((feature) => haystack.includes(feature.toLowerCase()));

    const matchesCondition =
      selectedCondition === 'Any' ||
      (selectedCondition === 'Brand new' && Number(product.oldPrice || 0) === 0) ||
      (selectedCondition === 'Refurbished' && Number(product.oldPrice || 0) > 0) ||
      (selectedCondition === 'Old items' && Number(product.rating || 0) < 7);

    const matchesRatings =
      selectedRatings.length === 0 ||
      selectedRatings.some((minStars) => Number(product.stars || 0) >= minStars);

    return matchesCategory && matchesBrand && matchesFeature && matchesCondition && matchesRatings;
  });

  const sortedFilteredProducts = [...finalFilteredProducts].sort((a, b) => {
    if (sortMode === 'price-low') return Number(a.price || 0) - Number(b.price || 0);
    if (sortMode === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
    if (sortMode === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
    return Number(b.id || 0) - Number(a.id || 0);
  });
  const productsPerPage = viewMode === 'grid' ? 9 : 6;
  const totalPages = Math.max(1, Math.ceil(sortedFilteredProducts.length / productsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = sortedFilteredProducts.slice(
    (safeCurrentPage - 1) * productsPerPage,
    safeCurrentPage * productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    query,
    categoryFromUrl,
    offersOnly,
    appliedMinPrice,
    appliedMaxPrice,
    selectedCategory,
    selectedBrands,
    selectedFeatures,
    selectedCondition,
    selectedRatings,
    sortMode,
    viewMode
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const sortLabels = {
    newest: 'Newest',
    'price-low': 'Price low',
    'price-high': 'Price high',
    rating: 'Rating'
  };

  const cycleSortMode = () => {
    const order = ['newest', 'price-low', 'price-high', 'rating'];
    const currentIndex = order.indexOf(sortMode);
    setSortMode(order[(currentIndex + 1) % order.length]);
  };

  const sliderMax = Math.max(
    1000,
    ...visibleProducts.map((p) => Number(p.price || 0)),
    tempMaxPrice,
    appliedMaxPrice
  );

  const leftPercent = (tempMinPrice / sliderMax) * 100;
  const rightPercent = (tempMaxPrice / sliderMax) * 100;

  const handleMinRangeChange = (value) => {
    const v = Number(value || 0);
    setTempMinPrice(Math.min(v, tempMaxPrice));
  };

  const handleMaxRangeChange = (value) => {
    const v = Number(value || 0);
    setTempMaxPrice(Math.max(v, tempMinPrice));
  };

  const applyPriceFilter = () => {
    const min = Math.max(0, Math.min(tempMinPrice, tempMaxPrice));
    const max = Math.max(min, tempMaxPrice);
    setTempMinPrice(min);
    setTempMaxPrice(max);
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
  };

  const toggleSelection = (value, setState) => {
    setState((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  const updateCategoryFilter = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(location.search);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    const qs = params.toString();
    navigate(`${location.pathname}${qs ? `?${qs}` : ''}`);
  };

  const removeSingleFilter = (value) => {
    setSelectedBrands((prev) => prev.filter((x) => x !== value));
    setSelectedFeatures((prev) => prev.filter((x) => x !== value));
    setSelectedRatings((prev) => prev.filter((x) => x !== value));
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(location.search);
    params.delete('category');
    params.delete('offers');
    const qs = params.toString();
    navigate(`${location.pathname}${qs ? `?${qs}` : ''}`);
    setSelectedCategory('');
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setSelectedCondition('Any');
    setSelectedRatings([]);
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleSeeAll = (key) => {
    setShowAllSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeFilterTags = [
    ...(offersOnly ? [{ type: 'offers', label: 'Hot offers', remove: () => {
      const params = new URLSearchParams(location.search);
      params.delete('offers');
      const qs = params.toString();
      navigate(`${location.pathname}${qs ? `?${qs}` : ''}`);
    } }] : []),
    ...(selectedCategory ? [{ type: 'category', label: selectedCategory, remove: () => updateCategoryFilter('') }] : []),
    ...selectedBrands.map((brand) => ({ type: 'brand', label: brand, remove: () => removeSingleFilter(brand) })),
    ...selectedFeatures.map((feature) => ({ type: 'feature', label: feature, remove: () => removeSingleFilter(feature) })),
    ...(selectedCondition !== 'Any' ? [{ type: 'condition', label: selectedCondition, remove: () => setSelectedCondition('Any') }] : []),
    ...selectedRatings.map((star) => ({ type: 'rating', label: `${star} star`, remove: () => removeSingleFilter(star) }))
  ];

  const mobileCategoryPills = uniqueSorted([
    'All',
    ...categoryOptions,
    'Phones',
    'Tablets',
    'Tech'
  ]).filter((cat) => cat === 'All' || visibleProducts.some((product) => {
    const haystack = `${product.title || ''} ${product.category || ''} ${product.description || product.desc || ''}`.toLowerCase();
    return haystack.includes(cat.toLowerCase());
  })).slice(0, 8);

  return (
    <div className="container listing-page-container">
      {/* Mobile Header */}
      <div className="mobile-listing-header mobile-only">
        <div className="mobile-header-top">
          <Link to="/"><i className="fa-solid fa-arrow-left"></i></Link>
          <h3>Mobile accessory</h3>
          <div className="mobile-header-actions">
            <Link to="/cart"><i className="fa-solid fa-cart-shopping"></i></Link>
            <Link to={user ? '/profile' : '/login'} aria-label={user ? 'Open profile' : 'Sign in'}>
              <i className="fa-regular fa-user"></i>
            </Link>
          </div>
        </div>

        <div className="mobile-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search"
            value={new URLSearchParams(location.search).get('q') || ''}
            onChange={(e) => {
              const params = new URLSearchParams(location.search);
              const value = e.target.value;
              if (value.trim()) {
                params.set('q', value);
              } else {
                params.delete('q');
              }
              const qs = params.toString();
              navigate(`${location.pathname}${qs ? `?${qs}` : ''}`);
            }}
          />
        </div>

        <div className="mobile-category-pills">
          {mobileCategoryPills.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill ${(cat === 'All' && !selectedCategory) || selectedCategory === cat ? 'active' : ''}`}
              onClick={() => updateCategoryFilter(cat === 'All' ? '' : cat)}
            >
              {cat}
            </button>
          ))}
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
          <button type="button" className="mobile-bar-btn" onClick={cycleSortMode}>
            Sort: {sortLabels[sortMode]} <i className="fa-solid fa-arrow-down-wide-short" style={{ marginLeft: '5px' }}></i>
          </button>
          <button type="button" className="mobile-bar-btn" onClick={() => setIsMobileFiltersOpen(true)}>
            Filter ({activeFilterTags.length}) <i className="fa-solid fa-filter" style={{ marginLeft: '5px' }}></i>
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
          {activeFilterTags.map((tag) => (
            <button key={`${tag.type}-${tag.label}`} type="button" className="active-tag-pill" onClick={tag.remove}>
              {tag.label} <i className="fa-solid fa-xmark"></i>
            </button>
          ))}
          {activeFilterTags.length > 0 && (
            <button type="button" className="active-tag-pill clear-mobile-filter" onClick={clearAllFilters}>
              Clear all
            </button>
          )}
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
        {isMobileFiltersOpen && <div className="mobile-filter-backdrop mobile-only" onClick={() => setIsMobileFiltersOpen(false)}></div>}
        <aside className={`sidebar ${isMobileFiltersOpen ? 'mobile-filter-open' : ''}`}>
          <div className="mobile-filter-head mobile-only">
            <h3>Filters</h3>
            <button type="button" onClick={() => setIsMobileFiltersOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="filter-group">
            <div className="filter-header" onClick={() => toggleSection('category')}>
              <h4>Category</h4><i className={`fa-solid ${openSections.category ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
            <div className={`filter-content ${openSections.category ? '' : 'collapsed'}`}>
              <ul>
                {visibleCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => updateCategoryFilter(cat)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        padding: 0,
                        color: selectedCategory === cat ? 'var(--primary-color)' : 'var(--dark-color)',
                        fontWeight: selectedCategory === cat ? 600 : 400,
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="see-all"
                onClick={() => toggleSeeAll('category')}
                style={{ border: 'none', background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer' }}
              >
                {showAllSections.category ? 'See less' : 'See all'}
              </button>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggleSection('brands')}>
              <h4>Brands</h4><i className={`fa-solid ${openSections.brands ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
            <div className={`filter-content ${openSections.brands ? '' : 'collapsed'}`}>
              {visibleBrands.map((brand) => (
                <label key={brand} className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleSelection(brand, setSelectedBrands)}
                  /> <span>{brand}</span>
                </label>
              ))}
              {brandOptions.length > 5 && (
                <button
                  type="button"
                  className="see-all"
                  onClick={() => toggleSeeAll('brands')}
                  style={{ border: 'none', background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                >
                  {showAllSections.brands ? 'See less' : 'See all'}
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggleSection('features')}>
              <h4>Features</h4><i className={`fa-solid ${openSections.features ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
            <div className={`filter-content ${openSections.features ? '' : 'collapsed'}`}>
              {visibleFeatures.map((feature) => (
                <label key={feature} className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => toggleSelection(feature, setSelectedFeatures)}
                  /> <span>{feature}</span>
                </label>
              ))}
              {featureOptions.length > 5 && (
                <button
                  type="button"
                  className="see-all"
                  onClick={() => toggleSeeAll('features')}
                  style={{ border: 'none', background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                >
                  {showAllSections.features ? 'See less' : 'See all'}
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggleSection('price')}>
              <h4>Price range</h4><i className={`fa-solid ${openSections.price ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
            <div className={`filter-content price-range-section ${openSections.price ? '' : 'collapsed'}`}>
              <div className="price-range-visual" aria-hidden="true">
                <div className="range-track"></div>
                <div className="range-fill" style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}></div>
                <span className="range-thumb thumb-left" style={{ left: `calc(${leftPercent}% - 7px)` }}></span>
                <span className="range-thumb thumb-right" style={{ left: `calc(${rightPercent}% - 7px)` }}></span>
                <input
                  className="range-input range-input-min"
                  type="range"
                  min="0"
                  max={sliderMax}
                  value={tempMinPrice}
                  onChange={(e) => handleMinRangeChange(e.target.value)}
                />
                <input
                  className="range-input range-input-max"
                  type="range"
                  min="0"
                  max={sliderMax}
                  value={tempMaxPrice}
                  onChange={(e) => handleMaxRangeChange(e.target.value)}
                />
              </div>
              <div className="price-range-labels">
                <span>Min</span>
                <span>Max</span>
              </div>
              <div className="price-inputs" style={{ marginBottom: '10px' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={tempMinPrice}
                  min="0"
                  max={tempMaxPrice}
                  onChange={(e) => handleMinRangeChange(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={tempMaxPrice}
                  min={tempMinPrice}
                  max={sliderMax}
                  onChange={(e) => handleMaxRangeChange(e.target.value)}
                />
              </div>
              <button className="btn btn-white price-apply-btn" type="button" onClick={applyPriceFilter}>Apply</button>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggleSection('condition')}>
              <h4>Condition</h4><i className={`fa-solid ${openSections.condition ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
            <div className={`filter-content ${openSections.condition ? '' : 'collapsed'}`}>
              {visibleConditions.map((cond) => (
                <label key={cond} className="checkbox-group">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === cond}
                    onChange={() => setSelectedCondition(cond)}
                  /> <span>{cond}</span>
                </label>
              ))}
              {conditionOptions.length > 4 && (
                <button
                  type="button"
                  className="see-all"
                  onClick={() => toggleSeeAll('condition')}
                  style={{ border: 'none', background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                >
                  {showAllSections.condition ? 'See less' : 'See all'}
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-header" onClick={() => toggleSection('ratings')}>
              <h4>Ratings</h4><i className={`fa-solid ${openSections.ratings ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </div>
            <div className={`filter-content ${openSections.ratings ? '' : 'collapsed'}`}>
              {visibleRatings.map((star) => (
                <label key={star} className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(star)}
                    onChange={() => toggleSelection(star, setSelectedRatings)}
                  />
                  <span className="rating-filter">
                    {[...Array(5)].map((_, i) => (
                      <i key={`${star}-${i}`} className={i < star ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
                    ))}
                  </span>
                </label>
              ))}
              {ratingOptions.length > 4 && (
                <button
                  type="button"
                  className="see-all"
                  onClick={() => toggleSeeAll('ratings')}
                  style={{ border: 'none', background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                >
                  {showAllSections.ratings ? 'See less' : 'See all'}
                </button>
              )}
            </div>
          </div>
          <div className="mobile-filter-actions mobile-only">
            <button type="button" className="btn btn-white" onClick={clearAllFilters}>Clear all</button>
            <button type="button" className="btn btn-primary" onClick={() => setIsMobileFiltersOpen(false)}>Apply filters</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="listing-main">
          <div className="listing-top-bar">
            <div className="item-count"><span>{sortedFilteredProducts.length} items found</span></div>
            <div className="view-options">
              <label className="checkbox-group" style={{ marginBottom: 0 }}><input type="checkbox" /> <span>Verified only</span></label>
              <select style={{ width: '120px' }} value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                <option value="newest">Featured</option>
                <option value="price-low">Price low</option>
                <option value="price-high">Price high</option>
                <option value="rating">Rating</option>
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
            {[...selectedBrands, ...selectedFeatures].map((tag) => (
              <div key={tag} className="filter-tag" onClick={() => removeSingleFilter(tag)} style={{ cursor: 'pointer' }}>
                {tag} <i className="fa-solid fa-xmark"></i>
              </div>
            ))}
            {selectedCondition !== 'Any' && (
              <div className="filter-tag" onClick={() => setSelectedCondition('Any')} style={{ cursor: 'pointer' }}>
                {selectedCondition} <i className="fa-solid fa-xmark"></i>
              </div>
            )}
            {selectedCategory && (
              <div className="filter-tag" onClick={() => updateCategoryFilter('')} style={{ cursor: 'pointer' }}>
                {selectedCategory} <i className="fa-solid fa-xmark"></i>
              </div>
            )}
            {selectedRatings.map((star) => (
              <div key={`rating-${star}`} className="filter-tag" onClick={() => removeSingleFilter(star)} style={{ cursor: 'pointer' }}>
                {star} star <i className="fa-solid fa-xmark"></i>
              </div>
            ))}
            {[...selectedBrands, ...selectedFeatures].length > 0 || selectedCondition !== 'Any' || selectedRatings.length > 0 || !!selectedCategory ? (
              <span className="clear-filters" onClick={clearAllFilters} style={{ color: 'var(--primary-color)', cursor: 'pointer', alignSelf: 'center' }}>
                Clear all filter
              </span>
            ) : null}
          </div>

          {/* Product List / Grid */}
          <div className={viewMode === 'grid' ? 'product-grid-container' : 'product-list-container'}>
            {paginatedProducts.map(product => {
              const offerPercent = getOfferPercent(product);
              return (
              <div key={product.id} className={viewMode === 'grid' ? 'product-grid-item' : 'product-list-item'}>
                <div className={viewMode === 'grid' ? 'product-grid-img' : 'product-list-img'}>
                  {viewMode === 'grid' ? (
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/product?id=${product.id}`); }}>
                      <img src={product.image} alt={product.title} style={{ cursor: 'pointer' }} />
                    </a>
                  ) : (
                    <img src={product.image} alt={product.title} />
                  )}
                </div>

                {viewMode === 'grid' ? (
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
                ) : (
                  <>
                    <div className="product-list-info">
                      <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/product?id=${product.id}`); }}>
                        <h4>{product.title}</h4>
                      </a>
                      <div className="price-row">
                        <span className="price">{formatPrice(product.price)}</span>
                        {product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}
                        {offerPercent > 0 && <span className="offer-badge">-{offerPercent}% OFF</span>}
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
            )})}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="page-btn"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`page-btn ${safeCurrentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="page-btn"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
