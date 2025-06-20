import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../ccss/PostCreate.module.css';

export default function PostCreate() {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // TODO: Replace with custom auth state
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/posts', { content, imageUrl }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className={styles['post-create-container']}>
      <div className="title">Create Post</div>
      <form onSubmit={handleSubmit} className={styles['post-create-form']}>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" required />
        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (optional)" />
        <button type="submit">Post</button>
        {error && <div className={styles['error-message']}>{error}</div>}
      </form>
    </div>
  );
}
