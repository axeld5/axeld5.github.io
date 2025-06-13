import React from 'react';

function About() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>About Me</h1>
        <p className="page-subtitle">Welcome to my corner of the internet</p>
      </div>
      
      <div className="content-section">
        <div className="profile-section">
          <div className="profile-image">
            <div className="placeholder-avatar">👨‍💻</div>
          </div>
          <div className="profile-info">
            <h2>Axel</h2>
            <p className="role">Developer & Researcher</p>
            <p className="bio">
              I'm passionate about technology, research, and sharing knowledge. 
              This blog serves as my digital notebook where I document my journey 
              through papers I read, experiments I conduct, and projects I build.
            </p>
            
            <div className="contact-links">
              <a href="https://github.com/axeld5" target="_blank" rel="noopener noreferrer">
                📧 GitHub
              </a>
              <a href="mailto:your.email@example.com">
                📧 Email
              </a>
            </div>
          </div>
        </div>

        <div className="skills-section">
          <h3>Areas of Interest</h3>
          <div className="skills-grid">
            <div className="skill-tag">Machine Learning</div>
            <div className="skill-tag">Web Development</div>
            <div className="skill-tag">Research</div>
            <div className="skill-tag">Open Source</div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-item">
            <span className="activity-date">📚</span>
            <span>Latest paper review on machine learning architectures</span>
          </div>
          <div className="activity-item">
            <span className="activity-date">🔬</span>
            <span>New experiment with React and modern web APIs</span>
          </div>
          <div className="activity-item">
            <span className="activity-date">🚀</span>
            <span>Launched a new project on GitHub</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 