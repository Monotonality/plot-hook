import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryTile.css';

const CategoryTile = ({ category, onEdit, onDelete, isEditMode, user }) => {
  const {
    id,
    title,
    description,
    book_type,
    is_hidden,
    children_count,
    entries_count,
    full_path
  } = category;

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(category);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  const canEdit = user?.is_dm || (user?.is_player && book_type === 'adventurer');

  return (
    <div className={`category-tile ${is_hidden ? 'hidden' : ''}`}>
      <Link to={`/${book_type}/category/${id}`} className="tile-link">
        <div className="tile-header">
          <div className="tile-icon">
            {book_type === 'world' && '🌍'}
            {book_type === 'adventurer' && '⚔️'}
            {book_type === 'story' && '📖'}
          </div>
          {is_hidden && (
            <div className="hidden-indicator" title="Hidden from players">
              👁️‍🗨️
            </div>
          )}
          {isEditMode && canEdit && (
            <div className="edit-controls">
              <button
                className="edit-btn"
                onClick={handleEdit}
                title="Edit category"
              >
                ✏️
              </button>
              <button
                className="delete-btn"
                onClick={handleDelete}
                title="Delete category"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        <div className="tile-content">
          <h3 className="tile-title">{title}</h3>
          {description && (
            <p className="tile-description">{description}</p>
          )}
          <div className="tile-path">{full_path}</div>
        </div>

        <div className="tile-footer">
          <div className="tile-stats">
            <span className="stat">
              <span className="stat-icon">📁</span>
              {children_count} subcategories
            </span>
            <span className="stat">
              <span className="stat-icon">📄</span>
              {entries_count} entries
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryTile;
