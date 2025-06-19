import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

  // Function to extract content without the video section
  const getContentWithoutVideo = (fullContent) => {
    const lines = fullContent.split('\n');
    let stopIndex = lines.length;
    
    // Find the video section
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().toLowerCase() === '### video') {
        stopIndex = i;
        break;
      }
    }
    
    return lines.slice(0, stopIndex).join('\n');
  };

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
  const markdownContent = getContentWithoutVideo(content.content);

  return (
    <div className="page-content">
      <div className="post-navigation">
        <Link to={`/${type}`} className="back-link">
          ← Back to {type === 'blog' ? 'Blog' : 'Papers'}
        </Link>
      </div>  

      <article className="full-post">
        <div className="full-post-content">
          <div className="post-content-full markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom styling for different elements
                h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
                h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
                h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
                h4: ({children}) => <h4 className="markdown-h4">{children}</h4>,
                p: ({children}) => <p className="markdown-p">{children}</p>,
                ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
                ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
                li: ({children}) => <li className="markdown-li">{children}</li>,
                blockquote: ({children}) => <blockquote className="markdown-blockquote">{children}</blockquote>,
                code: ({inline, children}) => 
                  inline ? 
                    <code className="markdown-code-inline">{children}</code> : 
                    <code className="markdown-code-block">{children}</code>,
                pre: ({children}) => <pre className="markdown-pre">{children}</pre>,
                table: ({children}) => <table className="markdown-table">{children}</table>,
                thead: ({children}) => <thead className="markdown-thead">{children}</thead>,
                tbody: ({children}) => <tbody className="markdown-tbody">{children}</tbody>,
                tr: ({children}) => <tr className="markdown-tr">{children}</tr>,
                th: ({children}) => <th className="markdown-th">{children}</th>,
                td: ({children}) => <td className="markdown-td">{children}</td>,
                a: ({href, children}) => (
                  <a href={href} className="markdown-link" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
          
          {content.video && (
            <div className="post-video-section">
              <h3>Video</h3>
              <div className="video-container">
                <video 
                  controls 
                  width="100%" 
                  style={{ maxWidth: '800px', height: 'auto' }}
                  onError={(e) => {
                    console.error('Video failed to load:', content.video.url);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                >
                  <source src={content.video.url} type="video/mp4" />
                  <source src={content.video.url} type="video/webm" />
                  <source src={content.video.url} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
                <div className="video-fallback" style={{ display: 'none' }}>
                  <p>Video could not be loaded. Please check that the video file exists at:</p>
                  <p><code>{content.video.url}</code></p>
                  <p>Make sure to place your video files in the <code>public/videos/</code> directory.</p>
                </div>
              </div>
              <div className="video-info">
                <p className="video-filename">
                  <strong>Video:</strong> {content.video.filename}
                </p>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default Post; 