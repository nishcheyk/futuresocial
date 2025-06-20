# FutureSocial Backend

This is the backend for the FutureSocial MERN stack social media platform.

## Features
- User authentication (JWT-based)
- User profile CRUD (name, profile picture, bio)
- Post creation (text/image)
- Global feed
- Like (clap) functionality (multiple likes per post, only total count stored)
- Ready for image upload integration (Cloudinary)

## Setup Instructions
1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your MongoDB Atlas and Cloudinary credentials.
3. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/posts` - Create post
- `GET /api/posts` - Get global feed
- `POST /api/posts/:id/like` - Like (clap) a post

---

Next: I will scaffold the React frontend and connect it to this backend.
