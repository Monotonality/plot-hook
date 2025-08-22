import React from 'react';
import Sidebar from '../../components/Navigation/Sidebar';
import './StoryBookPage.css';

const StoryBookPage = ({ user }) => {
  const [currentBook, setCurrentBook] = React.useState('story');

  const handleBookChange = (bookId) => {
    setCurrentBook(bookId);
  };

  return (
    <div className="story-book-page">
      <Sidebar user={user} onBookChange={handleBookChange} currentBook={currentBook} />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Story Book</h1>
          <p className="page-description">Campaign sessions and story progression</p>
        </div>
        <div className="content-placeholder">
          <p>Story Book content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default StoryBookPage;
