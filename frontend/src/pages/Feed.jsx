import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../ccss/Feed.module.css';
import Loader from '../components/Loader';
import FeedPostCard from '../components/FeedPostCard';

const API_URL = import.meta.env.VITE_API_URL;

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1profile);
  const [hasMore, setHasMore] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAllComments, setShowAllComments] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchPosts();
  }, []);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      if (window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight) {
        loadMorePosts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/posts?page=1&limit=20`);
      setPosts(res.data.posts || res.data);
      setHasMore((res.data.posts || res.data).length >= 20);
      setPage(2);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await axios.get(`${API_URL}/api/posts?page=${page}&limit=20`);
      const newPosts = res.data.posts || res.data;

      // Filter out duplicates based on post ID
      const existingIds = new Set(posts.map(post => post._id));
      const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post._id));

      setPosts(prev => [...prev, ...uniqueNewPosts]);
      setHasMore(uniqueNewPosts.length >= 20);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading more posts:', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleEmoji = async (id, key) => {
    if (!user) return setShowLoginPrompt(true);
    try {
      await axios.post(`${API_URL}/api/posts/${id}/emoji`, { emoji: key }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Refresh only this specific post
      const postRes = await axios.get(`${API_URL}/api/posts?ids=${id}`);
      const updatedPost = postRes.data[0];
      setPosts(posts => posts.map(post => post._id === id ? updatedPost : post));
    } catch (err) {
      if (err.response?.status === 401) setShowLoginPrompt(true);
      else alert('Failed to react with emoji. Please try again.');
    }
  };

  const handleView = async (id) => {
    try {
      await axios.post(`${API_URL}/api/posts/${id}/view`);
      setPosts(posts => posts.map(post => post._id === id ? {
        ...post, viewCount: (post.viewCount || 0) + 1
      } : post));
    } catch (err) {
      console.error('Error updating view count:', err);
    }
  };

  const handleCommentChange = (id, value) => {
    setCommentInputs(inputs => ({ ...inputs, [id]: value }));
  };

  const handleLikeComment = async (postId, commentIdx) => {
    if (!user) return setShowLoginPrompt(true);
    try {
      await axios.post(`${API_URL}/api/posts/${postId}/comment/${commentIdx}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Refresh only this specific post
      const postRes = await axios.get(`${API_URL}/api/posts?ids=${postId}`);
      const updatedPost = postRes.data[0];
      setPosts(posts => posts.map(post => post._id === postId ? updatedPost : post));
    } catch (err) {
      if (err.response?.status === 401) setShowLoginPrompt(true);
      else alert('Failed to like comment. Please try again.');
    }
  };

  const handleAddComment = async (id, commentIdx, action) => {
    if (action === 'likeComment') return await handleLikeComment(id, commentIdx);
    if (!commentInputs[id]) return;
    if (!user) return setShowLoginPrompt(true);
    try {
      await axios.post(`${API_URL}/api/posts/${id}/comment`, {
        text: commentInputs[id]
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCommentInputs(inputs => ({ ...inputs, [id]: '' }));
      // Refresh only this specific post
      const postRes = await axios.get(`${API_URL}/api/posts?ids=${id}`);
      const updatedPost = postRes.data[0];
      setPosts(posts => posts.map(post => post._id === id ? updatedPost : post));
    } catch (err) {
      if (err.response?.status === 401) setShowLoginPrompt(true);
      else alert('Failed to add comment. Please try again.');
    }
  };

  const handleShowMoreComments = postId => setShowAllComments(s => ({ ...s, [postId]: true }));
  const handleShowLessComments = postId => setShowAllComments(s => ({ ...s, [postId]: false }));

  const highlightMentions = (text, mentions, users) => {
    if (!mentions || !users) return text;
    let result = text;
    users.forEach(u => {
      result = result.replace(new RegExp(`@${u.name}`, 'g'), `<b style="color:#ffeba7">@${u.name}</b>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles['feed-container']}>
      {showLoginPrompt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowLoginPrompt(false)}>
          <div style={{
            background: '#23243a', padding: '2em 2.5em', borderRadius: 12,
            boxShadow: '0 4px 24px #000', color: '#fff', minWidth: 280, textAlign: 'center'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1em' }}>Login Required</h3>
            <p style={{ marginBottom: '1.5em' }}>Please log in to interact with posts.</p>
            <Link to="/login" className="btn" style={{
              background: '#ffeba7', color: '#23243a', padding: '0.6em 1.5em',
              borderRadius: 6, fontWeight: 600, textDecoration: 'none'
            }}>Go to Login</Link>
            <div style={{ marginTop: '1.2em' }}>
              <button className="btn" style={{
                background: '#23243a', color: '#ffeba7', border: '1px solid #ffeba7',
                padding: '0.5em 1.2em', borderRadius: 6
              }} onClick={() => setShowLoginPrompt(false)}>Cancel</button>
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
            onEmoji={handleEmoji}
            onView={handleView}
            onAddComment={handleAddComment}
            onCommentChange={handleCommentChange}
            commentInput={commentInputs[post._id] || ''}
            showAllComments={!!showAllComments[post._id]}
            setShowAllComments={showAllComments[post._id]
              ? () => handleShowLessComments(post._id)
              : () => handleShowMoreComments(post._id)}
          />
        ))}
        {loadingMore && (
          <div style={{ textAlign: 'center', margin: '2em' }}>
            <Loader />
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div style={{ textAlign: 'center', color: '#888', margin: '2em' }}>
            No more posts to load.
          </div>
        )}
      </div>
    </div>
  );
}