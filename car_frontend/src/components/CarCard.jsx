import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Fuel, ArrowRight } from 'lucide-react';

const CarCard = ({ car }) => {
  const { carId, title, brand, model, year, price, fuelType, image } = car;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <article className="car-card">
      <div className="card-img-wrapper">
        <img 
          src={image} 
          alt={`${brand} ${model}`} 
          className="card-img" 
          onError={handleImageError}
          loading="lazy"
        />
        <span className="fuel-badge">{fuelType}</span>
      </div>
      <div className="card-content">
        <span className="card-brand-model">{brand} • {model}</span>
        <h3 className="card-title" title={title}>{title}</h3>
        
        <div className="card-specs">
          <span className="spec-item">
            <Calendar size={16} />
            <span>{year}</span>
          </span>
          <span className="spec-item">
            <Fuel size={16} />
            <span>{fuelType}</span>
          </span>
        </div>
        
        <div className="card-footer">
          <span className="card-price">{formattedPrice}</span>
          <Link to={`/car/${carId}`} className="btn-card-view">
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CarCard;
