import React from 'react';
import './AdventurerBookPage.css';

const AdventurerBookPage = ({ user }) => {
  return (
    <div className="adventurer-book-page">
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Adventurer's Book</h1>
          <p className="page-description">Your personal journal and discoveries</p>
        </div>
        <div className="content-grid">
          <div className="placeholder-content">
            <h2>Welcome to your Adventurer's Book!</h2>
            <p>This is where you'll record your character's journey, discoveries, and personal notes.</p>
            <p>Coming soon: Personal notes, character development, and discovery logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventurerBookPage;