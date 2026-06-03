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
    images: [''],
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
      images: [''],
      price: '0',
      oldPrice: '',
      rating: '0',
      stars: '0',
      orders: '0',
      category: '',
      description: ''
    });
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setProductForm((prev) => {
        const newImages = [...prev.images];
        newImages[index] = base64;
        return { ...prev, images: newImages };
      });
    };
    reader.readAsDataURL(file);
  };

  const addImageSlot = () => {
    setProductForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageSlot = (index) => {
    setProductForm((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!token) {
      setAddedMessage('Please log in first!');
      return;
    }

    const parsedImages = productForm.images.filter(Boolean);

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

    if (payload.oldPrice != null && payload.oldPrice <= payload.price) {
      setAddedMessage('Old Price must be greater than Price to apply an offer.');
      setTimeout(() => setAddedMessage(''), 3000);
      return;
    }

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
      images: (() => {
        const imagesList = [];
        if (product.image) imagesList.push(product.image);
        try {
          const extra = JSON.parse(product.additionalImagesJson || '[]');
          if (Array.isArray(extra)) {
            extra.forEach((img) => {
              if (img && !imagesList.includes(img)) imagesList.push(img);
            });
          }
        } catch {
          // ignore parse errors for old data
        }
        return imagesList.length > 0 ? imagesList : [''];
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

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q')?.toLowerCase().trim() || '';
  const category = queryParams.get('category')?.toLowerCase().trim() || '';
  const displayedProducts = query
    ? myProducts.filter((item) =>
        [item.title, item.category, item.description]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query))
      )
    : myProducts;
  const categoryFilteredProducts = category
    ? displayedProducts.filter((item) =>
        [item.title, item.category, item.description]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(category))
      )
    : displayedProducts;

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

        {categoryFilteredProducts.length > 0 ? (
          <>
            <div className="listing-top-bar my-products-toolbar">
              <div className="item-count"><span>{categoryFilteredProducts.length} items found</span></div>
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
              {categoryFilteredProducts.map((item) => (
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
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Product Images</label>
                  {productForm.images.map((imgBase64, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <input 
                          type="text"
                          placeholder="Paste image URL here..."
                          value={imgBase64 && imgBase64.startsWith('data:image') ? 'Uploaded Local File (Base64)' : imgBase64}
                          onChange={(e) => {
                            // If they are trying to edit the text of an uploaded file, clear it
                            if (imgBase64 && imgBase64.startsWith('data:image')) {
                              setProductForm(prev => {
                                const newImages = [...prev.images];
                                newImages[index] = '';
                                return { ...prev, images: newImages };
                              });
                              return;
                            }
                            const val = e.target.value;
                            setProductForm(prev => {
                              const newImages = [...prev.images];
                              newImages[index] = val;
                              return { ...prev, images: newImages };
                            });
                          }}
                          className="my-products-input"
                          style={{ flex: '1 1 200px', padding: '8px', color: (imgBase64 && imgBase64.startsWith('data:image')) ? 'var(--green)' : 'inherit' }}
                          required={index === 0 && !imgBase64}
                        />
                        <span style={{ fontSize: '13px', color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>OR</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(index, e.target.files[0]);
                            }
                          }}
                          className="my-products-input"
                          style={{ flex: '1 1 150px', padding: '8px', fontSize: '12px' }}
                        />
                        {imgBase64 && <img src={imgBase64.startsWith('Uploaded') ? '' : imgBase64} alt={`Preview ${index}`} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                        {productForm.images.length > 1 && (
                          <button type="button" className="btn btn-white" onClick={() => removeImageSlot(index)} style={{ padding: '6px 10px' }}>
                            <i className="fa-solid fa-trash" style={{ color: 'var(--red)' }}></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-white" onClick={addImageSlot} style={{ fontSize: '13px', padding: '6px 12px' }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '5px' }}></i> Add new picture
                  </button>
                </div>
                  <input className="my-products-input" value={productForm.price} onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))} type="number" step="0.01" placeholder="Price" required />
                <input className="my-products-input" value={productForm.oldPrice} onChange={(e) => setProductForm(prev => ({ ...prev, oldPrice: e.target.value }))} type="number" step="0.01" placeholder="Old Price (optional)" />
                <input className="my-products-input" value={productForm.orders} onChange={(e) => setProductForm(prev => ({ ...prev, orders: e.target.value }))} type="number" placeholder="Orders" />
                <input className="my-products-input" value={productForm.rating} onChange={(e) => setProductForm(prev => ({ ...prev, rating: e.target.value }))} type="number" max={10.0} min={0} step="0.1" placeholder="Rating (0-10)" />
                <input className="my-products-input" value={productForm.stars} onChange={(e) => setProductForm(prev => ({ ...prev, stars: e.target.value }))} type="number" max={5.0} min={0} step="0.1" placeholder="Stars (0-5)" />
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
