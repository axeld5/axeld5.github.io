import React from 'react';

function ProgressBar({ progress }) {
  if (!progress || progress.total === 0) {
    return null;
  }

  const { current, total, percentage, type, message } = progress;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h4 className="progress-title">
          Loading {type === 'blog' ? 'Blog Posts' : 'Papers'}
        </h4>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="progress-info">
        <span className="progress-count">
          {current} of {total} loaded
        </span>
        {message && (
          <span className="progress-message">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProgressBar; 