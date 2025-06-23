# 🌐 FutureSocial

FutureSocial is a lightweight social media web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It provides core features of a social network — such as profile creation, post sharing, emoji reactions, and following — wrapped in a clean and responsive UI.

---

## 🚀 Key Features

- 🔐 **User Authentication**: Signup and login with JWT-based authentication.
- 👤 **User Profiles**: Create and edit profiles with name, bio, and profile picture.
- 📝 **Post Creation**: Create posts with optional image URLs.
- 😊 **Emoji Reactions**: React to posts using various emojis (like, love, wow, etc.).
- 💬 **Commenting**: Add comments to posts, like comments.
- 👥 **Followers System**: Follow/unfollow users and view follower/following lists.
- 📈 **Post View Count**: Tracks how many times each post has been viewed.
- 📱 **Responsive UI**: Clean, modular, and responsive design.

---

## 🛠️ Technologies Used

### Frontend
- React.js
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

### 📦 1. Clone the Repository

```bash
git clone https://github.com/nishcheyk/futuresocial.git
cd futuresocial
```

---

### 🚀 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Then start the backend server:

```bash
npm run dev
```

---

### 💻 3. Setup Frontend

In a separate terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

Then start the frontend server:

```bash
npm start
```

Your app should now be running at `http://localhost:3000`.

---

## 🌍 Deployment Notes

To deploy to platforms like **Render**, **Vercel**, or **Netlify**:

- Ensure environment variables are set correctly in your platform dashboard.
- Replace all `localhost` URLs with `process.env.REACT_APP_API_URL` in frontend.
- Use `npm run build` in frontend for production builds.
- Use `serve` or configure your backend to serve static files.

---

## 🚧 Limitations & Known Issues

- ❌ No image **upload** support; only image **URLs** allowed.
- 🚫 Emoji reactions are count-based only; not per-user tracking yet.
- 📱 Some layout issues on very small screens.

---

## 🤝 Contributing

Contributions are welcome. Please open issues or submit PRs for any improvements or bug fixes.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Nishchey Khajuria**
GitHub: [@nishcheyk](https://github.com/nishcheyk)
Project: [FutureSocial](https://github.com/nishcheyk/futuresocial)