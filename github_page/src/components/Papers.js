import React, { useState } from 'react';

function Papers() {
  const [papers] = useState([
    {
      id: 1,
      title: "Attention Is All You Need",
      authors: "Vaswani et al.",
      venue: "NIPS 2017",
      date: "2024-01-15",
      summary: "Revolutionary paper introducing the Transformer architecture that has become the foundation of modern NLP models.",
      tags: ["NLP", "Transformers", "Deep Learning"],
      rating: 5,
      notes: "This paper fundamentally changed how we approach sequence modeling. The self-attention mechanism is elegant and powerful.",
      readingTime: "45 min"
    },
    {
      id: 2,
      title: "ResNet: Deep Residual Learning for Image Recognition",
      authors: "He et al.",
      venue: "CVPR 2016",
      date: "2024-01-10",
      summary: "Introduced residual connections that enable training of very deep neural networks.",
      tags: ["Computer Vision", "Deep Learning", "CNN"],
      rating: 5,
      notes: "The skip connections solve the vanishing gradient problem elegantly. Still widely used today.",
      readingTime: "30 min"
    }
  ]);

  const [selectedTag, setSelectedTag] = useState('All');
  
  const allTags = ['All', ...new Set(papers.flatMap(paper => paper.tags))];
  const filteredPapers = selectedTag === 'All' 
    ? papers 
    : papers.filter(paper => paper.tags.includes(selectedTag));

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Paper Reviews</h1>
        <p className="page-subtitle">My journey through academic papers and research</p>
      </div>

      <div className="content-section">
        <div className="filter-section">
          <h3>Filter by Topic</h3>
          <div className="tag-filters">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="papers-grid">
          {filteredPapers.map(paper => (
            <div key={paper.id} className="paper-card">
              <div className="paper-header">
                <h3 className="paper-title">{paper.title}</h3>
                <div className="paper-meta">
                  <span className="authors">{paper.authors}</span>
                  <span className="venue">{paper.venue}</span>
                  <span className="reading-time">📖 {paper.readingTime}</span>
                </div>
              </div>

              <div className="paper-content">
                <p className="paper-summary">{paper.summary}</p>
                
                <div className="paper-tags">
                  {paper.tags.map(tag => (
                    <span key={tag} className="paper-tag">{tag}</span>
                  ))}
                </div>

                <div className="paper-rating">
                  <span className="rating-label">Rating: </span>
                  <span className="stars">{renderStars(paper.rating)}</span>
                </div>

                <div className="paper-notes">
                  <h4>My Notes:</h4>
                  <p>{paper.notes}</p>
                </div>
              </div>

              <div className="paper-footer">
                <span className="read-date">Read on {paper.date}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="empty-state">
            <p>No papers found for the selected tag.</p>
          </div>
        )}

        <div className="reading-stats">
          <h3>Reading Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{papers.length}</span>
              <span className="stat-label">Papers Read</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{allTags.length - 1}</span>
              <span className="stat-label">Topics Covered</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{(papers.reduce((acc, p) => acc + p.rating, 0) / papers.length).toFixed(1)}</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Papers; 