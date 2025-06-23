import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../ccss/Signup.css';
import '../ccss/AuthForm.css';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <form className="card signup-form" onSubmit={handleSubmit}>
        <div className="title">Sign Up</div>
        <div className="field">
          <input className="input-field" type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="field">
          <input className="input-field" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="field">
          <input className="input-field" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="btn" type="submit">Sign Up</button>
        <Link className="btn-link" to="/login">Already have an account? Login</Link>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}
