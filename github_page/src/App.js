import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import About from './components/About';
import Papers from './components/Papers';
import Blog from './components/Blog';
import DevMode from './components/DevMode';

function Navigation() {
  const location = useLocation();
  const [devMode, setDevMode] = useState(false);
  
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
          <li>
            <button 
              onClick={() => setDevMode(!devMode)}
              className={`dev-toggle ${devMode ? 'active' : ''}`}
            >
              {devMode ? '✏️ Exit Dev' : '🛠️ Dev Mode'}
            </button>
          </li>
        </ul>
      </nav>
      
      <main className="main-content">
        {devMode ? (
          <DevMode />
        ) : (
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/about" element={<About />} />
            <Route path="/papers" element={<Papers />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        )}
      </main>
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
