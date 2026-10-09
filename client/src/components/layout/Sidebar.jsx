import React from 'react';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-group">
        <ul className="sidebar-links">
          <li className="sidebar-item active">
            <span className="sidebar-bullet">▪</span> HOME
          </li>
          <li className="sidebar-item">
            <span className="sidebar-bullet">▪</span> NETWORK
          </li>
          <li className="sidebar-item">
            <span className="sidebar-bullet">▪</span> MESSAGES
          </li>
          <li className="sidebar-item">
            <span className="sidebar-bullet">▪</span> RESOURCES
          </li>
          <li className="sidebar-item">
            <span className="sidebar-bullet">▪</span> EVENTS
          </li>
          <li className="sidebar-item">
            <span className="sidebar-bullet">▪</span> TEAMS
          </li>
        </ul>
      </div>

      <div className="sidebar-group sidebar-bottom">
        <ul className="sidebar-links">
          <li className="sidebar-item">
            <span className="sidebar-bullet">▪</span> PROFILE
          </li>
          <li className="sidebar-item">
            <span className="sidebar-bullet">▪</span> SETTINGS
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
