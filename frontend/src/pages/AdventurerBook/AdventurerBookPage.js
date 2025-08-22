import React from 'react';
import Sidebar from '../../components/Navigation/Sidebar';
import './AdventurerBookPage.css';

const AdventurerBookPage = ({ user }) => {
  const [currentBook, setCurrentBook] = React.useState('adventurer');

  const handleBookChange = (bookId) => {
    setCurrentBook(bookId);
  };

  return (
    <div className="adventurer-book-page">
      <Sidebar user={user} onBookChange={handleBookChange} currentBook={currentBook} />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Adventurer's Book</h1>
          <p className="page-description">Your personal notes and discoveries</p>
        </div>
        <div className="content-placeholder">
          <p>Adventurer's Book content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdventurerBookPage;
