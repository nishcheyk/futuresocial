// Removed all bookmark logic and UI from Profile.jsx. No further bookmark code remains.

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../ccss/Profile.module.css';
import '../ccss/Modal.css';
import Loader from '../components/Loader';
import Feed from './Feed';
import feedStyles from '../ccss/Feed.module.css';

function Modal({ title, list, onClose }) {
  React.useEffect(() => {
    // Prevent background scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <ul className="modal-list">
          {list.length === 0 ? (
            <li style={{textAlign:'center',color:'#888'}}>No users found.</li>
          ) : (
            list.map(f => (
              <li key={f._id} className="modal-list-item">
                <a href={`/profile/${f._id}`}>{f.name}</a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', profilePic: '' });
  const [bioCount, setBioCount] = useState(0);
  const [error, setError] = useState('');
  const [badges, setBadges] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [modalOpen, setModalOpen] = useState(null); // 'followers' | 'following' | null
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:5000/api/users/${id}`);
        if (!isMounted) return;
        setUserData(userRes.data);
        setForm({ name: userRes.data.name, bio: userRes.data.bio, profilePic: userRes.data.profilePic });
        setBioCount(userRes.data.bio ? userRes.data.bio.length : 0);
        setBadges(userRes.data.badges || []);
        setIsFollowing((userRes.data.followers || []).includes(user?.id) || (userRes.data.followers || []).includes(user?._id));
      } catch (err) {
        setError('Could not load user profile. Network error.');
      }
      try {
        const followersRes = await axios.get(`http://localhost:5000/api/users/${id}/followers`);
        if (isMounted) setFollowers(followersRes.data);
      } catch (err) {
        if (isMounted) setFollowers([]);
      }
      try {
        const followingRes = await axios.get(`http://localhost:5000/api/users/${id}/following`);
        if (isMounted) setFollowing(followingRes.data);
      } catch (err) {
        if (isMounted) setFollowing([]);
      }
      // Fetch posts for the profile being viewed (not just current user)
      try {
        const postsRes = await axios.get(`http://localhost:5000/api/posts`);
        if (isMounted) setUserPosts(postsRes.data.filter(p => p.userId._id === id || p.userId === id));
      } catch (err) {
        if (isMounted) setUserPosts([]);
      }
    };
    fetchData();
    return () => { isMounted = false; };
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

  const handleFollow = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/${id}/${isFollowing ? 'unfollow' : 'follow'}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setIsFollowing(!isFollowing);
      // Refresh followers and following sequentially
      const [followersRes, followingRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/users/${id}/followers`),
        axios.get(`http://localhost:5000/api/users/${id}/following`)
      ]);
      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // Add dummy handlers for comments to avoid errors (or connect to backend if needed)
  const handleCommentChange = () => {};
  const handleAddComment = () => {};
  const handleLike = () => {};
  const handleDislike = () => {};
  const handleEmoji = () => {};
  const handleView = () => {};

  // Helper to render a post like in Feed
  const renderFeedPost = (post) => {
    const emojiMap = {};
    (post.emojiReactions || []).forEach(r => { emojiMap[r.emoji] = r.users.length; });
    const userEmojis = (post.emojiReactions || []).filter(r => r.users.includes(user?.id) || r.users.includes(user?._id)).map(r => r.emoji);
    return (
      <div key={post._id} className={feedStyles['post-card']} style={{position:'relative'}}>
        <div className={feedStyles['post-header']} style={{position:'relative'}}>
          <img src={post.userId.profilePic || '/default-avatar.png'} alt="avatar" className={feedStyles['avatar']} />
          <a href={`/profile/${post.userId._id}`}>{post.userId.name}</a>
          <span style={{position:'absolute', top:0, right:0, fontSize:'1.05em', color:'#ffe082', fontWeight:500, paddingRight:'0.5em'}}>
            👁 {post.viewCount || 0}
          </span>
        </div>
        <p>{post.content}</p>
        {post.imageUrl && <img src={post.imageUrl} alt="post" className={feedStyles['post-image']} />}
        <div className={feedStyles['post-actions']}>
          <button>👏 {post.likeCount}</button>
          <button>👎 {post.dislikeCount || 0}</button>
        </div>
      </div>
    );
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
        <div style={{marginBottom:'1em', display:'flex', justifyContent:'center', gap:'2em'}}>
          <div style={{cursor:'pointer'}} onClick={() => setModalOpen('followers')}>
            <b>Followers:</b> {followers.length}
          </div>
          <div style={{cursor:'pointer'}} onClick={() => setModalOpen('following')}>
            <b>Following:</b> {following.length}
          </div>
        </div>
        {user?.id !== id && (
          <button className="btn" onClick={handleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
        )}
        {badges.length > 0 && (
          <div style={{margin:'1em 0'}}>
            <b>Badges:</b> {badges.map((b,i) => <span key={i} style={{background:'#ffeba7',color:'#5e6681',borderRadius:4,padding:'0.2em 0.6em',marginRight:4}}>{b}</span>)}
          </div>
        )}
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
              <div className="button-row">
                <button className="btn" type="submit">Save</button>
                <button className="btn" type="button" onClick={() => { setEditing(false); setForm({ name: userData.name, bio: userData.bio, profilePic: userData.profilePic }); setError(''); }}>Cancel</button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          ) : null
        ) : (
          user?.id === id && <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
        )}
        {user?.id === id && (
          null // Removed profile-tabs for bookmarks
        )}
      </div>
      <div className="profile-posts-section" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <div style={{width:'100%', maxWidth:'600px'}}>
          <h3 style={{textAlign:'center'}}>{user?.id === id ? 'My Posts' : `${userData?.name || ''}'s Posts`}</h3>
          {userPosts.length === 0 ? (
            <div className="profile-empty">No posts yet.</div>
          ) : (
            <div className="profile-posts-list">
              {userPosts.map(post => renderFeedPost(post))}
            </div>
          )}
        </div>
      </div>
      {modalOpen === 'followers' && (
        <Modal title="Followers" list={followers} onClose={() => setModalOpen(null)} />
      )}
      {modalOpen === 'following' && (
        <Modal title="Following" list={following} onClose={() => setModalOpen(null)} />
      )}
    </div>
  );
}
