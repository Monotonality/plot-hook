import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user, onBookChange, currentBook }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const books = [
    { id: 'world', name: 'World Book', icon: '🌍', path: '/world' },
    { id: 'adventurer', name: 'Adventurer\'s Book', icon: '⚔️', path: '/adventurer' },
    { id: 'story', name: 'Story Book', icon: '📖', path: '/story' }
  ];

  const handleBookClick = (bookId) => {
    onBookChange(bookId);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Plot Hook</h2>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="user-info">
        <div className="user-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            <div className="avatar-placeholder">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="user-details">
            <div className="username">{user?.username}</div>
            <div className="user-role">{user?.role_display}</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Books</h3>
          <ul className="nav-list">
            {books.map((book) => (
              <li key={book.id} className="nav-item">
                <Link
                  to={book.path}
                  className={`nav-link ${currentBook === book.id ? 'active' : ''}`}
                  onClick={() => handleBookClick(book.id)}
                >
                  <span className="nav-icon">{book.icon}</span>
                  {!isCollapsed && <span className="nav-text">{book.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {!isCollapsed && (
          <div className="nav-section">
            <h3 className="nav-section-title">Quick Actions</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/search" className="nav-link">
                  <span className="nav-icon">🔍</span>
                  <span className="nav-text">Search</span>
                </Link>
              </li>
              {user?.is_dm && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">
                    <span className="nav-icon">⚙️</span>
                    <span className="nav-text">Admin</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <span className="nav-icon">🚪</span>
          {!isCollapsed && <span className="nav-text">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
