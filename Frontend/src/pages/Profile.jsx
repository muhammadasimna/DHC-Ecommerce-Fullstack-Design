import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { cartItems, savedItems } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', location: '', shippingPolicy: '' });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const username = String(user?.username || 'User').trim();
  const email = String(user?.email || 'No email added').trim();
  const firstName = username.split(/\s+/)[0] || 'User';
  const initial = firstName.charAt(0).toUpperCase();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    document.body.classList.add('profile-page-view');
    return () => document.body.classList.remove('profile-page-view');
  }, []);

  useEffect(() => {
    setForm({
      username: user?.username || '',
      email: user?.email || '',
      location: user?.location || '',
      shippingPolicy: user?.shippingPolicy || ''
    });
  }, [user]);

  const openEdit = () => {
    setMessage('');
    setForm({
      username: user?.username || '',
      email: user?.email || '',
      location: user?.location || '',
      shippingPolicy: user?.shippingPolicy || ''
    });
    setIsEditing(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      await updateProfile({
        username: form.username.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        shippingPolicy: form.shippingPolicy.trim()
      });
      setMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setMessage(err.message || 'Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="profile-page">
      <div className="container">
        {message && (
          <div className={`profile-alert ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-breadcrumb desktop-only">
          <Link to="/">Home</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>My Profile</span>
        </div>

        <section className="profile-hero">
          <div className="profile-hero-main">
            <div className="profile-avatar-large">{initial}</div>
            <div>
              <p className="profile-eyebrow">Welcome back</p>
              <h1>{username}</h1>
              <p className="profile-email">{email}</p>
            </div>
          </div>
          <Link to="/listing" className="btn btn-primary profile-shop-btn">
            <i className="fa-solid fa-store"></i>
            Start sourcing
          </Link>
        </section>

        <div className="profile-layout">
          <aside className="profile-sidebar">
            <Link className="profile-nav-item active" to="/profile">
              <i className="fa-solid fa-user"></i>
              My profile
            </Link>
            <Link className="profile-nav-item" to="/orders">
              <i className="fa-solid fa-box"></i>
              Orders
            </Link>
            <Link className="profile-nav-item" to="/cart">
              <i className="fa-solid fa-cart-shopping"></i>
              Cart
            </Link>
            <Link className="profile-nav-item" to="/my-products">
              <i className="fa-solid fa-shop"></i>
              My products
            </Link>
          </aside>

          <section className="profile-content">
            <div className="profile-stats-grid">
              <div className="profile-stat-card">
                <span className="profile-stat-icon orders">
                  <i className="fa-solid fa-box-open"></i>
                </span>
                <div>
                  <strong>Orders</strong>
                  <p>Track purchases and checkout history</p>
                </div>
              </div>
              <div className="profile-stat-card">
                <span className="profile-stat-icon cart">
                  <i className="fa-solid fa-cart-shopping"></i>
                </span>
                <div>
                  <strong>{cartCount} cart items</strong>
                  <p>Products waiting for checkout</p>
                </div>
              </div>
              <div className="profile-stat-card">
                <span className="profile-stat-icon saved">
                  <i className="fa-solid fa-heart"></i>
                </span>
                <div>
                  <strong>{savedItems.length} saved items</strong>
                  <p>Saved products for later buying</p>
                </div>
              </div>
            </div>

            <div className="profile-card account-card">
              <div className="profile-card-header">
                <div>
              <h2>Account information</h2>
              <p>Basic buyer account details</p>
            </div>
            <div className="profile-card-actions">
              <span className="profile-verified">
                <i className="fa-solid fa-shield-halved"></i>
                Verified
              </span>
              <button type="button" className="btn btn-white profile-edit-btn" onClick={openEdit}>
                <i className="fa-solid fa-pen"></i>
                Edit profile
              </button>
            </div>
          </div>

              <div className="profile-info-grid">
                <div className="profile-info-row">
                  <span>Full name</span>
                  <strong>{username}</strong>
                </div>
                <div className="profile-info-row">
                  <span>Email address</span>
                  <strong>{email}</strong>
                </div>
                <div className="profile-info-row">
                  <span>Account ID</span>
                  <strong>#{user?.id || '0000'}</strong>
                </div>
                <div className="profile-info-row">
                  <span>Location</span>
                  <strong>{user?.location || 'Not set'}</strong>
                </div>
                <div className="profile-info-row">
                  <span>Shipping policy</span>
                  <strong>{user?.shippingPolicy || 'Not set'}</strong>
                </div>
                <div className="profile-info-row">
                  <span>Member type</span>
                  <strong>Buyer account</strong>
                </div>
              </div>
            </div>

            <div className="profile-actions-grid">
              <Link to="/orders" className="profile-action-card">
                <i className="fa-solid fa-receipt"></i>
                <strong>View orders</strong>
                <span>Check order status and totals</span>
              </Link>
              <Link to="/cart" className="profile-action-card">
                <i className="fa-solid fa-bag-shopping"></i>
                <strong>Open cart</strong>
                <span>Review items before checkout</span>
              </Link>
              <Link to="/my-products" className="profile-action-card">
                <i className="fa-solid fa-warehouse"></i>
                <strong>Manage products</strong>
                <span>Add, edit, and remove listings</span>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {isEditing && (
        <div className="profile-edit-overlay" onClick={() => setIsEditing(false)}>
          <div className="profile-edit-modal" onClick={(event) => event.stopPropagation()}>
            <div className="profile-edit-top">
              <div>
                <h3>Edit profile</h3>
                <p>Update your buyer account information</p>
              </div>
              <button type="button" className="profile-edit-close" onClick={() => setIsEditing(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="profile-edit-form">
              <label>
                <span>Full name</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                  placeholder="Enter your name"
                  required
                />
              </label>

              <label>
                <span>Email address</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </label>

              <label>
                <span>Location</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                  placeholder="e.g. Pakistan, Lahore"
                />
              </label>

              <label>
                <span>Shipping policy</span>
                <input
                  type="text"
                  value={form.shippingPolicy}
                  onChange={(event) => setForm((prev) => ({ ...prev, shippingPolicy: event.target.value }))}
                  placeholder="e.g. Worldwide shipping"
                />
              </label>

              <div className="profile-edit-actions">
                <button type="button" className="btn btn-white" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
