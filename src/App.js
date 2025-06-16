import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import About from './components/About';
import Papers from './components/Papers';
import Blog from './components/Blog';
import Post from './components/Post';
import DevMode from './components/DevMode';
import BackToTop from './components/BackToTop';

function Navigation() {
  const location = useLocation();
  const [devMode, setDevMode] = useState(() => {
    // Initialize devMode from localStorage
    const saved = localStorage.getItem('devMode');
    return saved === 'true';
  });
  
  // Check if running on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname === '::1';

  // Persist devMode state to localStorage
  useEffect(() => {
    localStorage.setItem('devMode', devMode.toString());
  }, [devMode]);

  const toggleDevMode = () => {
    setDevMode(!devMode);
  };
  
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Axel's Blog</h2>
        </div>
        <ul className="nav-links">
          <li>
            <Link 
              to="/about" 
              className={location.pathname === '/about' ? 'active' : ''}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/papers" 
              className={location.pathname === '/papers' ? 'active' : ''}
            >
              Papers
            </Link>
          </li>
          <li>
            <Link 
              to="/blog" 
              className={location.pathname === '/blog' ? 'active' : ''}
            >
              Blog
            </Link>
          </li>
          {isLocalhost && (
            <li>
              <button 
                onClick={toggleDevMode}
                className={`dev-toggle ${devMode ? 'active' : ''}`}
              >
                {devMode ? '✏️ Exit Dev' : '🛠️ Dev Mode'}
              </button>
            </li>
          )}
        </ul>
      </nav>
      
      <main className="main-content">
        {devMode && isLocalhost ? (
          <DevMode />
        ) : (
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/about" element={<About />} />
            <Route path="/papers" element={<Papers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/:type/:id" element={<Post />} />
          </Routes>
        )}
      </main>
      
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
    </Router>
  );
}

export default App;
