import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegSmile, FaRegHeart, FaRegLaughSquint, FaRegSurprise } from 'react-icons/fa';
import styles from '../ccss/Feed.module.css';

const EMOJIS = [
  { icon: <FaRegThumbsUp />, label: 'Like', key: 'like' },
  { icon: <FaRegThumbsDown />, label: 'Dislike', key: 'dislike' },
  { icon: <FaRegSmile />, label: 'Smile', key: 'smile' },
  { icon: <FaRegHeart />, label: 'Love', key: 'love' },
  { icon: <FaRegLaughSquint />, label: 'Laugh', key: 'laugh' },
  { icon: <FaRegSurprise />, label: 'Wow', key: 'wow' }
];

export default function FeedPostCard({ post, user, onLike, onDislike, onEmoji, onView, onAddComment, onCommentChange, commentInput, showAllComments, setShowAllComments }) {
  const [showMore, setShowMore] = React.useState(false);
  const commentsToShow = showAllComments ? (post.comments || []) : (post.comments || []).slice(0, 1);
  return (
    <div className={styles['post-card']} onClick={() => onView && onView(post._id)}>
      <div className={styles['post-header']}>
        <img src={post.userId.profilePic || '/default-avatar.png'} alt="avatar" className={styles['avatar']} />
        <Link to={`/profile/${post.userId._id}`}>{post.userId.name}</Link>
        <span className={styles['view-count']} style={{marginLeft:'auto',fontSize:'0.98em',color:'#ffeba7'}}>👁 {post.viewCount || 0}</span>
      </div>
      <p>{post.content}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="post" className={styles['post-image']} />}
      <div className={styles['post-actions']}>
        <div
          className={styles['emoji-trigger']}
          tabIndex={0}
        >
          <button
            className={styles['emoji-btn']}
            aria-label="Like"
            style={{ transition: 'transform 0.18s' }}
            onClick={e => { e.stopPropagation(); onEmoji && onEmoji(post._id, 'like'); }}
          >
            <span style={{fontSize:'1.25em',transition:'color 0.18s'}}><FaRegThumbsUp /></span> {post.emojiReactions?.find(r => r.emoji === 'like')?.count || 0}
          </button>
          <button
            className={styles['emoji-btn']}
            aria-label="Dislike"
            style={{ transition: 'transform 0.18s', marginLeft: '0.5em' }}
            onClick={e => { e.stopPropagation(); onEmoji && onEmoji(post._id, 'dislike'); }}
          >
            <span style={{fontSize:'1.25em',transition:'color 0.18s'}}><FaRegThumbsDown /></span> {post.emojiReactions?.find(r => r.emoji === 'dislike')?.count || 0}
          </button>
          <div className={styles['emoji-popover']}>
            {EMOJIS.filter(e => e.key !== 'like' && e.key !== 'dislike').map(({ icon, label, key }) => (
              <button
                key={key}
                className={styles['emoji-btn']}
                onClick={e => { e.stopPropagation(); onEmoji && onEmoji(post._id, key); }}
                aria-label={label}
                style={{ transition: 'transform 0.18s' }}
              >
                <span style={{fontSize:'1.25em',transition:'color 0.18s'}}>{icon}</span> {post.emojiReactions?.find(r => r.emoji === key)?.count || 0}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles['comments-section']}>
        {commentsToShow.map((c, i) => {
          const liked = c.likedBy && user ? c.likedBy.includes(user._id || user.id) : false;
          return (
            <div key={i} className={styles['comment']} style={{display:'flex',alignItems:'center',gap:'0.5em',padding:'0.2em 0'}}>
              <span style={{flex:1}}><b>{c.name}:</b> {c.text}</span>
              <button
                className={styles['comment-like-btn'] + (liked ? ' ' + styles['liked'] : '')}
                onClick={e => { e.stopPropagation(); if (onAddComment) onAddComment(post._id, i, 'likeComment'); }}
                aria-label={liked ? 'Unlike comment' : 'Like comment'}
                title={liked ? 'Unlike comment' : 'Like comment'}
                type="button"
                style={{marginLeft:0,marginRight:0,background:'none',border:'none',boxShadow:'none',padding:'0.2em',display:'flex',alignItems:'center',transition:'transform 0.18s'}}
              >
                <FaRegThumbsUp style={{marginRight:3,transition:'color 0.18s',color:liked?'#007aff':'#ffe082',fontSize:'1.18em'}} />
                <span style={{fontWeight:600,minWidth:18,textAlign:'center',color:liked?'#007aff':'#ffe082',transition:'color 0.18s'}}>{c.likes || 0}</span>
              </button>
            </div>
          );
        })}
        {(post.comments || []).length > 1 && !showAllComments && (
          <button style={{margin:'0.5em 0',background:'none',color:'#ffeba7',border:'none',cursor:'pointer'}} onClick={e => { e.stopPropagation(); setShowAllComments(true); }}>Show more comments</button>
        )}
        {showAllComments && (post.comments || []).length > 1 && (
          <button style={{margin:'0.5em 0',background:'none',color:'#ffeba7',border:'none',cursor:'pointer'}} onClick={e => { e.stopPropagation(); setShowAllComments(false); }}>Show less</button>
        )}
        {user && onAddComment && (
          <form className={styles['add-comment-form']} onSubmit={e => { e.preventDefault(); onAddComment(post._id); }}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInput || ''}
              onChange={e => onCommentChange(post._id, e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        )}
      </div>
    </div>
  );
}
