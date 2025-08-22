import React from 'react';
import { Link } from 'react-router-dom';
import './EntryTile.css';

const EntryTile = ({ entry, onEdit, onDelete, isEditMode, user }) => {
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(entry);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${entry.title}"?`)) {
      onDelete(entry.id);
    }
  };

  return (
    <div className={`entry-tile ${entry.is_hidden ? 'hidden' : ''}`}>
      <Link to={`/world/entry/${entry.id}`} className="tile-link">
        <div className="tile-content">
          <div className="tile-header">
            <h3 className="tile-title">{entry.title}</h3>
            {entry.is_hidden && (
              <span className="hidden-indicator" title="Hidden content">
                🔒
              </span>
            )}
          </div>
          
          {entry.content && (
            <p className="tile-description">
              {entry.content.length > 150 
                ? `${entry.content.substring(0, 150)}...` 
                : entry.content
              }
            </p>
          )}
          
          <div className="tile-meta">
            <span className="tile-category">{entry.category?.title || 'Uncategorized'}</span>
            <span className="tile-date">
              {new Date(entry.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
      
      {isEditMode && user?.is_dm && (
        <div className="tile-actions">
          <button 
            className="action-btn edit-btn"
            onClick={handleEdit}
            title="Edit entry"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
            title="Delete entry"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default EntryTile;
