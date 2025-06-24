# FutureSocial

A modern, Indian-themed social media app with infinite scroll, emoji reactions, following, and more.

## Features
- Modern React frontend (Vite)
- Express + MongoDB backend
- JWT authentication
- User following/followers
- Emoji reactions, comments, and post view counts
- **Infinite Scroll/Paging**: Feed and profile pages load posts as you scroll, using backend pagination (`page` and `limit` query params)
- **Seeding**: The backend seeding script creates 37 unique Indian users, each with unique avatars, and 2-3 posts per user. About 70% of posts have unique images, and post texts are varied and natural.

## Known Issues
- When scrolling down, the loader sometimes appears on the right instead of centered. (UI bug)

## Setup
### Backend
1. `cd backend`
2. Install dependencies: `npm install`
3. Set your MongoDB URI in `.env` as `MONGODB_URI=...` or edit `seed-data.js` directly.
4. Start the server: `npm start`
5. (Optional) Seed the database: `node seed-data.js`

### Frontend
1. `cd frontend`
2. Install dependencies: `npm install`
3. Set your backend API URL in `.env` as `VITE_API_URL=...`
4. Start the frontend: `npm run dev`

---
For more, see the code and comments in each file.
