import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dataManager from '../utils/dataManager';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load posts from dataManager on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await dataManager.getBlogPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);
  
  const filteredPosts = posts.filter(post => {
    const searchLower = searchTerm.toLowerCase();
    return post.title.toLowerCase().includes(searchLower) ||
           post.excerpt.toLowerCase().includes(searchLower) ||
           post.content.toLowerCase().includes(searchLower);
  });

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Blog</h1>
        <p className="page-subtitle">Experiments, projects, and technical insights</p>
      </div>

      <div className="content-section">
        <div className="search-section">
          <h3>Search Posts</h3>
          <input
            type="text"
            placeholder="Search by title, excerpt, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {isLoading ? (
          <div className="loading-state">
            <p>Loading posts...</p>
          </div>
        ) : (
          <>
            <div className="blog-posts">
              {filteredPosts.map(post => (
                <article key={post.id} className="blog-post">
                  <div className="post-header">
                    <h2 className="post-title">{post.title}</h2>
                                    <div className="post-meta">
                  <span className="post-type">📝 Blog Post</span>
                  <span className="post-id">#{post.id}</span>
                </div>
                  </div>

                  <div className="post-content">
                    <p className="post-excerpt">{post.excerpt}</p>
                    
                    

                    <Link 
                      to={`/blog/${post.id}`}
                      state={{ content: post }}
                      className="read-full-post-btn"
                    >
                      Read Full Post →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && !isLoading && (
              <div className="empty-state">
                <p>No posts found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Blog; 