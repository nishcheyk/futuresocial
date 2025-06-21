// Removed all bookmark logic and UI from Feed.jsx. No further bookmark code remains

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../ccss/Feed.module.css';
import Loader from '../components/Loader';
import FeedPostCard from '../components/FeedPostCard';

const EMOJIS = ['👏', '😂', '❤️', '😮', '🔥'];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAllComments, setShowAllComments] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:5000/api/posts');
    setPosts(res.data);
    setLoading(false);
  };

  const handleLike = async (id) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/posts/${id}/like`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setPosts(posts => posts.map(post => post._id === id ? { ...post, likeCount: post.likeCount + 1 } : post));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setShowLoginPrompt(true);
      } else {
        alert('Failed to like post. Please try again.');
      }
    }
  };

  const handleDislike = async (id) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/posts/${id}/dislike`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setPosts(posts => posts.map(post => post._id === id ? { ...post, dislikeCount: (post.dislikeCount || 0) + 1 } : post));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setShowLoginPrompt(true);
      } else {
        alert('Failed to dislike post. Please try again.');
      }
    }
  };

  const handleEmoji = async (id, key) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    await axios.post(`http://localhost:5000/api/posts/${id}/emoji`, { emoji: key }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    // Refetch posts for updated reactions
    const res = await axios.get('http://localhost:5000/api/posts');
    setPosts(res.data);
  };

  const handleView = async (id) => {
    await axios.post(`http://localhost:5000/api/posts/${id}/view`);
    setPosts(posts => posts.map(post => post._id === id ? { ...post, viewCount: (post.viewCount || 0) + 1 } : post));
  };

  const handleCommentChange = (id, value) => {
    setCommentInputs(inputs => ({ ...inputs, [id]: value }));
  };

  const handleLikeComment = async (postId, commentIdx) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/comment/${commentIdx}/like`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      await fetchPosts();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setShowLoginPrompt(true);
      } else {
        alert('Failed to like comment. Please try again.');
      }
    }
  };

  const handleAddComment = async (id, commentIdx, action) => {
    if (action === 'likeComment') {
      await handleLikeComment(id, commentIdx);
      return;
    }
    if (!commentInputs[id]) return;
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/posts/${id}/comment`, { text: commentInputs[id] }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setCommentInputs(inputs => ({ ...inputs, [id]: '' }));
      await fetchPosts();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setShowLoginPrompt(true);
      } else {
        alert('Failed to add comment. Please try again.');
      }
    }
  };

  // Show more/less comments handlers
  const handleShowMoreComments = (postId) => setShowAllComments(s => ({ ...s, [postId]: true }));
  const handleShowLessComments = (postId) => setShowAllComments(s => ({ ...s, [postId]: false }));

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'40vh'}}><Loader /></div>;

  // Helper to highlight mentions
  const highlightMentions = (text, mentions, users) => {
    if (!mentions || !users) return text;
    let result = text;
    users.forEach(u => {
      result = result.replace(new RegExp(`@${u.name}`, 'g'), `<b style="color:#ffeba7">@${u.name}</b>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className={styles['feed-container']}>
      {showLoginPrompt && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setShowLoginPrompt(false)}>
          <div style={{background:'#23243a',padding:'2em 2.5em',borderRadius:12,boxShadow:'0 4px 24px #000',color:'#fff',minWidth:280,textAlign:'center'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{marginBottom:'1em'}}>Login Required</h3>
            <p style={{marginBottom:'1.5em'}}>Please log in to interact with posts.</p>
            <Link to="/login" className="btn" style={{background:'#ffeba7',color:'#23243a',padding:'0.6em 1.5em',borderRadius:6,fontWeight:600,textDecoration:'none'}}>Go to Login</Link>
            <div style={{marginTop:'1.2em'}}>
              <button className="btn" style={{background:'#23243a',color:'#ffeba7',border:'1px solid #ffeba7',padding:'0.5em 1.2em',borderRadius:6}} onClick={()=>setShowLoginPrompt(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <h2>Global Feed</h2>
      {user && <Link to="/create">Create Post</Link>}
      <div className={styles['posts-list']}>
        {posts.map(post => (
          <FeedPostCard
            key={post._id}
            post={post}
            user={user}
            onLike={handleLike}
            onDislike={handleDislike}
            onEmoji={handleEmoji}
            onView={handleView}
            onAddComment={handleAddComment}
            onCommentChange={handleCommentChange}
            commentInput={commentInputs[post._id] || ''}
            showAllComments={!!showAllComments[post._id]}
            setShowAllComments={showAllComments[post._id] ? () => handleShowLessComments(post._id) : () => handleShowMoreComments(post._id)}
          />
        ))}
      </div>
    </div>
  );
}
