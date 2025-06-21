// Removed all bookmark logic and UI from Feed.jsx. No further bookmark code remains

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../ccss/Feed.module.css';
import Loader from '../components/Loader';

const EMOJIS = ['👏', '😂', '❤️', '😮', '🔥'];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({}); // local comments for demo
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      });
  }, []);

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

  const handleEmoji = async (id, emoji, hasReacted) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    const url = `http://localhost:5000/api/posts/${id}/emoji${hasReacted ? '/remove' : ''}`;
    await axios.post(url, { emoji }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
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

  const handleAddComment = (id) => {
    if (!commentInputs[id]) return;
    setComments(c => ({ ...c, [id]: [...(c[id] || []), { text: commentInputs[id], user: user?.name || 'Anonymous' }] }));
    setCommentInputs(inputs => ({ ...inputs, [id]: '' }));
  };

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
        {posts.map(post => {
          const emojiMap = {};
          (post.emojiReactions || []).forEach(r => { emojiMap[r.emoji] = r.users.length; });
          const userEmojis = (post.emojiReactions || []).filter(r => r.users.includes(user?.id) || r.users.includes(user?._id)).map(r => r.emoji);
          return (
            <div key={post._id} className={styles['post-card']} onClick={() => handleView(post._id)}>
              <div className={styles['post-header']}>
                <img src={post.userId.profilePic || '/default-avatar.png'} alt="avatar" className={styles['avatar']} />
                <Link to={`/profile/${post.userId._id}`}>{post.userId.name}</Link>
                <span className={styles['view-count']} style={{marginLeft:'auto',fontSize:'0.98em',color:'#ffeba7'}}>👁 {post.viewCount || 0}</span>
              </div>
              <p>{highlightMentions(post.content, post.mentions, post.mentionsUsers)}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="post" className={styles['post-image']} />}
              <div className={styles['post-actions']}>
                <button onClick={e => { e.stopPropagation(); handleLike(post._id); }}>👏 {post.likeCount}</button>
                <button onClick={e => { e.stopPropagation(); handleDislike(post._id); }}>👎 {post.dislikeCount || 0}</button>
                <span className={styles['post-actions-hover']}>
                  {EMOJIS.map(emoji => {
                    const hasReacted = userEmojis.includes(emoji);
                    return <button key={emoji} className={styles['emoji-btn'] + (hasReacted ? ' ' + styles['selected'] : '')} onClick={e => { e.stopPropagation(); handleEmoji(post._id, emoji, hasReacted); }}>{emoji} {emojiMap[emoji] || 0}</button>;
                  })}
                </span>
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
          );
        })}
      </div>
    </div>
  );
}
