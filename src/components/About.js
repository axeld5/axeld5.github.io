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
          </div>
          <div className="profile-info">
            <h2>Axel Darmouni</h2>
            <p className="role">AI Engineer</p>
            <div className="bio">
              <p>
                Hello! My name is Axel Darmouni, and I am currently an AI Engineer at <a href="https://www.sia-partners.com/en/about-us/heka" target="_blank" rel="noopener noreferrer">Sia AI</a>.
                This site serves as my digital notebook that allows me to document my reads, experiments, projects, and thoughts.
                My main area of expertise, currently, is in the field of GenAI systems and their applications.
                The main projects I have built so far are in the following areas:
              </p>
              <ul>
                <li>RAG systems that can leverage both documents and knowledge graphs/SQL databases to answer questions.</li>
                <li>LLM-powered data structuration pipelines with respect to database schemas.</li>
                <li>Retrieval-Tools with expertise-focused improvements.</li>
                <li>Report Automation with LLM pipelines, pre-agentic.</li>
                <li>Small agentic experimentations in order to test frameworks, tools and limits.</li>
              </ul>
              
              <p>
                The paper section of the blog presents the papers I have read, my notes and thoughts on them.
                The blog section is a collection of experience returns and thoughts about projects and experiments I have worked on.
                Projects are personal projects, mainly POC experiments in order to test technologies.
                Experiments are small research experiments, usually on small language models renting a H100, conducted to follow ideas inspired by my reads.
                Hope you have an enjoyable stay here!
              </p>
            </div>
            
            <div className="contact-links">
              <a href="https://github.com/axeld5" target="_blank" rel="noopener noreferrer">
                <span role="img" aria-label="GitHub" style={{marginRight: '0.4em'}}>🐙</span>GitHub
              </a>
              <a href="mailto:axeldarmouni@gmail.com">
                <span role="img" aria-label="Email" style={{marginRight: '0.4em'}}>✉️</span>Email
              </a>
              <a href="https://www.linkedin.com/in/axel-darmouni-916722196" target="_blank" rel="noopener noreferrer">
                <span role="img" aria-label="LinkedIn" style={{marginRight: '0.4em'}}>💼</span>LinkedIn
              </a>
              <a href="https://x.com/ADarmouni/" target="_blank" rel="noopener noreferrer">
                <span role="img" aria-label="Twitter/X" style={{marginRight: '0.4em'}}>🐦</span>Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 