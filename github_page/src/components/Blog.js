import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Blog() {
  const [posts] = useState([
    {
      id: 1,
      title: "Building a React Blog with GitHub Pages",
      date: "2024-01-20",
      category: "Web Development",
      tags: ["React", "GitHub Pages", "JavaScript"],
      excerpt: "A step-by-step guide to creating a modern blog using React and deploying it to GitHub Pages.",
      content: `
        In this post, I'll walk through the process of creating a modern blog using React and deploying it to GitHub Pages.
        
        ## Getting Started
        
        First, I set up a new React application and configured routing for multiple pages. The key components include:
        
        - Navigation system with React Router
        - Responsive design with modern CSS
        - Dev mode for easy content creation
        
        ## Key Features
        
        - **Multi-page navigation**: About, Papers, and Blog sections
        - **Dev mode**: For writing content on the go
        - **Responsive design**: Works on all devices
        - **Modern UI**: Clean and professional appearance
        
        ## Deployment
        
        Deploying to GitHub Pages is straightforward with the gh-pages package...
      `,
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "Experimenting with Web APIs",
      date: "2024-01-18",
      category: "Experiments",
      tags: ["Web APIs", "JavaScript", "Browser"],
      excerpt: "Exploring modern web APIs and their potential for creating interactive applications.",
      content: `
        Modern browsers provide a wealth of APIs that can make web applications more interactive and powerful.
        
        ## APIs Explored
        
        - **Geolocation API**: For location-based features
        - **Notification API**: For user notifications
        - **File API**: For file handling
        - **Canvas API**: For graphics and visualizations
        
        ## Implementation Details
        
        Each API has its own quirks and browser support considerations...
      `,
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Machine Learning in the Browser",
      date: "2024-01-15",
      category: "AI/ML",
      tags: ["Machine Learning", "TensorFlow.js", "JavaScript"],
      excerpt: "Running machine learning models directly in the browser using TensorFlow.js.",
      content: `
        With TensorFlow.js, we can now run sophisticated machine learning models directly in the browser.
        
        ## Benefits
        
        - **Privacy**: Data never leaves the user's device
        - **Performance**: No server round trips
        - **Offline capability**: Works without internet
        
        ## Use Cases
        
        - Image classification
        - Natural language processing
        - Real-time predictions
        
        ## Getting Started
        
        Installing TensorFlow.js is as simple as adding it to your project...
      `,
      readTime: "12 min read"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  
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

        <div className="blog-posts">
          {filteredPosts.map(post => (
            <article key={post.id} className="blog-post">
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <div className="post-meta">
                  <span className="post-date">📅 {post.date}</span>
                  <span className="post-category">📂 {post.category}</span>
                  <span className="post-read-time">⏱️ {post.readTime}</span>
                </div>
              </div>

              <div className="post-content">
                <p className="post-excerpt">{post.excerpt}</p>
                
                <div className="post-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="post-tag">{tag}</span>
                  ))}
                </div>

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

        {filteredPosts.length === 0 && (
          <div className="empty-state">
            <p>No posts found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog; 