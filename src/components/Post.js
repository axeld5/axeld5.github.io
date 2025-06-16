import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import dataManager from '../utils/dataManager';

function Post() {
  const { type, id } = useParams();
  const location = useLocation();
  const [content, setContent] = useState(location.state?.content || null);
  const [isLoading, setIsLoading] = useState(!content);

  // Load content from dataManager if not passed through router state
  useEffect(() => {
    const loadContent = async () => {
      if (!content && id) {
        try {
          const loadedContent = type === 'blog'
            ? await dataManager.getBlogPost(id)
            : await dataManager.getPaperPost(id);
          
          setContent(loadedContent);
        } catch (error) {
          console.error(`Error loading ${type} post:`, error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadContent();
  }, [type, id, content]);

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Loading...</h1>
        </div>
        <div className="content-section">
          <p>Loading content...</p>
          <Link to={`/${type}`} className="back-link">
            ← Back to {type === 'blog' ? 'Blog' : 'Papers'}
          </Link>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Content Not Found</h1>
        </div>
        <div className="content-section">
          <p>The requested content could not be found.</p>
          <Link to={`/${type}`} className="back-link">
            ← Back to {type === 'blog' ? 'Blog' : 'Papers'}
          </Link>
        </div>
      </div>
    );
  }

  const isBlogPost = type === 'blog';

  return (
    <div className="page-content">
      <div className="post-navigation">
        <Link to={`/${type}`} className="back-link">
          ← Back to {type === 'blog' ? 'Blog' : 'Papers'}
        </Link>
      </div>  

      <article className="full-post">
        <div className="full-post-content">
                      <div className="post-content-full">
              {content.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim().startsWith('##')) {
                  return <h2 key={index}>{paragraph.replace('##', '').trim()}</h2>;
                } else if (paragraph.trim().startsWith('https://')) {
                  return <p key={index}><a href={paragraph.trim()} target="_blank" rel="noopener noreferrer">{paragraph.trim()}</a></p>;
                } else if (paragraph.trim().startsWith('-')) {
                  return <li key={index}>{paragraph.replace('-', '').trim()}</li>;
                } else if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                  return <h3 key={index}>{paragraph.replace(/\*\*/g, '').trim()}</h3>;
                } else if (paragraph.trim()) {
                  return <p key={index}>{paragraph.trim()}</p>;
                }
                return null;
              })}
          </div>
        </div>
      </article>
    </div>
  );
}

export default Post; 