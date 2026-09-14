import React from 'react';

const FilterBar = ({ 
  selectedBrand, 
  setSelectedBrand, 
  selectedModel, 
  setSelectedModel 
}) => {
  const brands = ['Tesla', 'Porsche', 'BMW', 'Audi', 'Mercedes', 'Ford', 'Land Rover'];
  const modelsMap = {
    All: [],
    Tesla: ['Model S Plaid', 'Model 3', 'Model Y', 'Model X'],
    Porsche: ['911 GT3 RS', 'Cayenne', 'Taycan', 'Panamera'],
    BMW: ['M4 Competition', 'X5', 'M3', 'i8'],
    Audi: ['RS e-tron GT', 'R8', 'Q7', 'A6'],
    Mercedes: ['C-Class', 'E-Class', 'S-Class', 'AMG GT'],
    Ford: ['Mustang', 'F-150', 'Explorer', 'Bronco'],
    'Land Rover': ['Range Rover Sport', 'Defender', 'Discovery']
  };

  const currentModels = selectedBrand && selectedBrand !== 'All' ? modelsMap[selectedBrand] || [] : [];

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedModel('All'); // Reset model filter on brand change
  };

  return (
    <div className="filter-chips" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
      <div style={{ flex: 1, minWidth: '150px' }}>
        <select
          className="form-select"
          style={{ width: '100%', padding: '0.8rem 1rem' }}
          value={selectedBrand}
          onChange={handleBrandChange}
        >
          <option value="All">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div style={{ flex: 1, minWidth: '150px' }}>
        <select
          className="form-select"
          style={{ width: '100%', padding: '0.8rem 1rem' }}
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={selectedBrand === 'All'}
        >
          <option value="All">All Models</option>
          {currentModels.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
