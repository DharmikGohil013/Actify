import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

// Get user initials for profile avatar
function getInitials(name) {
  if (!name) return "";
  return name.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase();
}

// Reusable sidebar link with improved accessibility
function SidebarLink({ to, icon, label, currentPath, badge }) {
  const active = currentPath === to;
  return (
    <Link
      to={to}
      title={label}
      className={`sidebar-link ${active ? "active" : ""}`}
      aria-label={label}
    >
      <span className="icon" role="img" aria-hidden="true">
        {icon}
      </span>
      <span className="label">{label}</span>
      {badge && <span className="badge">{badge}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const role = user?.role || "User";

  // Handle responsive behavior with better detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      const wasMobile = isMobile;
      
      setIsMobile(mobile);
      
      if (mobile && !wasMobile) {
        // Just switched to mobile
        setIsOpen(false);
      } else if (!mobile && wasMobile) {
        // Just switched to desktop
        setIsOpen(false);
      }
    };

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [isMobile]);

  // Close sidebar on mobile when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && isOpen && !e.target.closest('.sidebar') && !e.target.closest('.mobile-sidebar-toggle')) {
        closeWithAnimation();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobile && isOpen) {
        closeWithAnimation();
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  // Debounce function for better performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Animation helpers
  const openWithAnimation = () => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const closeWithAnimation = () => {
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const coreLinks = [
    { 
      to: "/", 
      label: "Dashboard", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 3v6h8V3m-8 18h8V11h-8M3 21h8v-6H3m0-2h8V3H3v10Z"/>
        </svg>
      )
    },
    { 
      to: "/tasks", 
      label: "Daily Tasks", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
     
    },
    { 
      to: "/calendar", 
      label: "Calendar", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      )
    },
    { 
      to: "/upcoming", 
      label: "Upcoming", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
        </svg>
      )
    },
    { 
      to: "/notifications", 
      label: "Notifications", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
      ),
      
    },
    { 
      to: "/settings", 
      label: "Settings", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
        </svg>
      )
    },
  ];

  const extraLinks = [
    { 
      to: "/projects", 
      label: "Team Projects", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2M4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2m9 9c-1.11 0-2-.89-2-2s.89-2 2-2 2 .89 2 2-.89 2-2 2m3 7.5V22h-2v-1.5c0-1.38-1.12-2.5-2.5-2.5h-3c-1.38 0-2.5 1.12-2.5 2.5V22H5v-1.5C5 18.57 6.57 17 8.5 17h3c1.93 0 3.5 1.57 3.5 3.5M16 17v2h2c1.11 0 2-.89 2-2s-.89-2-2-2h-2M4 17c-1.11 0-2 .89-2 2s.89 2 2 2h2v-2H4v-2"/>
        </svg>
      )
    },
    { 
      to: "/friends", 
      label: "Friends", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12.75c1.63 0 3.07.39 4.24.9c1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73c1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1c-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85C21.93 14.21 20.99 14 20 14c-.39 0-.76.04-1.13.1c.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3z"/>
        </svg>
      )
    },
  ];

  const handleToggle = () => {
    if (isMobile) {
      if (isOpen) {
        closeWithAnimation();
      } else {
        openWithAnimation();
      }
    }
    // Removed desktop collapse functionality
  };

  const handleLinkClick = () => {
    if (isMobile && isOpen) {
      closeWithAnimation();
    }
  };

  return (
    <>
      {/* Mobile overlay with improved backdrop */}
      {isMobile && isOpen && (
        <div 
          className={`sidebar-overlay ${isAnimating ? 'animating' : ''}`}
          onClick={closeWithAnimation}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && closeWithAnimation()}
        />
      )}
      
      {/* Enhanced Mobile toggle button */}
      <button 
        className={`mobile-sidebar-toggle ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
        aria-expanded={isOpen}
      >
        <div className="hamburger-container">
          <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
        </div>
      </button>

      <aside 
        className={`sidebar expanded ${isMobile && isOpen ? "mobile-open" : ""} ${isAnimating ? 'animating' : ''}`}
        role="navigation"
        aria-label="Main Navigation"
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-container">
              <img src="/w..png" alt="Actify Logo" />
            </div>
            <span className="label">Actify</span>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav" role="navigation">
            <div className="nav-section">
              <h3 className="nav-title">Main</h3>
              {coreLinks.map(link => (
                <div key={link.to} onClick={handleLinkClick}>
                  <SidebarLink
                    to={link.to}
                    icon={link.icon}
                    label={link.label}
                    currentPath={location.pathname}
                    badge={link.badge}
                  />
                </div>
              ))}
            </div>

            {user && (
              <div className="nav-section">
                <h3 className="nav-title">Social</h3>
                {extraLinks.map(link => (
                  <div key={link.to} onClick={handleLinkClick}>
                    <SidebarLink
                      to={link.to}
                      icon={link.icon}
                      label={link.label}
                      currentPath={location.pathname}
                    />
                  </div>
                ))}
              </div>
            )}

            {role === "Admin" && (
              <div className="nav-section">
                <h3 className="nav-title">Admin</h3>
                <div onClick={handleLinkClick}>
                  <SidebarLink
                    to="/admin/users"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4m0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V12z"/>
                      </svg>
                    }
                    label="Admin Panel"
                    currentPath={location.pathname}
                  />
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Footer Profile */}
        <div className="sidebar-footer">
          <div onClick={handleLinkClick}>
            <Link
              to="/profile"
              className={`profile-link ${location.pathname === "/profile" ? "active" : ""}`}
              title={user?.name || "Profile"}
            >
              <div className="profile-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.name || "Profile"}</span>
                <span className="profile-role">{role}</span>
              </div>
            </Link>
          </div>

          <button 
            className="logout-btn"
            onClick={logoutUser}
            title="Logout"
            aria-label="Logout"
          >            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H4v16h10v-2h2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h10z"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
