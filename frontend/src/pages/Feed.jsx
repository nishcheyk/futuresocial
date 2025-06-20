import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../ccss/Feed.module.css';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // TODO: Replace with custom auth state
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      });
  }, []);

  const handleLike = async (id) => {
    await axios.post(`http://localhost:5000/api/posts/${id}/like`);
    setPosts(posts => posts.map(post => post._id === id ? { ...post, likeCount: post.likeCount + 1 } : post));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles['feed-container']}>
      <h2>Global Feed</h2>
      <Link to="/create">Create Post</Link>
      <div className={styles['posts-list']}>
        {posts.map(post => (
          <div key={post._id} className={styles['post-card']}>
            <div className={styles['post-header']}>
              <img src={post.userId.profilePic || '/default-avatar.png'} alt="avatar" className={styles['avatar']} />
              <Link to={`/profile/${post.userId._id}`}>{post.userId.name}</Link>
            </div>
            <p>{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="post" className={styles['post-image']} />}
            <button onClick={() => handleLike(post._id)}>👏 {post.likeCount}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
