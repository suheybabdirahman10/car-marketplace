import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import carService from '../services/carService.js';
import { ArrowLeft, Plus, Image as ImageIcon, AlertCircle } from 'lucide-react';

const AddCar = () => {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Gas', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'price' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple validations
    if (!formData.title || !formData.brand || !formData.model || !formData.image || !formData.description) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0.');
      setLoading(false);
      return;
    }

    if (formData.year < 1886 || formData.year > new Date().getFullYear() + 2) {
      setError(`Year must be between 1886 and ${new Date().getFullYear() + 2}.`);
      setLoading(false);
      return;
    }

    try {
      await carService.createCar(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to list vehicle. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Link to="/" className="btn-back" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back to Catalog
      </Link>

      <div className="form-card">
        <h1 className="form-title">List Your Vehicle</h1>
        <p className="form-subtitle">Enter details to list your car on the global Veloce Marketplace.</p>

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
                placeholder="e.g. 2023 Tesla Model Y Long Range"
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
                placeholder="e.g. Tesla"
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
                placeholder="e.g. Model Y"
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
                placeholder="e.g. 45000"
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
                placeholder="e.g. https://images.unsplash.com/..."
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
                placeholder="Write about the vehicle condition, history, extra features..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn-cancel">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              <Plus size={18} />
              <span>{loading ? 'Submitting...' : 'Submit Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
