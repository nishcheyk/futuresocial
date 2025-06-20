import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../ccss/Feed.module.css';
import Loader from '../components/Loader';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({}); // local comments for demo
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      });
  }, []);

  const handleLike = async (id) => {
    await axios.post(`http://localhost:5000/api/posts/${id}/like`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setPosts(posts => posts.map(post => post._id === id ? { ...post, likeCount: post.likeCount + 1 } : post));
  };

  const handleDislike = async (id) => {
    await axios.post(`http://localhost:5000/api/posts/${id}/dislike`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setPosts(posts => posts.map(post => post._id === id ? { ...post, dislikeCount: (post.dislikeCount || 0) + 1 } : post));
  };

  const handleCommentChange = (id, value) => {
    setCommentInputs(inputs => ({ ...inputs, [id]: value }));
  };

  const handleAddComment = (id) => {
    if (!commentInputs[id]) return;
    setComments(c => ({ ...c, [id]: [...(c[id] || []), { text: commentInputs[id], user: user?.name || 'Anonymous' }] }));
    setCommentInputs(inputs => ({ ...inputs, [id]: '' }));
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'40vh'}}><Loader /></div>;

  return (
    <div className={styles['feed-container']}>
      <h2>Global Feed</h2>
      {user && <Link to="/create">Create Post</Link>}
      <div className={styles['posts-list']}>
        {posts.map(post => (
          <div key={post._id} className={styles['post-card']}>
            <div className={styles['post-header']}>
              <img src={post.userId.profilePic || '/default-avatar.png'} alt="avatar" className={styles['avatar']} />
              <Link to={`/profile/${post.userId._id}`}>{post.userId.name}</Link>
            </div>
            <p>{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="post" className={styles['post-image']} />}
            <div className={styles['post-actions']}>
              <button onClick={() => handleLike(post._id)}>👏 {post.likeCount}</button>
              <button onClick={() => handleDislike(post._id)}>👎 {post.dislikeCount || 0}</button>
              <button onClick={() => {}} disabled>💬 Comment</button>
            </div>
            <div className={styles['comments-section']}>
              {(comments[post._id] || []).map((c, i) => (
                <div key={i} className={styles['comment']}><b>{c.user}:</b> {c.text}</div>
              ))}
              {user && (
                <form className={styles['add-comment-form']} onSubmit={e => { e.preventDefault(); handleAddComment(post._id); }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post._id] || ''}
                    onChange={e => handleCommentChange(post._id, e.target.value)}
                  />
                  <button type="submit">Post</button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
