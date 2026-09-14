import Car from '../models/Car.js';

// @desc    Get all cars (with query-level search and filters)
// @route   GET /api/cars
// @access  Public
export const getAllCars = async (req, res) => {
  try {
    const { search, brand, model } = req.query;
    let query = {};

    // Search query check (matches regex on title, brand, or model)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter query checks (case-insensitive exact matches)
    if (brand) {
      query.brand = { $regex: `^${brand}$`, $options: 'i' };
    }
    if (model) {
      query.model = { $regex: `^${model}$`, $options: 'i' };
    }

    const cars = await Car.find(query).sort({ carId: 1 });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

// @desc    Get single car using sequential carId
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  const numericId = Number(req.params.id);
  if (isNaN(numericId)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format: must be numeric' });
  }
  
  try {
    const car = await Car.findOne({ carId: numericId });
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};

// @desc    Create a new car
// @route   POST /api/cars
// @access  Public
export const createCar = async (req, res) => {
  const { title, brand, model, year, price, fuelType, image, description } = req.body;

  // Manual basic validation
  if (!title || !brand || !model || !year || !price || !fuelType || !image || !description) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const car = new Car({
      title,
      brand,
      model,
      year,
      price,
      fuelType,
      image,
      description
    });

    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation Error: ' + error.message });
  }
};

// @desc    Update a car using sequential carId
// @route   PUT /api/cars/:id
// @access  Public
export const updateCar = async (req, res) => {
  const numericId = Number(req.params.id);
  if (isNaN(numericId)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format: must be numeric' });
  }

  try {
    const car = await Car.findOne({ carId: numericId });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const { title, brand, model, year, price, fuelType, image, description } = req.body;

    car.title = title !== undefined ? title : car.title;
    car.brand = brand !== undefined ? brand : car.brand;
    car.model = model !== undefined ? model : car.model;
    car.year = year !== undefined ? year : car.year;
    car.price = price !== undefined ? price : car.price;
    car.fuelType = fuelType !== undefined ? fuelType : car.fuelType;
    car.image = image !== undefined ? image : car.image;
    car.description = description !== undefined ? description : car.description;

    const updatedCar = await car.save();
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update Error: ' + error.message });
  }
};

// @desc    Delete a car using sequential carId with automatic renumbering
// @route   DELETE /api/cars/:id
// @access  Public
export const deleteCar = async (req, res) => {
  const numericId = Number(req.params.id);
  if (isNaN(numericId)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format: must be numeric' });
  }

  try {
    // Find the car first to verify existence and get its carId
    const car = await Car.findOne({ carId: numericId });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const deletedCarId = car.carId;

    // Delete the target car
    await Car.deleteOne({ carId: deletedCarId });

    // Renumber all cars with higher IDs to fill the gap
    await Car.updateMany(
      { carId: { $gt: deletedCarId } },
      { $inc: { carId: -1 } }
    );

    res.status(200).json({ 
      success: true, 
      message: `Car listing ${deletedCarId} removed and subsequent listings renumbered successfully.` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
  }
};
