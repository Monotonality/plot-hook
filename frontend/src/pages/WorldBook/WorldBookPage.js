import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Navigation/Sidebar';
import CategoryTile from '../../components/Tiles/CategoryTile';
import EntryTile from '../../components/Tiles/EntryTile';
import Breadcrumb from '../../components/Navigation/Breadcrumb';
import './WorldBookPage.css';

const WorldBookPage = ({ user }) => {
  const { categoryId } = useParams();
  const [currentBook, setCurrentBook] = useState('world');
  const [isEditMode, setIsEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (categoryId) {
      fetchCategoryDetails(categoryId);
      fetchEntries(categoryId);
    }
  }, [categoryId]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/books/categories/?book_type=world');
      const data = await response.json();
      setCategories(data.results || []);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryDetails = async (id) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/books/categories/${id}/`);
      const data = await response.json();
      setCurrentCategory(data);
    } catch (err) {
      setError('Failed to load category details');
      console.error('Error fetching category details:', err);
    }
  };

  const fetchEntries = async (categoryId) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/books/entries/?category=${categoryId}&book_type=world`);
      const data = await response.json();
      setEntries(data.results || []);
    } catch (err) {
      setError('Failed to load entries');
      console.error('Error fetching entries:', err);
    }
  };

  const handleBookChange = (bookId) => {
    setCurrentBook(bookId);
  };

  const handleEditCategory = (category) => {
    // TODO: Implement edit category modal/form
    console.log('Edit category:', category);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/books/categories/${categoryId}/`, {
        method: 'DELETE',
      });
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const handleEditEntry = (entry) => {
    // TODO: Implement edit entry modal/form
    console.log('Edit entry:', entry);
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/books/entries/${entryId}/`, {
        method: 'DELETE',
      });
      if (categoryId) {
        fetchEntries(categoryId);
      }
    } catch (err) {
      setError('Failed to delete entry');
      console.error('Error deleting entry:', err);
    }
  };

  const handleCreateCategory = () => {
    // TODO: Implement create category modal/form
    console.log('Create new category');
  };

  const handleCreateEntry = () => {
    // TODO: Implement create entry modal/form
    console.log('Create new entry');
  };

  if (loading) {
    return (
      <div className="world-book-page">
        <Sidebar user={user} onBookChange={handleBookChange} currentBook={currentBook} />
        <div className="main-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="world-book-page">
        <Sidebar user={user} onBookChange={handleBookChange} currentBook={currentBook} />
        <div className="main-content">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="world-book-page">
      <Sidebar user={user} onBookChange={handleBookChange} currentBook={currentBook} />
      
      <div className="main-content">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              {currentCategory ? currentCategory.title : 'World Book'}
            </h1>
            {currentCategory && (
              <p className="page-description">{currentCategory.description}</p>
            )}
          </div>
          
          <div className="header-actions">
            {user?.is_dm && (
              <>
                <button
                  className="action-btn secondary"
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? 'Exit Edit' : 'Edit Mode'}
                </button>
                <button className="action-btn primary" onClick={handleCreateCategory}>
                  New Category
                </button>
                <button className="action-btn primary" onClick={handleCreateEntry}>
                  New Entry
                </button>
              </>
            )}
          </div>
        </div>

        <Breadcrumb 
          items={currentCategory ? [
            { name: 'World Book', path: '/world' },
            { name: currentCategory.title, path: `/world/category/${currentCategory.id}` }
          ] : [
            { name: 'World Book', path: '/world' }
          ]}
        />

        <div className="content-grid">
          {!categoryId && (
            <div className="categories-section">
              <h2 className="section-title">Categories</h2>
              {categories.length > 0 ? (
                <div className="tiles-grid">
                  {categories.map((category) => (
                    <CategoryTile
                      key={category.id}
                      category={category}
                      onEdit={handleEditCategory}
                      onDelete={handleDeleteCategory}
                      isEditMode={isEditMode}
                      user={user}
                    />
                  ))}
                </div>
              ) : (
                <div className="placeholder-content">
                  <h3>No categories yet</h3>
                  <p>Create your first category to start organizing your world.</p>
                  {user?.is_dm && (
                    <button className="action-btn primary" onClick={handleCreateCategory}>
                      Create First Category
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {categoryId && (
            <div className="entries-section">
              <h2 className="section-title">Entries</h2>
              {entries.length > 0 ? (
                <div className="tiles-grid">
                  {entries.map((entry) => (
                    <EntryTile
                      key={entry.id}
                      entry={entry}
                      onEdit={handleEditEntry}
                      onDelete={handleDeleteEntry}
                      isEditMode={isEditMode}
                      user={user}
                    />
                  ))}
                </div>
              ) : (
                <div className="placeholder-content">
                  <h3>No entries yet</h3>
                  <p>Create your first entry to start documenting your world.</p>
                  {user?.is_dm && (
                    <button className="action-btn primary" onClick={handleCreateEntry}>
                      Create First Entry
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorldBookPage;
