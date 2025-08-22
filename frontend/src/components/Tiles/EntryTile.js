import React from 'react';
import { Link } from 'react-router-dom';
import './EntryTile.css';

const EntryTile = ({ entry, onEdit, onDelete, isEditMode, user }) => {
  const {
    id,
    title,
    content_preview,
    book_type,
    is_hidden,
    category_title,
    owner_username,
    created_at,
    outgoing_references_count,
    incoming_references_count
  } = entry;

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(entry);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  const canEdit = user?.is_dm || (user?.is_player && book_type === 'adventurer' && owner_username === user?.username);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`entry-tile ${is_hidden ? 'hidden' : ''}`}>
      <Link to={`/${book_type}/entry/${id}`} className="tile-link">
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
                title="Edit entry"
              >
                ✏️
              </button>
              <button
                className="delete-btn"
                onClick={handleDelete}
                title="Delete entry"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        <div className="tile-content">
          <h3 className="tile-title">{title}</h3>
          {content_preview && (
            <p className="tile-preview">{content_preview}</p>
          )}
          <div className="tile-meta">
            <span className="category-name">{category_title}</span>
            <span className="author-name">by {owner_username}</span>
          </div>
        </div>

        <div className="tile-footer">
          <div className="tile-stats">
            <span className="stat">
              <span className="stat-icon">📅</span>
              {formatDate(created_at)}
            </span>
            {(outgoing_references_count > 0 || incoming_references_count > 0) && (
              <span className="stat">
                <span className="stat-icon">🔗</span>
                {outgoing_references_count + incoming_references_count} links
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EntryTile;
