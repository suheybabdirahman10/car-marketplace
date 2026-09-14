import React, { useState, useEffect } from 'react';
import carService from '../services/carService.js';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import CarCard from '../components/CarCard.jsx';
import { AlertCircle, RotateCcw } from 'lucide-react';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All');

  const fetchCarsDirectly = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedBrand && selectedBrand !== 'All') params.brand = selectedBrand;
      if (selectedModel && selectedModel !== 'All') params.model = selectedModel;

      const data = await carService.getCars(params);
      setCars(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce keyword search to avoid spamming the backend database
    const delayDebounceFn = setTimeout(() => {
      fetchCarsDirectly();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedBrand, selectedModel]);

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="hero">
        <span className="hero-tag">Premium Collection</span>
        <h1 className="hero-title">Find Your Perfect Drive</h1>
        <p className="hero-subtitle">
          Explore our handpicked collection of premium vehicles, from eco-friendly electric cars to high-performance beasts.
        </p>
      </section>

      {/* Search and Filters Layout */}
      <div className="search-container">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div style={{ marginTop: '1.25rem' }}>
          <FilterBar 
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </div>
      </div>

      {/* Main Listing Area */}
      {error && (
        <div className="alert-message">
          <AlertCircle size={20} />
          <span style={{ flex: 1 }}>{error}</span>
          <button onClick={fetchCarsDirectly} className="btn-card-view" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : cars.length > 0 ? (
        <>
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Showing {cars.length} {cars.length === 1 ? 'car' : 'cars'}
          </div>
          <div className="cars-grid">
            {cars.map((car) => (
              <CarCard key={car.carId} car={car} />
            ))}
          </div>
        </>
      ) : (
        <div className="no-data">
          <h3 className="no-data-title">No Vehicles Found</h3>
          <p>We couldn't find any cars matching your search. Try adjusting your search query or filter selections.</p>
          {(searchQuery || selectedBrand !== 'All' || selectedModel !== 'All') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('All');
                setSelectedModel('All');
              }}
              className="btn-cancel"
              style={{ marginTop: '1.5rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
