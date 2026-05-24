import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { token, backendUrl } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    document.body.classList.add('orders-page');
    return () => document.body.classList.remove('orders-page');
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, backendUrl]);

  const query = new URLSearchParams(location.search).get('q')?.toLowerCase().trim() || '';
  const displayedOrders = query
    ? orders.filter((order) => {
        const inOrderId = String(order.id).includes(query);
        const inItems = (order.items || []).some((i) => String(i.productTitle || '').toLowerCase().includes(query));
        return inOrderId || inItems;
      })
    : orders;

  if (loading) {
    return <div className="container" style={{ padding: '40px 15px' }}>Loading orders...</div>;
  }

  return (
    <main className="container" style={{ paddingBottom: '40px' }}>
      <h2 style={{ marginTop: '20px', marginBottom: '20px' }}>My Orders ({displayedOrders.length})</h2>
      {displayedOrders.length === 0 ? (
        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-300)', borderRadius: '8px', padding: '30px' }}>
          <p style={{ color: 'var(--secondary-color)', marginBottom: '15px' }}>No orders yet.</p>
          <Link to="/listing" className="btn btn-primary">Shop now</Link>
        </div>
      ) : (
        <>
          <div className="listing-top-bar" style={{ marginBottom: '14px' }}>
            <div className="item-count"><span>{displayedOrders.length} orders found</span></div>
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

          <div className={viewMode === 'grid' ? 'product-grid-container orders-grid' : 'orders-list'}>
            {displayedOrders.map((order) => (
              <section key={order.id} style={{ background: 'var(--white)', border: '1px solid var(--gray-300)', borderRadius: '8px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p style={{ color: 'var(--secondary-color)', margin: 0 }}>{new Date(order.createdAtUtc).toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>${Number(order.total || 0).toFixed(2)}</strong>
                    <p style={{ margin: 0, color: 'var(--green)' }}>{order.status}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {(order.items || []).map((item) => (
                    <Link key={item.id} to={`/product?id=${item.productId}`} style={{ border: '1px solid var(--gray-300)', borderRadius: '6px', padding: '10px', display: 'flex', gap: '10px' }}>
                      <img src={item.productImage} alt={item.productTitle} style={{ width: '60px', height: '60px', objectFit: 'contain', border: '1px solid var(--gray-300)', borderRadius: '6px', padding: '4px', background: 'var(--white)' }} />
                      <div>
                        <p style={{ margin: 0, color: 'var(--dark-color)' }}>{item.productTitle}</p>
                        <p style={{ margin: 0, color: 'var(--secondary-color)' }}>Qty: {item.quantity}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
