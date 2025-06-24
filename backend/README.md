# FutureSocial Backend

## Features
- RESTful API for users, posts, authentication
- MongoDB with Mongoose
- JWT-based authentication
- User following/followers
- Emoji reactions and comments
- **Paging/Infinite Scroll**: The `/api/posts` endpoint supports `page` and `limit` query parameters for efficient pagination. The frontend implements infinite scroll, loading more posts as the user scrolls down.
- **Seeding**: The `seed-data.js` script creates 37 unique Indian users, each with unique avatars, and 2-3 posts per user. About 70% of posts have unique images, and post texts are varied and natural.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your MongoDB URI in `.env` as `MONGODB_URI=...` or edit `seed-data.js` directly.
3. Start the server:
   ```bash
   npm start
   ```
4. (Optional) Seed the database:
   ```bash
   node seed-data.js
   ```

## API Endpoints
- `GET /api/posts?page=1&limit=10` - Get paginated posts
- `GET /api/users/:id` - Get user profile
- ...

---
For more, see the code and comments in each file.
