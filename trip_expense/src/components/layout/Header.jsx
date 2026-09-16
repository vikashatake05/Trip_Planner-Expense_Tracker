import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-search">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search trips, expenses..." 
            aria-label="Search"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-badge" />
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            VS
          </div>
          <div className="user-info">
            <span className="user-name">Vikas S</span>
            <span className="user-role">Trip Planner</span>
          </div>
        </div>
      </div>
    </header>
  );
}
