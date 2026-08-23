import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from './models/listing.model.js';

dotenv.config();

const equipments = [
  {
    name: 'Plastic Chairs (White)',
    description: 'Durable white plastic monoblock chairs suitable for community events, meetings, and outdoor gatherings. Stackable and easy to transport.',
    inventory: 100,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600',
  },
  {
    name: 'Folding Tables',
    description: 'Heavy-duty rectangular folding tables ideal for banquets, community feedings, registration areas, and outdoor events. Easy to set up and store.',
    inventory: 30,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=600',
  },
  {
    name: 'Event Tent (10x10)',
    description: 'Large pop-up canopy tents providing shade and rain protection for outdoor barangay events, health drives, and fiestas. Includes metal frame and pegs.',
    inventory: 10,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=600',
  },
  {
    name: 'Industrial Standing Fans',
    description: 'High-powered industrial standing fans for ventilation during indoor community events, assemblies, and covered court activities.',
    inventory: 15,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
  },
  {
    name: 'Sound System with Microphone',
    description: 'Portable PA sound system with wireless microphone, amplifier, and speakers. Suitable for announcements, programs, and karaoke events.',
    inventory: 5,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=600',
  },
  {
    name: 'Portable Generator',
    description: 'Gasoline-powered portable generator providing backup electricity for outdoor barangay events and emergency situations. 5000W capacity.',
    inventory: 3,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600',
  },
  {
    name: 'Traffic Cones & Barriers',
    description: 'Orange traffic cones and plastic barriers for road closures during fiestas, fun runs, barangay sports events, and emergency situations.',
    inventory: 50,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1603038344719-e69a6c204488?w=600',
  },
  {
    name: 'Cooking Pots (Large)',
    description: 'Extra-large stainless steel cooking pots for community feeding programs, fiestas, and disaster relief food preparation.',
    inventory: 10,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1585837146751-a44118595680?w=600',
  },
  {
    name: 'First Aid Kits',
    description: 'Fully stocked first aid kits containing bandages, antiseptics, pain relievers, and basic medical supplies for barangay events and emergencies.',
    inventory: 20,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600',
  },
  {
    name: 'Megaphones',
    description: 'Battery-powered megaphones with siren function for crowd management during evacuations, community events, and public announcements.',
    inventory: 8,
    type: 'equipment',
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600',
  },
];

const facilities = [
  {
    name: 'Barangay Basketball Court',
    description: 'Full-size outdoor basketball court with lighting, bleachers, and covered sideline area. Available for sports leagues, practices, and community recreation.',
    inventory: 1,
    address: 'Barangay Sports Complex, Zone 1',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1505666287802-931dc83948e5?w=600',
  },
  {
    name: 'Community Event Hall',
    description: 'Air-conditioned multi-purpose event hall with stage, seating for 200, restrooms, and basic sound system. Ideal for assemblies, seminars, and celebrations.',
    inventory: 1,
    address: 'Barangay Hall Building, 2nd Floor, Zone 2',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600',
  },
  {
    name: 'Covered Court',
    description: 'Multi-purpose covered court with concrete flooring and metal roof. Suitable for sports, community meetings, and evacuation staging.',
    inventory: 1,
    address: 'Barangay Covered Court, Zone 3',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?w=600',
  },
  {
    name: 'Barangay Health Center',
    description: 'Fully equipped health center with consultation room, dental area, and pharmacy. Available for medical missions and free health check-ups.',
    inventory: 1,
    address: 'Barangay Health Center, Zone 1',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
  },
  {
    name: 'Day Care Center',
    description: 'Child-friendly day care facility with play area, learning materials, and feeding area. Available for children\'s programs and tutorial sessions.',
    inventory: 1,
    address: 'Barangay Day Care, Zone 4',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600',
  },
  {
    name: 'Community Garden',
    description: 'Shared urban garden space with individual plots, tool shed, and water supply. Available for residents interested in urban farming and food sustainability.',
    inventory: 1,
    address: 'Barangay Community Garden, Zone 5',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
  },
  {
    name: 'Senior Citizens\' Lounge',
    description: 'Comfortable lounge area for senior citizens with seating, TV, reading materials, and basic exercise equipment. Open daily for socialization.',
    inventory: 1,
    address: 'Barangay Hall, Ground Floor, Zone 2',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
  },
  {
    name: 'Barangay Chapel',
    description: 'Small community chapel available for prayer meetings, worship services, and spiritual gatherings. Seats up to 80 people.',
    inventory: 1,
    address: 'Barangay Chapel, Zone 6',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600',
  },
  {
    name: 'Open Field / Plaza',
    description: 'Large open grass field suitable for outdoor concerts, fiestas, fun runs, sports tournaments, and community-wide celebrations.',
    inventory: 1,
    address: 'Barangay Central Plaza, Zone 1',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=600',
  },
  {
    name: 'Computer Learning Center',
    description: 'Computer lab with 15 desktops, internet access, and printing services. Available for students, job seekers, and digital literacy programs.',
    inventory: 1,
    address: 'Barangay Hall, Room 3, Zone 2',
    type: 'facility',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  },
];

const seedListings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing listings
    await Listing.deleteMany({});
    console.log('Cleared existing listings.');

    // Insert all listings
    const allListings = [...equipments, ...facilities];
    const inserted = await Listing.insertMany(allListings);
    console.log(`Successfully seeded ${inserted.length} listings:`);
    console.log(`  - ${equipments.length} equipment items`);
    console.log(`  - ${facilities.length} facility items`);

    await mongoose.connection.close();
    console.log('MongoDB connection closed. Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding listings:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedListings();
