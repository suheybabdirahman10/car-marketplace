import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    carId: {
      type: Number,
      unique: true,
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please add a car title'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Please add a model'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Please add a manufacture year'],
      min: [1886, 'Year cannot be before the invention of cars (1886)'],
      max: [new Date().getFullYear() + 2, 'Year cannot be too far in the future']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number']
    },
    fuelType: {
      type: String,
      required: [true, 'Please specify fuel type'],
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Gas', 'Other']
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-validate hook to find the highest carId dynamically and assign next sequential value
carSchema.pre('validate', async function (next) {
  if (this.isNew) {
    try {
      const highestCar = await this.constructor.findOne({}).sort({ carId: -1 });
      this.carId = highestCar ? highestCar.carId + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Car = mongoose.model('Car', carSchema);

export default Car;
