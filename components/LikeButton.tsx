'use client';

import { useState, useEffect } from 'react';

interface LikeButtonProps {
  articleId: string;
  initialLikes: number;
}

export default function LikeButton({ articleId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    setIsLiked(likedArticles.includes(articleId));
  }, [articleId]);

  const handleLike = async () => {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    
    if (isLiked) {
      // Unlike
      const newLikes = likes - 1;
      setLikes(newLikes);
      setIsLiked(false);
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles.filter((id: string) => id !== articleId)));
      
      // Update backend
      await fetch('/api/articles/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, increment: false })
      });
    } else {
      // Like
      const newLikes = likes + 1;
      setLikes(newLikes);
      setIsLiked(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      localStorage.setItem('likedArticles', JSON.stringify([...likedArticles, articleId]));
      
      // Update backend
      await fetch('/api/articles/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, increment: true })
      });
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
        isLiked
          ? 'bg-primary dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-accent'
          : 'bg-pink-100 dark:bg-gray-700 text-primary dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-gray-600'
      } hover:scale-105 shadow-md`}
    >
      <span className={`text-2xl ${isAnimating ? 'animate-bounce' : ''}`}>
        {isLiked ? '💖' : '🤍'}
      </span>
      <span className="font-bold">{likes}</span>
      <span>{isLiked ? 'Liked' : 'Like'}</span>
    </button>
  );
}
