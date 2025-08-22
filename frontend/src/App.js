import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import WorldBookPage from './pages/WorldBook/WorldBookPage';
import AdventurerBookPage from './pages/AdventurerBook/AdventurerBookPage';
import StoryBookPage from './pages/StoryBook/StoryBookPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Import components
import Sidebar from './components/Navigation/Sidebar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBook, setCurrentBook] = useState('world');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('/api/users/users/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, tokens) => {
    setUser(userData);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const handleBookChange = (bookId) => {
    setCurrentBook(bookId);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app">
        <Sidebar 
          user={user} 
          onBookChange={handleBookChange} 
          currentBook={currentBook}
          onLogout={handleLogout}
        />
        
        <Routes>
          <Route path="/" element={<Navigate to="/world" replace />} />
          <Route path="/world" element={<WorldBookPage user={user} />} />
          <Route path="/world/category/:categoryId" element={<WorldBookPage user={user} />} />
          <Route path="/adventurer" element={<AdventurerBookPage user={user} />} />
          <Route path="/adventurer/category/:categoryId" element={<AdventurerBookPage user={user} />} />
          <Route path="/story" element={<StoryBookPage user={user} />} />
          <Route path="/story/category/:categoryId" element={<StoryBookPage user={user} />} />
          <Route path="*" element={<Navigate to="/world" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 