import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Car.js';

dotenv.config();

const cars = [
  {
    title: "2023 Porsche 911 GT3 RS",
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2023,
    price: 275000,
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    description: "The 911 GT3 RS is designed for maximum performance. Featuring a 4.0-liter naturally aspirated boxer engine producing 518 horsepower, carbon fiber components throughout, and advanced active aerodynamics. Fully optioned with Weissach Package and ceramic composite brakes."
  },
  {
    title: "2024 Tesla Model S Plaid",
    brand: "Tesla",
    model: "Model S Plaid",
    year: 2024,
    price: 89990,
    fuelType: "Electric",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    description: "0-60 mph in 1.99s. Tri-motor all-wheel drive generating 1,020 horsepower. Features the yoke steering wheel, ultra-premium audio system, 396-mile estimated range, and full self-driving capability computer. Pristine condition with solid black exterior and white premium interior."
  },
  {
    title: "2022 BMW M4 Competition Coupe",
    brand: "BMW",
    model: "M4 Competition",
    year: 2022,
    price: 74900,
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    description: "A precision driving machine. Powered by a 3.0L twin-turbo inline 6-cylinder engine making 503 horsepower, mated to an 8-speed M Steptronic transmission. Features Isle of Man Green metallic paint, Kyalami Orange full Merino leather, and carbon fiber bucket seats."
  },
  {
    title: "2023 Audi RS e-tron GT",
    brand: "Audi",
    model: "RS e-tron GT",
    year: 2023,
    price: 119500,
    fuelType: "Electric",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    description: "Audi's flagship electric grand tourer. Delivering up to 637 horsepower in boost mode, with dual synchronous electric motors and e-quattro AWD. Finished in Daytona Gray pearl with dynamic air suspension, carbon fiber roof, and ventilated sport seats."
  },
  {
    title: "2024 Land Rover Range Rover Sport",
    brand: "Land Rover",
    model: "Range Rover Sport",
    year: 2024,
    price: 96000,
    fuelType: "Hybrid",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
    description: "Luxury meets capability. Dynamic SE model featuring a mild-hybrid turbocharged inline-6 engine, air suspension, panoramic sunroof, and state-of-the-art Pivi Pro infotainment. Gorgeous Eiger Grey exterior with Ebony Windsor leather interior."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/car_marketplace');
    console.log('Connected to MongoDB for seeding...');
    
    // Drop collection to clear old unique indexes (like id_1)
    try {
      await Car.collection.drop();
      console.log('Dropped cars collection and cleared old indexes.');
    } catch (err) {
      // Collection might not exist yet, safe to ignore
      await Car.deleteMany({});
      console.log('Cleared cars collection.');
    }

    // Save cars sequentially to trigger pre-save hook IDs in order (1, 2, 3, 4, 5)
    for (const carData of cars) {
      const car = new Car(carData);
      await car.save();
      console.log(`Saved: ${car.title} with sequential carId: ${car.carId}`);
    }

    console.log('Successfully seeded database with sequential carId fields!');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
