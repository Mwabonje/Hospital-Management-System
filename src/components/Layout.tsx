import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserRound,
  Pill,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link to={path} className={`sidebar-item ${active ? 'active' : ''}`}>
    <Icon size={20} />
    <span>{label}</span>
    {active && <ChevronRight size={16} className="active-chevron" />}
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Patients', path: '/patients' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: UserRound, label: 'Doctors', path: '/doctors' },
    { icon: Pill, label: 'Pharmacy', path: '/pharmacy' },
    { icon: FileText, label: 'Billing', path: '/billing' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">H</div>
          <span>HMS Premium</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Patients, Appointments..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') alert(`Searching for: ${e.currentTarget.value}`);
              }}
            />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" onClick={() => alert("No new notifications")}>
              <Bell size={20} />
              <span className="badge"></span>
            </button>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user?.name || user?.email || 'User'}</span>
                <span className="user-role">{user?.role || 'Staff'}</span>
              </div>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`} alt="User Avatar" />
            </div>
          </div>
        </header>

        <section className="content-viewport">
          {children}
        </section>
      </main>

      <style>{`
        .layout-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 260px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1.5rem 2rem;
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--primary);
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          text-decoration: none;
          color: var(--text-muted);
          border-radius: var(--radius-md);
          font-weight: 500;
          transition: var(--transition);
        }

        .sidebar-item:hover {
          background: var(--background);
          color: var(--primary);
        }

        .sidebar-item.active {
          background: var(--accent);
          color: var(--primary);
        }

        .active-chevron {
          margin-left: auto;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--border);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: none;
          color: var(--danger);
          font-weight: 600;
          border-radius: var(--radius-md);
        }

        .logout-btn:hover {
          background: #fef2f2;
        }

        /* Main Area Styles */
        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f1f5f9;
        }

        .topbar {
          height: 72px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 10;
        }

        .search-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--background);
          padding: 0.625rem 1.25rem;
          border-radius: var(--radius-full);
          width: 100%;
          max-width: 400px;
          border: 1px solid transparent;
          transition: var(--transition);
        }

        .search-container:focus-within {
          border-color: var(--primary);
          background: white;
          box-shadow: var(--shadow-sm);
        }

        .search-container input {
          border: none;
          background: none;
          width: 100%;
          font-size: 0.875rem;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-btn {
          position: relative;
          background: var(--background);
          padding: 0.625rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
        }

        .icon-btn:hover {
          color: var(--primary);
          background: var(--accent);
        }

        .badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--danger);
          border-radius: 50%;
          border: 2px solid white;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-left: 1.5rem;
          border-left: 1px solid var(--border);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .user-profile img {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--accent);
        }

        .content-viewport {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Layout;
