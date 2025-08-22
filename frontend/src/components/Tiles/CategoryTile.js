import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryTile.css';

const CategoryTile = ({ category, onEdit, onDelete, isEditMode, user }) => {
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(category);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${category.title}"?`)) {
      onDelete(category.id);
    }
  };

  return (
    <div className={`category-tile ${category.is_hidden ? 'hidden' : ''}`}>
      <Link to={`/world/category/${category.id}`} className="tile-link">
        <div className="tile-content">
          <div className="tile-header">
            <h3 className="tile-title">{category.title}</h3>
            {category.is_hidden && (
              <span className="hidden-indicator" title="Hidden content">
                🔒
              </span>
            )}
          </div>
          
          {category.description && (
            <p className="tile-description">{category.description}</p>
          )}
          
          <div className="tile-meta">
            <span className="tile-count">
              {category.children_count || 0} subcategories
            </span>
            <span className="tile-count">
              {category.entries_count || 0} entries
            </span>
          </div>
        </div>
      </Link>
      
      {isEditMode && user?.is_dm && (
        <div className="tile-actions">
          <button 
            className="action-btn edit-btn"
            onClick={handleEdit}
            title="Edit category"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
            title="Delete category"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryTile;
