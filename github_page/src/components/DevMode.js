import React, { useState } from 'react';

function DevMode() {
  const [activeTab, setActiveTab] = useState('blog');
  const [formData, setFormData] = useState({
    // Blog post form
    blogTitle: '',
    blogCategory: 'Web Development',
    blogTags: '',
    blogExcerpt: '',
    blogContent: '',
    blogReadTime: '5 min read',
    
    // Paper review form
    paperTitle: '',
    paperAuthors: '',
    paperVenue: '',
    paperSummary: '',
    paperTags: '',
    paperRating: 5,
    paperNotes: '',
    paperReadTime: '30 min'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (type) => {
    const data = type === 'blog' ? {
      title: formData.blogTitle,
      category: formData.blogCategory,
      tags: formData.blogTags.split(',').map(tag => tag.trim()),
      excerpt: formData.blogExcerpt,
      content: formData.blogContent,
      readTime: formData.blogReadTime,
      date: new Date().toISOString().split('T')[0]
    } : {
      title: formData.paperTitle,
      authors: formData.paperAuthors,
      venue: formData.paperVenue,
      summary: formData.paperSummary,
      tags: formData.paperTags.split(',').map(tag => tag.trim()),
      rating: formData.paperRating,
      notes: formData.paperNotes,
      readingTime: formData.paperReadTime,
      date: new Date().toISOString().split('T')[0]
    };

    // For now, just log the data (in real app, you'd save to state/database)
    console.log(`New ${type} entry:`, data);
    alert(`${type === 'blog' ? 'Blog post' : 'Paper review'} created! Check the console for the data structure.`);
    
    // Reset form
    if (type === 'blog') {
      setFormData(prev => ({
        ...prev,
        blogTitle: '',
        blogExcerpt: '',
        blogContent: '',
        blogTags: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        paperTitle: '',
        paperAuthors: '',
        paperVenue: '',
        paperSummary: '',
        paperTags: '',
        paperNotes: ''
      }));
    }
  };

  const previewContent = () => {
    if (activeTab === 'blog') {
      return (
        <div className="preview-content">
          <h3>{formData.blogTitle || 'Blog Post Title'}</h3>
          <div className="preview-meta">
            <span>📂 {formData.blogCategory}</span>
            <span>⏱️ {formData.blogReadTime}</span>
          </div>
          <p><strong>Excerpt:</strong> {formData.blogExcerpt}</p>
          <div className="preview-tags">
            {formData.blogTags.split(',').map((tag, index) => (
              <span key={index} className="preview-tag">{tag.trim()}</span>
            ))}
          </div>
          <div className="preview-content-text">
            {formData.blogContent.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="preview-content">
          <h3>{formData.paperTitle || 'Paper Title'}</h3>
          <div className="preview-meta">
            <span>👥 {formData.paperAuthors}</span>
            <span>🏛️ {formData.paperVenue}</span>
            <span>⭐ {'★'.repeat(formData.paperRating)}{'☆'.repeat(5 - formData.paperRating)}</span>
          </div>
          <p><strong>Summary:</strong> {formData.paperSummary}</p>
          <div className="preview-tags">
            {formData.paperTags.split(',').map((tag, index) => (
              <span key={index} className="preview-tag">{tag.trim()}</span>
            ))}
          </div>
          <p><strong>Notes:</strong> {formData.paperNotes}</p>
        </div>
      );
    }
  };

  return (
    <div className="dev-mode">
      <div className="dev-header">
        <h1>🛠️ Dev Mode</h1>
        <p>Quick content creation and editing</p>
      </div>

      <div className="dev-tabs">
        <button 
          className={`tab-button ${activeTab === 'blog' ? 'active' : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          ✍️ New Blog Post
        </button>
        <button 
          className={`tab-button ${activeTab === 'paper' ? 'active' : ''}`}
          onClick={() => setActiveTab('paper')}
        >
          📚 New Paper Review
        </button>
        <button 
          className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👀 Preview
        </button>
      </div>

      <div className="dev-content">
        {activeTab === 'blog' && (
          <div className="form-section">
            <h2>Create Blog Post</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('blog'); }}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.blogTitle}
                  onChange={(e) => handleInputChange('blogTitle', e.target.value)}
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.blogCategory}
                    onChange={(e) => handleInputChange('blogCategory', e.target.value)}
                  >
                    <option>Web Development</option>
                    <option>Experiments</option>
                    <option>AI/ML</option>
                    <option>Projects</option>
                    <option>Tutorials</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Read Time</label>
                  <input
                    type="text"
                    value={formData.blogReadTime}
                    onChange={(e) => handleInputChange('blogReadTime', e.target.value)}
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.blogTags}
                  onChange={(e) => handleInputChange('blogTags', e.target.value)}
                  placeholder="React, JavaScript, Web Development"
                />
              </div>

              <div className="form-group">
                <label>Excerpt *</label>
                <textarea
                  value={formData.blogExcerpt}
                  onChange={(e) => handleInputChange('blogExcerpt', e.target.value)}
                  placeholder="Brief description of the blog post"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={formData.blogContent}
                  onChange={(e) => handleInputChange('blogContent', e.target.value)}
                  placeholder="Write your blog post content here..."
                  rows="15"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Create Blog Post</button>
            </form>
          </div>
        )}

        {activeTab === 'paper' && (
          <div className="form-section">
            <h2>Create Paper Review</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('paper'); }}>
              <div className="form-group">
                <label>Paper Title *</label>
                <input
                  type="text"
                  value={formData.paperTitle}
                  onChange={(e) => handleInputChange('paperTitle', e.target.value)}
                  placeholder="Enter paper title"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Authors</label>
                  <input
                    type="text"
                    value={formData.paperAuthors}
                    onChange={(e) => handleInputChange('paperAuthors', e.target.value)}
                    placeholder="Smith et al."
                  />
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    value={formData.paperVenue}
                    onChange={(e) => handleInputChange('paperVenue', e.target.value)}
                    placeholder="ICML 2024"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating</label>
                  <select
                    value={formData.paperRating}
                    onChange={(e) => handleInputChange('paperRating', parseInt(e.target.value))}
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Reading Time</label>
                  <input
                    type="text"
                    value={formData.paperReadTime}
                    onChange={(e) => handleInputChange('paperReadTime', e.target.value)}
                    placeholder="30 min"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.paperTags}
                  onChange={(e) => handleInputChange('paperTags', e.target.value)}
                  placeholder="Machine Learning, NLP, Deep Learning"
                />
              </div>

              <div className="form-group">
                <label>Summary *</label>
                <textarea
                  value={formData.paperSummary}
                  onChange={(e) => handleInputChange('paperSummary', e.target.value)}
                  placeholder="Brief summary of the paper"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>My Notes *</label>
                <textarea
                  value={formData.paperNotes}
                  onChange={(e) => handleInputChange('paperNotes', e.target.value)}
                  placeholder="Your thoughts and notes about the paper"
                  rows="8"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Create Paper Review</button>
            </form>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="preview-section">
            <h2>Preview</h2>
            {previewContent()}
          </div>
        )}
      </div>
    </div>
  );
}

export default DevMode; 