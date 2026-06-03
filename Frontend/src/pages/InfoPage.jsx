import React from 'react';
import { Link, useParams } from 'react-router-dom';

const pageContent = {
  about: {
    title: 'About Brand',
    subtitle: 'A buyer and seller marketplace for real products in this store.',
    points: ['Browse product categories', 'Save favorite products', 'Manage your cart and orders', 'Create and manage your own products']
  },
  agreement: {
    title: 'User agreement',
    subtitle: 'Basic rules for using this ecommerce store.',
    points: ['Use accurate account information', 'Keep your login details secure', 'Only upload product information you own', 'Review order details before checkout']
  },
  partnership: {
    title: 'Partnership',
    subtitle: 'Seller tools are available through your account.',
    points: ['Create products from My Products', 'Update listings when stock or pricing changes', 'Keep product images and descriptions accurate']
  },
  privacy: {
    title: 'Privacy policy',
    subtitle: 'Account data is used to run store features.',
    points: ['Profile details identify your account', 'Cart and order data power checkout', 'Saved items are stored for your account only']
  }
};

export default function InfoPage() {
  const { slug = 'about' } = useParams();
  const content = pageContent[slug] || pageContent.about;

  return (
    <main className="container info-page">
      <div className="page-card info-card">
        <Link to="/" className="info-back"><i className="fa-solid fa-arrow-left"></i> Back to home</Link>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
        <div className="info-points">
          {content.points.map((point) => (
            <div key={point} className="info-point">
              <i className="fa-solid fa-check"></i>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
