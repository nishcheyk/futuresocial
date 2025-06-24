# 🌐 FutureSocial

FutureSocial is a lightweight, Indian-themed social media web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It provides core features of a social network — such as profile creation, post sharing, emoji reactions, and following — wrapped in a clean and responsive UI.

---

## 🚀 Key Features

- 🔐 **User Authentication**: Signup and login with JWT-based authentication.
- 👤 **User Profiles**: Create and edit profiles with name, bio, and profile picture.
- 📝 **Post Creation**: Create posts with optional image URLs.
- 😊 **Emoji Reactions**: React to posts using various emojis (like, love, wow, etc.).
- 💬 **Commenting**: Add comments to posts and like comments.
- 👥 **Followers System**: Follow/unfollow users and view follower/following lists.
- 📈 **Post View Count**: Tracks how many times each post has been viewed.
- **Infinite Scroll/Paging (Post Fragmentation)**: The feed and profile pages load posts in fragments as you scroll, using the backend's `page` and `limit` query parameters for efficient pagination.
- 📱 **Responsive UI**: Clean, modular, and responsive design.

---

## 🛠️ Technologies Used

### Frontend
- React.js (with Vite)
- React Router DOM
- Axios
- React Icons
- CSS Modules + custom CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcrypt.js
- CORS
- dotenv

---

## ⚙️ Project Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/futuresocial.git
cd futuresocial
```

### 2. Setup & Run Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following content:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
```
*Replace `your_mongodb_connection_string` and `your_secret_key_for_jwt` with your actual credentials.*

Then, start the backend server:

```bash
npm run dev
```

The backend will be running on `http://localhost:5000`.

### 3. Setup & Run Frontend

In a **new terminal**, navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory with the following content:

```env
VITE_API_URL=http://localhost:5000
```
*This should match the URL where your backend is running.*

Then, start the frontend development server:

```bash
npm run dev
```

Your app should now be running and accessible at `http://localhost:3000` (or another port specified by Vite).

---

## 🌍 Deployment Notes

To deploy this project to platforms like **Render**, **Vercel**, or **Heroku**:

- Ensure all necessary environment variables (like `MONGODB_URI`, `JWT_SECRET`, `VITE_API_URL`) are set correctly in your deployment platform's dashboard.
- For the frontend, run `npm run build` to create a production-ready build in the `dist` folder.
- Configure your backend server to serve the static files from the frontend's `dist` folder, or deploy the frontend and backend as separate services.

---

## 🚧 Limitations & Known Issues

- ❌ **No Image Upload**: The application currently supports linking to images via URLs, but does not have a direct file upload feature.
- 🚫 **Emoji Reactions**: Emoji reactions are count-based only and do not yet track which specific users have reacted.
- 🐛 **UI Bug**: When scrolling down the feed or profile pages, the loading spinner sometimes appears on the right side of the screen instead of being centered.
- 📱 **Responsiveness**: While generally responsive, some layout issues may occur on very small screen sizes.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find any bugs, please feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**.
