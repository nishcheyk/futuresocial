import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../ccss/NavBar.css';

export default function NavBar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.id;
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <Link to="/feed" className="navbar-logo">FutureSocial</Link>
      <div className="navbar-links">
        <Link to="/feed">Feed</Link>
        {user && <Link to="/create">Create Post</Link>}
        {user && userId && <Link to={`/profile/${userId}`}>Profile</Link>}
      </div>
      <div className="navbar-user">
        {user ? (
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link className="nav-btn" to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
