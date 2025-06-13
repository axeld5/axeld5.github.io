import React, { useState, useEffect } from 'react';
import dataManager from '../utils/dataManager';

function DevMode() {
  const [activeTab, setActiveTab] = useState('blog');
  const [content, setContent] = useState('');
  const [stats, setStats] = useState({ blogCount: 0, paperCount: 0, total: 0 });

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

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async (type) => {
    if (!content.trim()) {
      alert('Please enter some content!');
      return;
    }

    // Check if content starts with ## for title
    if (!content.trim().startsWith('## ')) {
      alert('Content must start with a title line beginning with "## ". For example:\n\n## My Blog Post Title\n\nYour content here...');
      return;
    }

    try {
      const result = type === 'blog' 
        ? await dataManager.generateBlogPost(content)
        : await dataManager.generatePaperPost(content);
      
      // Download the file
      dataManager.downloadFile(content, result.filename);
      
      alert(`${type === 'blog' ? 'Blog post' : 'Paper review'} file generated!
        
Filename: ${result.filename} (Post #${result.postNumber})
Title: ${result.title}

The file has been downloaded. To add it to your site:
1. Save the file to public/${type === 'blog' ? 'blog' : 'papers'}/
2. Refresh the page to see your new post!

No need to edit any index files - the system will automatically discover it!`);
      
      // Clear content after successful generation
      setContent('');
      
      // Refresh stats
      loadStats();
    } catch (error) {
      console.error(`Error generating ${type} file:`, error);
      alert(`Error generating ${type} file. Please try again.`);
    }
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

Wrap up your blog post here.`;
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

Would you recommend this paper? Why or why not?`;
    }
  };

  return (
    <div className="dev-mode">
      <div className="dev-header">
        <h1>🛠️ Dev Mode - Numbered Post Generator</h1>
        <p>Create blog posts and paper reviews with automatic numbering</p>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-number">{stats.blogCount}</span>
          <span className="stat-label">Blog Posts</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.paperCount}</span>
          <span className="stat-label">Paper Reviews</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <div className="dev-tabs">
        <button 
          className={`tab-button ${activeTab === 'blog' ? 'active' : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          ✍️ Blog Post
        </button>
        <button 
          className={`tab-button ${activeTab === 'paper' ? 'active' : ''}`}
          onClick={() => setActiveTab('paper')}
        >
          📚 Paper Review
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
              disabled={!content.trim()}
            >
              📥 Generate & Download {activeTab === 'blog' ? 'Blog Post' : 'Paper Review'}
            </button>
            
            <button 
              onClick={() => setContent(getPlaceholderContent(activeTab))}
              className="template-btn"
            >
              📋 Load Template
            </button>
            
            <button 
              onClick={() => setContent('')}
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
            <li><strong>Click "Generate & Download"</strong> to create the file</li>
            <li><strong>Save the file</strong> to <code>public/{activeTab === 'blog' ? 'blog' : 'papers'}/</code> with the exact filename</li>
            <li><strong>Refresh the page</strong> to see your new post!</li>
          </ol>

          <h3>💡 Tips</h3>
          <ul>
            <li>Files are automatically numbered: <code>post_1.txt</code>, <code>post_2.txt</code>, etc.</li>
            <li>Use <strong>markdown formatting</strong> for better styling</li>
            <li>Keep titles <strong>descriptive but concise</strong></li>
            <li>The system automatically finds the next available number</li>
            <li>No need to maintain index files anymore!</li>
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