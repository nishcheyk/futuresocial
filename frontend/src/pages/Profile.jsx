import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../ccss/Profile.module.css';
import Loader from '../components/Loader';

export default function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', profilePic: '' });
  const [bioCount, setBioCount] = useState(0);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${id}`)
      .then(res => {
        setUserData(res.data);
        setForm({ name: res.data.name, bio: res.data.bio, profilePic: res.data.profilePic });
        setBioCount(res.data.bio ? res.data.bio.length : 0);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'bio') setBioCount(value.length);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (form.bio.length > 160) {
      setError('Bio must be 160 characters or less.');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setEditing(false);
      setUserData({ ...userData, ...form });
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (!userData) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'40vh'}}><Loader /></div>;

  return (
    <div className="profile-outer">
      <div className="card">
        <img
          src={editing ? (form.profilePic || '/default-avatar.png') : (userData.profilePic || '/default-avatar.png')}
          alt="avatar"
          className="avatar-large"
        />
        <div className="title">{userData.name}</div>
        <p>{userData.bio}</p>
        {editing ? (
          user?.id === id ? (
            <form onSubmit={handleUpdate} className="profile-form">
              <label htmlFor="name">Name</label>
              <div className="field">
                <input className="input-field" id="name" type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" maxLength={40} />
              </div>
              <label htmlFor="bio">Bio <span style={{fontSize:'0.8em',color:'#888'}}>({bioCount}/160)</span></label>
              <div className="field">
                <input className="input-field" id="bio" type="text" name="bio" value={form.bio} onChange={handleChange} placeholder="Short bio (max 160 chars)" maxLength={160} />
              </div>
              <label htmlFor="profilePic">Profile Picture URL</label>
              <div className="field">
                <input className="input-field" id="profilePic" type="text" name="profilePic" value={form.profilePic} onChange={handleChange} placeholder="Profile Pic URL" />
              </div>
              <button className="btn" type="submit">Save</button>
              <button className="btn" type="button" onClick={() => { setEditing(false); setForm({ name: userData.name, bio: userData.bio, profilePic: userData.profilePic }); setError(''); }}>Cancel</button>
              {error && <div className="error-message">{error}</div>}
            </form>
          ) : null
        ) : (
          user?.id === id && <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
}
