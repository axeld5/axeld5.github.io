import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dataManager from '../utils/dataManager';
import ProgressBar from './ProgressBar';

function Papers() {
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [papersPerPage] = useState(20); // Show 20 papers per page
  const [totalPapers, setTotalPapers] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(null);

  // Utility function to convert URLs in text to clickable links
  const linkifyText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="excerpt-link"
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Load papers with pagination or search
  useEffect(() => {
    const progressCallback = (progress) => {
      if (progress.type === 'papers') {
        setLoadingProgress(progress);
        
        // Clear progress when complete
        if (progress.current === progress.total) {
          setTimeout(() => {
            setLoadingProgress(null);
          }, 1000);
        }
      }
    };

    const loadPapers = async () => {
      setIsLoading(true);
      try {
        // Add progress callback
        dataManager.addProgressCallback(progressCallback);

        if (searchTerm.trim()) {
          // Search mode: load ALL papers and filter
          console.log(`Papers component: Searching for "${searchTerm}"...`);
          setIsSearching(true);
          const allPapers = await dataManager.getAllPaperPostsForSearch();
          console.log(`Search: loaded ${allPapers.length} papers to search through`);
          const filteredPapers = allPapers.filter(paper => {
            const searchLower = searchTerm.toLowerCase();
            return paper.title.toLowerCase().includes(searchLower) ||
                   paper.excerpt.toLowerCase().includes(searchLower) ||
                   paper.content.toLowerCase().includes(searchLower);
          });
          console.log(`Search: found ${filteredPapers.length} matching papers`);
          setPapers(filteredPapers);
          setTotalPapers(filteredPapers.length);
        } else {
          // Normal pagination mode
          console.log(`Papers component: Loading page ${currentPage}...`);
          setIsSearching(false);
          const paginatedPapers = await dataManager.getPaginatedPaperPosts(currentPage, papersPerPage);
          const totalCount = await dataManager.getPaperCount();
          setPapers(paginatedPapers);
          setTotalPapers(totalCount);
        }
        
        console.log('Papers component: Finished loading papers');
      } catch (error) {
        console.error('Error loading paper posts:', error);
      } finally {
        setIsLoading(false);
        // Remove progress callback
        dataManager.removeProgressCallback(progressCallback);
      }
    };

    loadPapers();

    // Cleanup function
    return () => {
      dataManager.removeProgressCallback(progressCallback);
    };
  }, [currentPage, papersPerPage, searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const totalPages = Math.ceil(totalPapers / papersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (isSearching || totalPages <= 1) return null;

    const pages = [];
    const showPages = 5; // Show 5 page numbers
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => handlePageChange(currentPage - 1)} className="pagination-btn">
          ← Previous
        </button>
      );
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="pagination-btn">
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="pagination-btn">
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button key="next" onClick={() => handlePageChange(currentPage + 1)} className="pagination-btn">
          Next →
        </button>
      );
    }

    return <div className="pagination">{pages}</div>;
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Paper Reads</h1>
        <p className="page-subtitle">My journey through academic papers and research</p>
        {!isSearching && (
          <p className="papers-count">
            Showing {((currentPage - 1) * papersPerPage) + 1}-{Math.min(currentPage * papersPerPage, totalPapers)} of {totalPapers} papers
          </p>
        )}
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
          {isSearching && (
            <p className="search-results-count">
              Found {papers.length} papers matching "{searchTerm}"
            </p>
          )}
        </div>

        {/* Pagination at the top, below search */}
        {renderPagination()}

        {isLoading ? (
          <div className="loading-state">
            {loadingProgress ? (
              <ProgressBar progress={loadingProgress} />
            ) : (
              <p>Loading papers...</p>
            )}
          </div>
        ) : (
          <>
            <div className="papers-grid">
              {papers.map(paper => (
                <div key={paper.id} className="paper-card">
                  <div className="paper-header">
                    <h3 className="paper-title">{paper.title}</h3>
                    <div className="paper-meta">
                      <span className="paper-type">📚 Paper Review</span>
                      <span className="paper-id">#{paper.id}</span>
                      {paper.video && <span className="post-video-indicator">🎬 Has Video</span>}
                    </div>
                  </div>

                  <div className="paper-content">
                    <p className="paper-summary">{linkifyText(paper.excerpt)}</p>

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

            {papers.length === 0 && !isLoading && (
              <div className="empty-state">
                <p>{isSearching ? 'No papers found matching your search.' : 'No papers available.'}</p>
              </div>
            )}

            {/* Optional: Pagination at the bottom too for long lists */}
            {papers.length > 10 && renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

export default Papers; 