import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children, currentTripId }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentTripId={currentTripId}
      />
      
      <div className="main-wrapper">
        <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        
        <main className="content-container">
          {children}
        </main>
      </div>
    </div>
  );
}
