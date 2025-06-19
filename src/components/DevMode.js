import React, { useState, useEffect } from 'react';
import dataManager from '../utils/dataManager';

function DevMode() {
  const [activeTab, setActiveTab] = useState('papers');
  const [content, setContent] = useState('## ');
  const [stats, setStats] = useState({ blogCount: 0, paperCount: 0, total: 0 });
  const [lastCreated, setLastCreated] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const currentStats = await dataManager.getStats();
        setStats(currentStats);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

  // Reset content with ## when switching tabs (if content is empty or just ##)
  useEffect(() => {
    if (!content.trim() || content.trim() === '##') {
      setContent('## ');
    }
  }, [activeTab]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  // Check if dev server is available
  const checkDevServer = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (type) => {
    if (!content.trim()) {
      return;
    }

    // Check if content starts with ## for title
    if (!content.trim().startsWith('## ')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = type === 'blog' 
        ? await dataManager.generateBlogPost(content)
        : await dataManager.generatePaperPost(content);
      
      // Check if dev server is available for direct file writing
      const devServerAvailable = await checkDevServer();
      
      if (devServerAvailable) {
        // Use dev server to write files directly
        try {
          const response = await fetch('http://localhost:3001/api/write-post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: type,
              content: content,
              filename: result.filename,
              postNumber: result.postNumber
            })
          });
          
          const serverResult = await response.json();
          
          if (serverResult.success) {
            // Show success info and clear content
            setLastCreated({
              type: type,
              title: result.title,
              filename: result.filename,
              postNumber: result.postNumber,
              method: 'saved'
            });
            
            setContent('## ');
            
            // Clear success message after a few seconds
            setTimeout(() => setLastCreated(null), 3000);
            
            setIsSubmitting(false);
            return;
          }
        } catch (serverError) {
          console.log('Dev server write failed:', serverError);
        }
      }
      
      // If dev server is not available, just clear content and show message
      setLastCreated({
        type: type,
        title: 'Dev server not available',
        error: true,
        message: 'Please ensure the dev server is running to save posts'
      });
      
      setContent('## ');
      
      // Clear message after a few seconds
      setTimeout(() => setLastCreated(null), 3000);
      
    } catch (error) {
      console.error(`Error generating ${type} file:`, error);
      setLastCreated({
        type: type,
        title: 'Error',
        error: true
      });
      setTimeout(() => setLastCreated(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  const loadStats = async () => {
    try {
      const currentStats = await dataManager.getStats();
      setStats(currentStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const refreshData = async () => {
    try {
      await dataManager.refresh();
      await loadStats();
      alert('Data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('Error refreshing data. Please try again.');
    }
  };

  const getPlaceholderContent = (type) => {
    if (type === 'blog') {
      return `## Your Blog Post Title Here

Write a brief description or excerpt of your blog post here.

### Introduction

Start writing your blog post content here. You can use markdown formatting:

- Use **bold** for emphasis
- Use *italics* for emphasis
- Use \`code\` for inline code
- Use \`\`\`code blocks\`\`\` for code examples

### Main Content

Write your main content here. The system will automatically:
- Extract the title from the first line (## Your Blog Post Title Here)
- Generate a numbered filename (post_X.txt)
- Create an excerpt from the first paragraph
- Make it available for download

### Conclusion

Wrap up your blog post here.

### Video
your-video-filename.mp4

Note: Videos are optional! To add a video, create a "### Video" section and put your video filename on the next line. Place your video files in the public/videos/ directory.`;
    } else {
      return `## Paper Title: Amazing Research Paper

Brief summary or excerpt of what this paper is about.

**Authors**: Smith et al.  
**Venue**: Conference/Journal Name  
**Year**: 2024

### Summary

Write a summary of the paper here. What problem does it solve? What are the key contributions?

### Key Contributions

- First major contribution
- Second major contribution  
- Third major contribution

### My Notes

Write your personal thoughts and notes about the paper here:

- What did you find interesting?
- How does it relate to your work?
- What are the limitations?
- What questions does it raise?

### Rating

Give your rating here (e.g., ⭐⭐⭐⭐⭐)

### Verdict

Would you recommend this paper? Why or why not?

### Video
demo-video.mp4

Note: Videos are optional for papers too! You can add a video explanation or demo by creating a "### Video" section.`;
    }
  };

  return (
    <div className="dev-mode">
      <div className="dev-header">
        <h1>🛠️ Dev Mode - Numbered Post Generator</h1>
        <p>Create blog posts and paper reviews with automatic numbering</p>
      </div>

      {lastCreated && (
        <div className={`success-message ${lastCreated.error ? 'error' : 'success'}`}>
          {lastCreated.error ? (
            <span>❌ Error creating post</span>
          ) : (
            <span>
              ✅ <strong>{lastCreated.title}</strong> {lastCreated.method === 'saved' ? 'saved' : 'downloaded'} 
              as {lastCreated.filename} (#{lastCreated.postNumber})
            </span>
          )}
        </div>
      )}

      <div className="dev-tabs">
        <button 
          className={`tab-button ${activeTab === 'papers' ? 'active' : ''}`}
          onClick={() => setActiveTab('papers')}
        >
          📚 Paper Review
        </button>
        <button 
          className={`tab-button ${activeTab === 'blog' ? 'active' : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          ✍️ Blog Post
        </button>
      </div>

      <div className="dev-content">
        <div className="content-editor">
          <div className="editor-header">
            <h2>Create {activeTab === 'blog' ? 'Blog Post' : 'Paper Review'}</h2>
            <p>Write your content below. The first line starting with <code>##</code> will be used as the title.</p>
          </div>

          <div className="editor-section">
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={getPlaceholderContent(activeTab)}
              className="content-textarea"
              rows="25"
            />
          </div>

          <div className="editor-actions">
            <button 
              onClick={() => handleSubmit(activeTab)}
              className="submit-btn"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? '⏳ Creating...' : `✍️ Create ${activeTab === 'blog' ? 'Blog Post' : 'Paper Review'}`}
            </button>
            
            <button 
              onClick={() => setContent(getPlaceholderContent(activeTab))}
              className="template-btn"
            >
              📋 Load Template
            </button>
            
            <button 
              onClick={() => setContent('## ')}
              className="clear-btn"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        <div className="help-section">
          <h3>📖 How to Use</h3>
          <ol>
            <li><strong>Write your content</strong> in the textarea above</li>
            <li><strong>Start with a title</strong> line beginning with <code>## </code></li>
            <li><strong>Click "Create"</strong> to save the post</li>
            <li><strong>Content will be cleared</strong> so you can create another post immediately</li>
            <li><strong>Posts are saved automatically</strong> when the dev server is running</li>
          </ol>

          <h3>💡 Tips</h3>
          <ul>
            <li>Files are automatically numbered: <code>post_1.txt</code>, <code>post_2.txt</code>, etc.</li>
            <li>Use <strong>markdown formatting</strong> for better styling</li>
            <li>Keep titles <strong>descriptive but concise</strong></li>
            <li>The system automatically finds the next available number</li>
            <li><strong>Dev server must be running</strong> for posts to be saved automatically</li>
            <li>Content clears after each post so you can quickly create multiple posts</li>
            <li><strong>Adding videos:</strong> Create a <code>### Video</code> section and put your video filename on the next line</li>
            <li><strong>Video storage:</strong> Place video files in <code>public/videos/</code> directory</li>
            <li><strong>Supported formats:</strong> .mp4, .webm, .ogg, .mov, .avi, .mkv</li>
          </ul>

          <h3>🔧 Management</h3>
          <button onClick={refreshData} className="refresh-btn">
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default DevMode; 