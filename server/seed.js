import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expert from './models/Expert.js';

dotenv.config();

// Generate available slots for the next 7 days
const generateSlots = () => {
  const slots = [];
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    slots.push({ date: dateStr, times: [...times] });
  }
  return slots;
};

const experts = [
  {
    name: 'Dr. Priya Sharma',
    category: 'Technology',
    experience: 8,
    rating: 4.9,
    bio: 'Senior software architect with expertise in cloud computing, microservices, and system design. Ex-Google engineer passionate about scalable systems.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    availableSlots: generateSlots(),
  },
  {
    name: 'Rahul Mehta',
    category: 'Finance',
    experience: 12,
    rating: 4.8,
    bio: 'Certified financial planner and investment advisor. Specializes in personal finance, portfolio management, and tax optimization strategies.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    availableSlots: generateSlots(),
  },
  {
    name: 'Dr. Ananya Patel',
    category: 'Health',
    experience: 15,
    rating: 4.9,
    bio: 'Nutritionist and wellness coach helping individuals achieve optimal health through personalized diet plans and lifestyle changes.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    availableSlots: generateSlots(),
  },
  {
    name: 'Vikram Singh',
    category: 'Legal',
    experience: 10,
    rating: 4.7,
    bio: 'Corporate lawyer specializing in startup law, intellectual property, and contract negotiations. Helped 200+ startups with legal compliance.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    availableSlots: generateSlots(),
  },
  {
    name: 'Neha Gupta',
    category: 'Marketing',
    experience: 7,
    rating: 4.6,
    bio: 'Digital marketing strategist with expertise in SEO, social media, and growth hacking. Has grown brands from 0 to 1M users.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
    availableSlots: generateSlots(),
  },
  {
    name: 'Arjun Nair',
    category: 'Technology',
    experience: 6,
    rating: 4.7,
    bio: 'Full-stack developer and AI enthusiast. Specializes in React, Node.js, and machine learning applications. Open source contributor.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    availableSlots: generateSlots(),
  },
  {
    name: 'Dr. Meera Iyer',
    category: 'Health',
    experience: 20,
    rating: 5.0,
    bio: 'Sports psychologist and mental performance coach. Works with athletes and professionals to overcome mental blocks and achieve peak performance.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
    availableSlots: generateSlots(),
  },
  {
    name: 'Sanjay Kapoor',
    category: 'Finance',
    experience: 9,
    rating: 4.5,
    bio: 'Startup mentor and venture capital advisor. Angel investor in 30+ startups. Expertise in fundraising, pitch decks, and growth strategy.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay',
    availableSlots: generateSlots(),
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await Expert.deleteMany({});
  console.log('🗑  Cleared existing experts');

  await Expert.insertMany(experts);
  console.log(`🌱 Seeded ${experts.length} experts successfully`);

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});