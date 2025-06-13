import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

function Post() {
  const { type, id } = useParams();
  const location = useLocation();
  const content = location.state?.content;

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
        <header className="full-post-header">
          <h1 className="full-post-title">{content.title}</h1>
          
          <div className="full-post-meta">
            {isBlogPost ? (
              <>
                <span className="post-date">📅 {content.date}</span>
                <span className="post-category">📂 {content.category}</span>
                <span className="post-read-time">⏱️ {content.readTime}</span>
              </>
            ) : (
              <>
                <span className="paper-authors">👥 {content.authors}</span>
                <span className="paper-venue">🏛️ {content.venue}</span>
                <span className="paper-read-time">📖 {content.readingTime}</span>
                <span className="paper-read-date">📅 Read on {content.date}</span>
              </>
            )}
          </div>

          <div className="full-post-tags">
            {content.tags.map(tag => (
              <span key={tag} className="full-post-tag">{tag}</span>
            ))}
          </div>
        </header>

        <div className="full-post-content">
          {isBlogPost ? (
            <>
              <div className="post-excerpt-full">
                <p><strong>{content.excerpt}</strong></p>
              </div>
              <div className="post-content-full">
                {content.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim().startsWith('##')) {
                    return <h2 key={index}>{paragraph.replace('##', '').trim()}</h2>;
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
            </>
          ) : (
            <>
              <div className="paper-summary-full">
                <h2>Summary</h2>
                <p>{content.summary}</p>
              </div>
              <div className="paper-notes-full">
                <h2>My Notes</h2>
                <p>{content.notes}</p>
              </div>
            </>
          )}
        </div>
      </article>
    </div>
  );
}

export default Post; 