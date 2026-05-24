import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyProducts() {
  const { backendUrl, token } = useAuth();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('list');
  const [addedMessage, setAddedMessage] = useState('');
  const [myProducts, setMyProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    imageUrls: '',
    price: '0',
    oldPrice: '',
    rating: '0',
    stars: '0',
    orders: '0',
    category: '',
    description: ''
  });

  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!token) {
        setMyProducts([]);
        return;
      }
      try {
        const res = await fetch(`${backendUrl}/products/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setMyProducts(data);
      } catch {
        setMyProducts([]);
      }
    };

    fetchMyProducts();
  }, [backendUrl, token]);

  const refreshMyProducts = async () => {
    if (!token) return;
    const res = await fetch(`${backendUrl}/products/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) setMyProducts(data);
  };

  const resetForm = () => {
    setEditingProductId(null);
    setIsFormOpen(false);
    setProductForm({
      title: '',
      imageUrls: '',
      price: '0',
      oldPrice: '',
      rating: '0',
      stars: '0',
      orders: '0',
      category: '',
      description: ''
    });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!token) {
      setAddedMessage('Please log in first!');
      return;
    }

    const parsedImages = productForm.imageUrls
      .split('\n')
      .map((img) => img.trim())
      .filter(Boolean);

    const payload = {
      title: productForm.title,
      image: parsedImages[0] || '/assets/Image/tech/image 29.png',
      additionalImages: parsedImages,
      price: Number(productForm.price || 0),
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      rating: Number(productForm.rating || 0),
      stars: Number(productForm.stars || 0),
      orders: Number(productForm.orders || 0),
      category: productForm.category,
      description: productForm.description
    };

    const url = editingProductId ? `${backendUrl}/products/${editingProductId}` : `${backendUrl}/products`;
    const method = editingProductId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Unable to save product');
    }

    setAddedMessage(editingProductId ? 'Product updated successfully!' : 'Product created successfully!');
    resetForm();
    await refreshMyProducts();
    setTimeout(() => setAddedMessage(''), 3000);
  };

  const handleDeleteMyProduct = async (productId) => {
    if (!token) return;
    const res = await fetch(`${backendUrl}/products/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Unable to delete product');
    }

    setAddedMessage('Product deleted successfully!');
    await refreshMyProducts();
    setTimeout(() => setAddedMessage(''), 3000);
  };

  const startEdit = (product) => {
    setEditingProductId(product.id);
    setIsFormOpen(true);
    setProductForm({
      title: product.title || '',
      imageUrls: (() => {
        const images = [];
        if (product.image) images.push(product.image);
        try {
          const extra = JSON.parse(product.additionalImagesJson || '[]');
          if (Array.isArray(extra)) {
            extra.forEach((img) => {
              if (img && !images.includes(img)) images.push(img);
            });
          }
        } catch {
          // ignore parse errors for old data
        }
        return images.join('\n');
      })(),
      price: String(product.price ?? 0),
      oldPrice: product.oldPrice == null ? '' : String(product.oldPrice),
      rating: String(product.rating ?? 0),
      stars: String(product.stars ?? 0),
      orders: String(product.orders ?? 0),
      category: product.category || '',
      description: product.description || ''
    });
  };

  const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;
  const renderStars = (stars) => {
    const safeStars = Number(stars || 0);
    const fullStars = Math.floor(safeStars);
    const hasHalfStar = safeStars % 1 !== 0;
    const emptyStars = 5 - Math.ceil(safeStars);

    return (
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fa-solid fa-star"></i>)}
        {hasHalfStar && <i className="fa-solid fa-star-half-stroke"></i>}
        {[...Array(Math.max(0, emptyStars))].map((_, i) => <i key={`empty-${i}`} className="fa-regular fa-star"></i>)}
      </div>
    );
  };

  const query = new URLSearchParams(location.search).get('q')?.toLowerCase().trim() || '';
  const displayedProducts = query
    ? myProducts.filter((item) =>
        [item.title, item.category, item.description]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query))
      )
    : myProducts;

  return (
    <div className="container">
      <div className="breadcrumbs desktop-only">
        <a href="/">Home</a>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', alignSelf: 'center', margin: '0 5px' }}></i>
        <span>My Products</span>
      </div>

      {addedMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: (addedMessage.includes('successfully') || addedMessage.includes('created')) ? '#E8F5E9' : '#FFF2F2',
          border: '1px solid ' + ((addedMessage.includes('successfully') || addedMessage.includes('created')) ? 'var(--green)' : 'var(--red)'),
          color: (addedMessage.includes('successfully') || addedMessage.includes('created')) ? 'var(--green)' : 'var(--red)',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          fontWeight: '500'
        }}>
          {addedMessage}
        </div>
      )}

      {/* <section className="my-products-card" style={{ marginBottom: '40px' }}> */}
      <section style={{ marginBottom: '40px' }}>
        <div className="my-products-header">
          <h4 className="my-products-title">Manage My Products</h4>
          <button className="btn btn-primary" type="button" onClick={() => { setEditingProductId(null); setIsFormOpen(true); }}>
            Add Product
          </button>
        </div>

        {displayedProducts.length > 0 ? (
          <>
            <div className="listing-top-bar my-products-toolbar">
              <div className="item-count"><span>{displayedProducts.length} items found</span></div>
              <div className="view-options">
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

            <div className={viewMode === 'grid' ? 'product-grid-container my-products-grid-view' : 'product-list-container my-products-list-view'}>
              {displayedProducts.map((item) => (
                <div key={item.id} className={viewMode === 'grid' ? 'product-grid-item my-product-card' : 'product-list-item my-product-card'}>
                  <div className={viewMode === 'grid' ? 'product-grid-img' : 'product-list-img'}>
                    <img src={item.image} alt={item.title} className="my-product-image" />
                  </div>

                  <div className={viewMode === 'grid' ? 'grid-item-info' : 'product-list-info'}>
                    <h4 className="my-product-title">{item.title}</h4>
                    <div className={viewMode === 'grid' ? 'grid-rating-row' : 'price-row'}>
                      <span className="price">{formatPrice(item.price)}</span>
                      {item.oldPrice ? <span className="old-price">{formatPrice(item.oldPrice)}</span> : null}
                    </div>
                    <div className={viewMode === 'grid' ? 'grid-rating-row' : 'rating-row'}>
                      {renderStars(item.stars)}
                      <span style={{ color: 'var(--orange)', marginLeft: '5px' }}>{Number(item.rating || 0).toFixed(1)}</span>
                      {viewMode === 'list' ? (
                        <>
                          <span className="dot-separator" style={{ margin: '0 10px' }}>&bull;</span>
                          <span className="order-count" style={{ color: 'var(--secondary-color)', fontSize: '14px' }}>{item.orders || 0} orders</span>
                        </>
                      ) : null}
                    </div>
                    <p className="my-products-meta">{item.category}</p>
                    {viewMode === 'list' ? <p className="product-list-desc">{item.description}</p> : null}
                  </div>

                  <div className="my-products-item-actions">
                    <button type="button" className="btn btn-white" onClick={() => startEdit(item)}>Edit</button>
                    <button type="button" className="btn btn-white" onClick={() => handleDeleteMyProduct(item.id).catch((err) => setAddedMessage(err.message))}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ marginTop: '14px', color: 'var(--secondary-color)' }}>No products yet. Click Add Product to create one.</p>
        )}
      </section>

      {isFormOpen && (
        <div className="my-products-modal-overlay">
          <div className="my-products-modal" onClick={(e) => e.stopPropagation()}>
            <div className="my-products-modal-top">
              <h4>{editingProductId ? 'Update Product' : 'Create Product'}</h4>
              <button type="button" className="my-products-close-btn" onClick={resetForm}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={(e) => handleSubmitProduct(e).catch((err) => setAddedMessage(err.message))}>
              <div className="my-products-grid">
                <input className="my-products-input" value={productForm.title} onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Title" required />
                <input className="my-products-input" value={productForm.category} onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))} placeholder="Category" required />
                <textarea className="my-products-textarea" value={productForm.imageUrls} onChange={(e) => setProductForm(prev => ({ ...prev, imageUrls: e.target.value }))} placeholder="Image URLs (one per line). First image will be used on card/main view." rows={3} required />
                  <input className="my-products-input" value={productForm.price} onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))} type="number" step="0.01" placeholder="Price" required />
                <input className="my-products-input" value={productForm.oldPrice} onChange={(e) => setProductForm(prev => ({ ...prev, oldPrice: e.target.value }))} type="number" step="0.01" placeholder="Old Price (optional)" />
                <input className="my-products-input" value={productForm.orders} onChange={(e) => setProductForm(prev => ({ ...prev, orders: e.target.value }))} type="number" placeholder="Orders" />
                <input className="my-products-input" value={productForm.rating} onChange={(e) => setProductForm(prev => ({ ...prev, rating: e.target.value }))} type="number" step="0.1" placeholder="Rating (0-10)" />
                <input className="my-products-input" value={productForm.stars} onChange={(e) => setProductForm(prev => ({ ...prev, stars: e.target.value }))} type="number" step="0.1" placeholder="Stars (0-5)" />
              </div>
              <textarea className="my-products-textarea" value={productForm.description} onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" rows={3} required />
              <div className="my-products-actions">
                <button className="btn btn-primary" type="submit">{editingProductId ? 'Update Product' : 'Create Product'}</button>
                <button className="btn btn-white" type="button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
