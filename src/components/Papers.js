import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dataManager from '../utils/dataManager';

function Papers() {
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load papers from dataManager on component mount
  useEffect(() => {
    const loadPapers = async () => {
      try {
        console.log('Papers component: Starting to load papers...');
        const allPapers = await dataManager.getPaperPosts();
        console.log('Papers component: Loaded papers:', allPapers);
        setPapers(allPapers);
      } catch (error) {
        console.error('Error loading paper posts:', error);
      } finally {
        console.log('Papers component: Finished loading papers');
        setIsLoading(false);
      }
    };

    loadPapers();
  }, []);
  
  const filteredPapers = papers.filter(paper => {
    const searchLower = searchTerm.toLowerCase();
    return paper.title.toLowerCase().includes(searchLower) ||
           paper.excerpt.toLowerCase().includes(searchLower) ||
           paper.content.toLowerCase().includes(searchLower);
  });

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Paper Reviews</h1>
        <p className="page-subtitle">My journey through academic papers and research</p>
      </div>

      <div className="content-section">
        <div className="search-section">
          <h3>Search Papers</h3>
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
            <p>Loading papers...</p>
          </div>
        ) : (
          <>
            <div className="papers-grid">
              {filteredPapers.map(paper => (
                <div key={paper.id} className="paper-card">
                  <div className="paper-header">
                    <h3 className="paper-title">{paper.title}</h3>
                                      <div className="paper-meta">
                    <span className="paper-type">📚 Paper Review</span>
                    <span className="paper-id">#{paper.id}</span>
                  </div>
                  </div>

                                  <div className="paper-content">
                  <p className="paper-summary">{paper.excerpt}</p>

                    <Link 
                      to={`/papers/${paper.id}`}
                      state={{ content: paper }}
                      className="read-full-paper-btn"
                    >
                      Read Full Review →
                    </Link>
                  </div>

                  
                </div>
              ))}
            </div>

            {filteredPapers.length === 0 && !isLoading && (
              <div className="empty-state">
                <p>No papers found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Papers; 