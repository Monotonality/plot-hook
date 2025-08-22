import React from 'react';
import './StoryBookPage.css';

const StoryBookPage = ({ user }) => {
  return (
    <div className="story-book-page">
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Story Book</h1>
          <p className="page-description">Campaign sessions and story progression</p>
        </div>
        <div className="content-grid">
          <div className="placeholder-content">
            <h2>Welcome to the Story Book!</h2>
            <p>This is where you'll manage campaign sessions, track story progression, and maintain the living campaign log.</p>
            <p>Coming soon: Session management, campaign tracking, and story organization.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryBookPage;