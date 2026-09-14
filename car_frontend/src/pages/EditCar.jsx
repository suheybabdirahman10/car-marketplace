import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import carService from '../services/carService.js';
import { ArrowLeft, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';

const EditCar = () => {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    fuelType: 'Petrol',
    image: '',
    description: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Gas', 'Other'];

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await carService.getCarById(carId);
        setFormData({
          title: data.title || '',
          brand: data.brand || '',
          model: data.model || '',
          year: data.year || new Date().getFullYear(),
          price: data.price || '',
          fuelType: data.fuelType || 'Petrol',
          image: data.image || '',
          description: data.description || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load vehicle details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'price' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Simple validations
    if (!formData.title || !formData.brand || !formData.model || !formData.image || !formData.description) {
      setError('Please fill in all fields.');
      setSubmitting(false);
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0.');
      setSubmitting(false);
      return;
    }

    if (formData.year < 1886 || formData.year > new Date().getFullYear() + 2) {
      setError(`Year must be between 1886 and ${new Date().getFullYear() + 2}.`);
      setSubmitting(false);
      return;
    }

    try {
      await carService.updateCar(carId, formData);
      navigate(`/car/${carId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update vehicle. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <Link to={`/car/${carId}`} className="btn-back" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Cancel and Go Back
      </Link>

      <div className="form-card">
        <h1 className="form-title">Edit Listing #{carId}</h1>
        <p className="form-subtitle">Modify the fields below to update your vehicle specifications.</p>

        {error && (
          <div className="alert-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label" htmlFor="title">Listing Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                className="form-input"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                className="form-input"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="year">Manufacture Year</label>
              <input
                type="number"
                id="year"
                name="year"
                className="form-input"
                min="1886"
                max={new Date().getFullYear() + 2}
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-input"
                min="1"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="fuelType">Fuel Type</label>
              <select
                id="fuelType"
                name="fuelType"
                className="form-select"
                value={formData.fuelType}
                onChange={handleChange}
                required
              >
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                className="form-input"
                value={formData.image}
                onChange={handleChange}
                required
              />
              
              <div className="img-preview-box">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = '<span>Invalid Image URL</span>';
                    }}
                  />
                ) : (
                  <>
                    <ImageIcon size={24} style={{ marginRight: '0.5rem' }} />
                    <span>Live preview will appear here</span>
                  </>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="description">Detailed Description</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to={`/car/${carId}`} className="btn-cancel">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={submitting}
            >
              <Save size={18} />
              <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCar;
