import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../ccss/Login.css';
import '../ccss/AuthForm.css';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <form className="card login-form" onSubmit={handleSubmit}>
        <div className="title">Login</div>
        <div className="field">
          <input className="input-field" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="field">
          <input className="input-field" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="btn" type="submit">Login</button>
        <Link className="btn-link" to="/signup">Don't have an account? Sign up</Link>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}
