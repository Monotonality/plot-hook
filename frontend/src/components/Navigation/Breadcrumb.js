import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index === items.length - 1 ? (
              <span className="breadcrumb-current" aria-current="page">
                {item.name}
              </span>
            ) : (
              <>
                <Link to={item.path} className="breadcrumb-link">
                  {item.name}
                </Link>
                <span className="breadcrumb-separator">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
