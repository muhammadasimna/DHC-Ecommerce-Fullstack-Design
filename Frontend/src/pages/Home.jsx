import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-box">
          <aside className="hero-sidebar">
            <ul>
              <li className="active">Automobiles</li>
              <li>Clothes and wear</li>
              <li>Home interiors</li>
              <li>Computer and tech</li>
              <li>Tools, equipments</li>
              <li>Sports and outdoor</li>
              <li>Animal and pets</li>
              <li>Machinery tools</li>
              <li>More category</li>
            </ul>
          </aside>
          <div className="hero-banner" style={{ backgroundImage: "url('./public/assets/Image/backgrounds/Banner-board-800x420 2.png')", backgroundSize: 'cover', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat', backgroundColor: '#E3F0FF' }}>
            <div style={{ maxWidth: '300px' }}>
              <h2 style={{ fontWeight: 400 }}>Latest trending</h2>
              <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Electronic items</h1>
              <button className="btn btn-white">Learn more</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="user-card">
              <div className="user-info">
                <div className="user-avatar" style={{ backgroundImage: "url('./public/assets/Layout1/Image/flags/icon.png')", backgroundSize: 'cover' }}></div>
                <span>Hi, user <br /> let's get started</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginBottom: '8px', fontSize: '14px' }}>Join now</button>
              <button className="btn btn-white" style={{ width: '100%', fontSize: '14px', color: 'var(--primary-color)' }}>Log in</button>
            </div>
            <div className="sale-card">
              <p>Get US $10 off with a new supplier</p>
            </div>
            <div className="quotes-card">
              <p>Send quotes with supplier preferences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deals and Offers */}
      <section className="section-deals">
        <div className="deals-box">
          <div className="deals-info">
            <div className="deals-info-text">
              <h3>Deals and offers</h3>
              <p style={{ color: 'var(--secondary-color)', fontSize: '14px' }}>Electronic equipments</p>
            </div>
            <div className="timer">
              <div className="timer-item"><span>04</span><label>Days</label></div>
              <div className="timer-item"><span>13</span><label>Hour</label></div>
              <div className="timer-item"><span>34</span><label>Min</label></div>
              <div className="timer-item"><span>56</span><label>Sec</label></div>
            </div>
          </div>
          <div className="deals-products">
            {[
              { img: './public/assets/Image/tech/8.png', name: 'Smart watches', tag: '-25%' },
              { img: './public/assets/Image/tech/image 34.png', name: 'Laptops', tag: '-15%' },
              { img: './public/assets/Image/tech/6.png', name: 'GoPro cameras', tag: '-40%' },
              { img: './public/assets/Image/tech/image 29.png', name: 'Headphones', tag: '-25%' },
              { img: './public/assets/Image/tech/6.png', name: 'Canon cameras', tag: '-25%' },
            ].map((deal, idx) => (
              <div className="deal-item" key={idx}>
                <div className="deal-img"><img src={deal.img} alt={deal.name} /></div>
                <p style={{ fontSize: '14px', marginBottom: '10px' }}>{deal.name}</p>
                <span className="deal-tag">{deal.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home and Outdoor */}
      <section className="section-category">
        <div className="category-box">
          <div className="category-banner" style={{ backgroundImage: "url('./public/assets/Image/backgrounds/Group 969.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h3 style={{ width: '150px', marginBottom: '20px' }}>Home and outdoor</h3>
            <button className="btn btn-white">Source now</button>
          </div>
          <div className="category-grid">
            {[
              { name: 'Soft chairs', price: 'From USD 19', img: './public/assets/Image/interior/1.png' },
              { name: 'Sofa & chair', price: 'From USD 19', img: './public/assets/Image/interior/3.png' },
              { name: 'Kitchen dishes', price: 'From USD 19', img: './public/assets/Image/interior/6.png' },
              { name: 'Smart watches', price: 'From USD 19', img: './public/assets/Image/tech/8.png' },
              { name: 'Kitchen mixer', price: 'From USD 100', img: './public/assets/Image/interior/image 89.png' },
              { name: 'Blenders', price: 'From USD 39', img: './public/assets/Image/interior/image 93.png' },
              { name: 'Home appliance', price: 'From USD 19', img: './public/assets/Image/interior/7.png' },
              { name: 'Coffee maker', price: 'From USD 10', img: './public/assets/Image/interior/9.png' },
            ].map((cat, idx) => (
              <div className="category-item" key={idx}>
                <div className="category-item-info"><h4>{cat.name}</h4><p>{cat.price}</p></div>
                <div className="category-item-img"><img src={cat.img} alt="" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consumer Electronics */}
      <section className="section-category">
        <div className="category-box">
          <div className="category-banner" style={{ backgroundImage: "url('./public/assets/Image/backgrounds/image 98.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h3 style={{ marginBottom: '20px' }}>Consumer electronics and gadgets</h3>
            <button className="btn btn-white">Source now</button>
          </div>
          <div className="category-grid">
            {[
              { name: 'Smart watches', price: 'From USD 19', img: './public/assets/Image/tech/8.png' },
              { name: 'Cameras', price: 'From USD 89', img: './public/assets/Image/tech/6.png' },
              { name: 'Headphones', price: 'From USD 10', img: './public/assets/Layout/alibaba/Image/tech/image 86.png' },
              { name: 'Smart watches', price: 'From USD 90', img: './public/assets/Layout/alibaba/Image/tech/image 85.png' },
              { name: 'Gaming set', price: 'From USD 35', img: './public/assets/Image/tech/image 29.png' },
              { name: 'Laptops & PC', price: 'From USD 340', img: './public/assets/Image/tech/image 34.png' },
              { name: 'Smartphones', price: 'From USD 19', img: './public/assets/Image/tech/image 32.png' },
              { name: 'Electric kettle', price: 'From USD 240', img: './public/assets/Image/tech/image 33.png' },
            ].map((cat, idx) => (
              <div className="category-item" key={idx}>
                <div className="category-item-info"><h4>{cat.name}</h4><p>{cat.price}</p></div>
                <div className="category-item-img"><img src={cat.img} alt="" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Section */}
      <section className="section-inquiry" style={{ backgroundImage: "linear-gradient(rgba(13, 110, 253, 0.2), rgba(13, 110, 253, 0.1 )), url('/assets/Image/backgrounds/Group 982.png')" }}>
        <div className="inquiry-text">
          <h2>An easy way to send requests to all suppliers</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
        </div>
        <div className="inquiry-form">
          <h3>Send quote to suppliers</h3>
          <div className="form-group"><input type="text" placeholder="What item you need?" /></div>
          <div className="form-group"><textarea placeholder="Type more details" rows="3"></textarea></div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}><input type="number" placeholder="Quantity" /></div>
            <div className="form-group" style={{ width: '100px' }}>
              <select defaultValue="Pcs">
                <option value="Pcs">Pcs</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary">Send inquiry</button>
        </div>
      </section>

      {/* Recommended Items */}
      <section className="section-recommended">
        <h2>Recommended items</h2>
        <div className="recommended-grid">
          {[
            { img: './public/assets/Layout/alibaba/Image/cloth/Bitmap.png', price: '$10.30', title: 'T-shirts with multiple colors, for men' },
            { img: './public/assets/Layout/alibaba/Image/cloth/2 1.png', price: '$10.30', title: 'Jeans shorts for men blue color' },
            { img: './public/assets/Layout/alibaba/Image/cloth/image 30.png', price: '$12.50', title: 'Brown winter coat medium size' },
            { img: './public/assets/Layout/alibaba/Image/cloth/image 24.png', price: '$34.00', title: 'Jeans bag for travel for men' },
            { img: './public/assets/Layout/alibaba/Image/cloth/image 26.png', price: '$99.00', title: 'Leather wallet' },
            { img: './public/assets/Layout/alibaba/Image/cloth/Bitmap (2).png', price: '$9.99', title: 'Canon camera black, 100x zoom' },
            { img: './public/assets/Layout/alibaba/Image/tech/image 86.png', price: '$8.99', title: 'Headset for gaming with mic' },
            { img: './public/assets/Layout/alibaba/Image/cloth/image 26.png', price: '$10.30', title: 'Smart watch silver color modern' },
            { img: './public/assets/Layout/alibaba/Image/interior/image 90.png', price: '$10.30', title: 'Blue wallet for men leather material' },
            { img: './public/assets/Layout/alibaba/Image/tech/image 85.png', price: '$80.95', title: 'Jeans bag for travel for men' },
          ].map((item, idx) => (
            <div className="product-card" key={idx}>
              <div className="product-card-img"><img src={item.img} alt="" /></div>
              <div className="product-card-info"><p className="price">{item.price}</p><p className="title">{item.title}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Services */}
      <section className="section-services">
        <h2>Our extra services</h2>
        <div className="services-grid">
          {[
            { img: './public/assets/Image/backgrounds/Mask group.png', icon: 'fa-solid fa-magnifying-glass', title: 'Source from Industry Hubs' },
            { img: './public/assets/Image/backgrounds/Mask group (1).png', icon: 'fa-solid fa-box-open', title: 'Customize Your Products' },
            { img: './public/assets/Image/backgrounds/image 106.png', icon: 'fa-solid fa-paper-plane', title: 'Fast, reliable shipping by ocean or air' },
            { img: './public/assets/Image/backgrounds/image 107.png', icon: 'fa-solid fa-shield-halved', title: 'Product monitoring and inspection' },
          ].map((service, idx) => (
            <div className="service-card" key={idx}>
              <div className="service-img" style={{ backgroundImage: `url('${service.img}')` }}>
                <div className="service-icon"><i className={service.icon}></i></div>
              </div>
              <div className="service-content"><h4>{service.title}</h4></div>
            </div>
          ))}
        </div>
      </section>

      {/* Suppliers Region */}
      <section className="section-regions">
        <h2>Suppliers by region</h2>
        <div className="regions-grid">
          {[
            { flag: './public/assets/Layout1/Image/flags/AE@2x.png', name: 'Arabic Emirates', site: 'shopname.ae' },
            { flag: './public/assets/Layout1/Image/flags/icon.png', name: 'Australia', site: 'shopname.ae' },
            { flag: './public/assets/Layout1/Image/flags/US@2x.png', name: 'United States', site: 'shopname.ae' },
            { flag: './public/assets/Layout1/Image/flags/RU@2x.png', name: 'Russia', site: 'shopname.ae' },
            { flag: './public/assets/Layout1/Image/flags/IT@2x.png', name: 'Italy', site: 'shopname.it' },
            { flag: './public/assets/Layout1/Image/flags/DK@2x.png', name: 'Denmark', site: 'denmark.com.dk' },
            { flag: './public/assets/Layout1/Image/flags/FR@2x.png', name: 'France', site: 'shopname.com.fr' },
            { flag: './public/assets/Layout1/Image/flags/AE@2x.png', name: 'Arabic Emirates', site: 'shopname.ae' },
            { flag: './public/assets/Layout1/Image/flags/CN@2x.png', name: 'China', site: 'shopname.ae' },
            { flag: './public/assets/Layout1/Image/flags/GB@2x.png', name: 'Great Britain', site: 'shopname.co.uk' },
          ].map((region, idx) => (
            <div className="region-item" key={idx}>
              <img src={region.flag} alt="" className="region-flag" />
              <div className="region-info"><span>{region.name}</span><label>{region.site}</label></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
