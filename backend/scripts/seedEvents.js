const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const sampleEvents = [
  {
    title: 'Summer Music Festival 2024',
    description: 'Join us for an amazing summer music festival featuring top artists from around the world. Experience live performances, food trucks, and an unforgettable atmosphere.',
    category: 'concert',
    date: new Date('2024-07-15'),
    time: '18:00',
    venue: {
      name: 'Central Park Amphitheater',
      address: '123 Park Avenue',
      city: 'New York'
    },
    totalTickets: 5000,
    availableTickets: 5000,
    price: 75.00,
    organizer: 'Music Events Inc.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    status: 'active'
  },
  {
    title: 'Tech Innovation Conference 2024',
    description: 'A premier technology conference bringing together industry leaders, innovators, and entrepreneurs. Learn about the latest trends in AI, blockchain, and cloud computing.',
    category: 'conference',
    date: new Date('2024-08-20'),
    time: '09:00',
    venue: {
      name: 'Convention Center',
      address: '456 Tech Boulevard',
      city: 'San Francisco'
    },
    totalTickets: 1000,
    availableTickets: 1000,
    price: 299.00,
    organizer: 'Tech Summit Organizers',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    status: 'active'
  },
  {
    title: 'Web Development Workshop',
    description: 'Hands-on workshop covering modern web development techniques. Learn React, Node.js, and best practices from industry experts.',
    category: 'workshop',
    date: new Date('2024-06-10'),
    time: '10:00',
    venue: {
      name: 'Tech Hub',
      address: '789 Innovation Street',
      city: 'Seattle'
    },
    totalTickets: 50,
    availableTickets: 50,
    price: 149.00,
    organizer: 'Code Academy',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    status: 'active'
  },
  {
    title: 'Basketball Championship Finals',
    description: 'Watch the thrilling finals of the national basketball championship. Experience the excitement of live sports with the best teams competing for the title.',
    category: 'sports',
    date: new Date('2024-09-05'),
    time: '19:30',
    venue: {
      name: 'Sports Arena',
      address: '321 Stadium Road',
      city: 'Los Angeles'
    },
    totalTickets: 20000,
    availableTickets: 20000,
    price: 125.00,
    organizer: 'Sports League',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800',
    status: 'active'
  },
  {
    title: 'Broadway Musical: The Phantom',
    description: 'Experience the magic of Broadway with this spectacular musical production. A timeless story brought to life with stunning performances and sets.',
    category: 'theater',
    date: new Date('2024-07-25'),
    time: '20:00',
    venue: {
      name: 'Grand Theater',
      address: '654 Broadway Avenue',
      city: 'New York'
    },
    totalTickets: 800,
    availableTickets: 800,
    price: 150.00,
    organizer: 'Broadway Productions',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    status: 'active'
  },
  {
    title: 'Food & Wine Festival',
    description: 'Indulge in a culinary journey featuring world-class chefs, wine tastings, and cooking demonstrations. A must-attend event for food enthusiasts.',
    category: 'other',
    date: new Date('2024-08-12'),
    time: '12:00',
    venue: {
      name: 'Riverside Park',
      address: '987 Culinary Way',
      city: 'Chicago'
    },
    totalTickets: 2000,
    availableTickets: 2000,
    price: 85.00,
    organizer: 'Culinary Events',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    status: 'active'
  }
];

const seedEvents = async () => {
  try {
    // Get the first admin user or create a default admin
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      console.log('To create an admin user:');
      console.log('1. Register a user through the frontend');
      console.log('2. In MongoDB, update the user role to "admin"');
      console.log('   db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })');
      process.exit(1);
    }

    // Clear existing events (optional - comment out if you want to keep existing events)
    // await Event.deleteMany({});

    // Add createdBy to each event
    const eventsWithCreator = sampleEvents.map(event => ({
      ...event,
      createdBy: adminUser._id
    }));

    // Insert events
    const createdEvents = await Event.insertMany(eventsWithCreator);
    
    console.log(`✅ Successfully created ${createdEvents.length} events!`);
    console.log('\nEvents created:');
    createdEvents.forEach(event => {
      console.log(`- ${event.title} (${event.category})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
};

// Run the seed function
seedEvents();

