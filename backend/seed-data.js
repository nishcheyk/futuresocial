import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

const indianNames = [
  'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Vihaan Reddy', 'Arjun Mehra',
  'Sai Iyer', 'Reyansh Nair', 'Ayaan Gupta', 'Krishna Das', 'Ishaan Joshi',
  'Kabir Kapoor', 'Dhruv Jain', 'Rohan Sinha', 'Anaya Rao', 'Diya Verma',
  'Myra Menon', 'Aadhya Pillai', 'Anika Chatterjee', 'Pari Shah', 'Saanvi Bhat',
  'Aarohi Kulkarni', 'Navya Shetty', 'Ira Dutta', 'Ishita Ghosh', 'Prisha Paul',
  'Riya Chakraborty', 'Aarav Singh', 'Priya Sharma', 'Siddharth Yadav', 'Tanvi Desai',
  'Meera Rathi', 'Lakshya Malhotra', 'Yash Agarwal', 'Nisha Pandey', 'Amitabh Joshi',
  'Spark My Dog'
];

const profilePics = [
  'https://randomuser.me/api/portraits/men/31.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/33.jpg',
  'https://randomuser.me/api/portraits/men/34.jpg',
  'https://randomuser.me/api/portraits/men/35.jpg',
  'https://randomuser.me/api/portraits/men/36.jpg',
  'https://randomuser.me/api/portraits/men/37.jpg',
  'https://randomuser.me/api/portraits/men/38.jpg',
  'https://randomuser.me/api/portraits/men/39.jpg',
  'https://randomuser.me/api/portraits/men/40.jpg',
  'https://randomuser.me/api/portraits/women/31.jpg',
  'https://randomuser.me/api/portraits/women/32.jpg',
  'https://randomuser.me/api/portraits/women/33.jpg',
  'https://randomuser.me/api/portraits/women/34.jpg',
  'https://randomuser.me/api/portraits/women/35.jpg',
  'https://randomuser.me/api/portraits/women/36.jpg',
  'https://randomuser.me/api/portraits/women/37.jpg',
  'https://randomuser.me/api/portraits/women/38.jpg',
  'https://randomuser.me/api/portraits/women/39.jpg',
  'https://randomuser.me/api/portraits/women/40.jpg',
  'https://randomuser.me/api/portraits/men/41.jpg',
  'https://randomuser.me/api/portraits/men/42.jpg',
  'https://randomuser.me/api/portraits/men/43.jpg',
  'https://randomuser.me/api/portraits/men/44.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/women/41.jpg',
  'https://randomuser.me/api/portraits/women/42.jpg',
  'https://randomuser.me/api/portraits/women/43.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/45.jpg',
  'https://randomuser.me/api/portraits/men/46.jpg',
  'https://randomuser.me/api/portraits/men/47.jpg',
  'https://randomuser.me/api/portraits/women/46.jpg',
  'https://randomuser.me/api/portraits/women/47.jpg',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d', // Spark My Dog
];

const samplePosts = [
  'Enjoying a beautiful day in Mumbai!',
  'Just had the best chai ever!',
  'Exploring the streets of Delhi.',
  'Family time is the best time.',
  'Loving the monsoon season!',
  'Proud to be Indian!',
  'Trying out a new recipe today.',
  'Weekend vibes with friends.',
  'Visited the Taj Mahal, what a wonder!',
  'My dog Spark is the best!',
  'Working on a new project.',
  'Reading a great book.',
  'Celebrating a festival with family.',
  'Nature walks are so refreshing.',
  'Learning something new every day.'
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clean up all users and posts
  await User.deleteMany({});
  await Post.deleteMany({});
  console.log('Database cleaned!');

  let users = [];
  for (let i = 0; i < indianNames.length; i++) {
    const name = indianNames[i];
    const email = name.toLowerCase().replace(/ /g, '.') + '@example.com';
    const profilePic = profilePics[i % profilePics.length];
    const password = 'password123';
    const user = new User({
      name,
      email,
      password,
      profilePic,
      bio: `Hi, I am ${name} from India!`,
      followers: [],
      following: [],
      badges: [],
    });
    users.push(user);
  }
  await User.insertMany(users);
  console.log(`Created ${users.length} users`);

  // Add 2-3 posts for each user
  let posts = [];
  for (let user of users) {
    // Shuffle samplePosts for each user
    const shuffledPosts = [...samplePosts].sort(() => 0.5 - Math.random());
    const numPosts = Math.floor(Math.random() * 2) + 2; // 2 or 3 posts
    for (let i = 0; i < numPosts; i++) {
      const content = shuffledPosts[i]; // unique for this user
      posts.push(new Post({
        userId: user._id,
        content,
        image: '',
        likes: [],
        comments: [],
        emojiReactions: {},
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
      }));
    }
  }
  await Post.insertMany(posts);
  console.log(`Created ${posts.length} posts`);

  await mongoose.disconnect();
  console.log('🎉 Database seeding completed successfully!');
}

seed();
