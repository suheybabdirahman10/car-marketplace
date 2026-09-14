import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import carService from '../services/carService.js';
import { 
  ArrowLeft, 
  Calendar, 
  Fuel, 
  Trash2, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Pencil
} from 'lucide-react';

const CarDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await carService.getCarById(carId);
        setCar(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load vehicle details. The vehicle might have been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await carService.deleteCar(carId);
      navigate('/', { replace: true });
    } catch (err) {
      alert('Failed to delete car: ' + (err.response?.data?.message || err.message));
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p>Loading vehicle specifications...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="details-container">
        <Link to="/" className="btn-back">
          <ArrowLeft size={18} /> Back to Catalog
        </Link>
        <div className="alert-message" style={{ marginTop: '2rem' }}>
          <AlertCircle size={20} />
          <span>{error || 'Vehicle not found'}</span>
        </div>
      </div>
    );
  }

  const { title, brand, model, year, price, fuelType, image, description } = car;

  const formattedPrice = price !== undefined && price !== null
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(price)
    : '$0';

  return (
    <div className="details-container">
      <Link to="/" className="btn-back">
        <ArrowLeft size={18} /> Back to Catalog
      </Link>

      <div className="details-grid">
        <div className="details-img-wrapper">
          <img 
            src={image} 
            alt={`${brand} ${model}`} 
            className="details-img" 
            onError={handleImageError}
          />
        </div>

        <div className="details-info">
          <span className="details-brand-model">{brand} • {model}</span>
          <h1 className="details-title">{title}</h1>

          <div className="details-price-badge">
            <span className="details-price-label">Asking Price</span>
            <span className="details-price-value">{formattedPrice}</span>
          </div>

          <h3 className="specs-grid-title">Vehicle Information</h3>
          <div className="specs-details-grid">
            <div className="spec-detail-card">
              <div className="spec-detail-icon">
                <Calendar size={18} />
              </div>
              <div>
                <p className="spec-detail-label">Year</p>
                <p className="spec-detail-value">{year}</p>
              </div>
            </div>

            <div className="spec-detail-card">
              <div className="spec-detail-icon">
                <Fuel size={18} />
              </div>
              <div>
                <p className="spec-detail-label">Fuel Type</p>
                <p className="spec-detail-value">{fuelType}</p>
              </div>
            </div>

            <div className="spec-detail-card">
              <div className="spec-detail-icon">
                <Clock size={18} />
              </div>
              <div>
                <p className="spec-detail-label">Listing ID</p>
                <p className="spec-detail-value">#{carId}</p>
              </div>
            </div>

            <div className="spec-detail-card">
              <div className="spec-detail-icon">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="spec-detail-label">Warranty</p>
                <p className="spec-detail-value">12 Months</p>
              </div>
            </div>
          </div>

          <h3 className="details-description-title">Seller Description</h3>
          <p className="details-description">{description}</p>

          <div className="details-actions">
            <button 
              onClick={() => alert('Inquiry sent! A sales advisor will contact you shortly.')} 
              className="btn-contact"
            >
              <MessageSquare size={18} />
              <span>Contact Advisor</span>
            </button>
            <Link 
              to={`/edit-car/${carId}`} 
              className="btn-edit"
            >
              <Pencil size={18} />
              <span>Edit Listing</span>
            </Link>
            <button 
              onClick={() => setShowDeleteModal(true)} 
              className="btn-delete"
            >
              <Trash2 size={18} />
              <span>Delete Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Delete Listing?</h2>
            <p className="modal-text">
              Are you sure you want to delete this listing for <strong>{brand} {model}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="btn-modal-cancel"
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="btn-modal-confirm"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
