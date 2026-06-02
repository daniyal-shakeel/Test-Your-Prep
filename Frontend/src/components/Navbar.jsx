import { Menu, Home, BookOpen } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, toggleHistory }) {
  return (
    <header className="navbar">
      <div className="navbar-container container-lambo">
        {/* Drawer triggers */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={() => toggleHistory('history')}
            className="navbar-history-btn"
            title="View Marks History"
          >
            <Menu size={20} />
            <span className="hidden sm:inline-block">
              HISTORY
            </span>
          </button>

          <button
            onClick={() => toggleHistory('drafts')}
            className="navbar-history-btn"
            title="View Draft Tests"
            style={{ color: 'var(--color-gold-text)' }}
          >
            <BookOpen size={16} />
            <span className="hidden sm:inline-block" style={{ color: 'var(--color-smoke)' }}>
              DRAFTS
            </span>
          </button>
        </div>

        {/* Title / Branding */}
        <div className="navbar-brand" onClick={() => setActivePage('home')}>
          <h1>
            TEST YOUR <span className="text-lambo-gold">PREPARATION</span>
          </h1>
        </div>

        {/* Quick Nav Links */}
        <nav className="navbar-nav-links">
          <button
            onClick={() => setActivePage('home')}
            className={`navbar-nav-btn ${activePage === 'home' ? 'active' : 'inactive'}`}
            title="Go to Home"
          >
            <Home size={15} />
            <span className="hidden md:inline">HOME</span>
          </button>

          <button
            onClick={() => setActivePage('bank')}
            className={`navbar-nav-btn ${activePage === 'bank' ? 'active' : 'inactive'}`}
            title="View Question Bank"
          >
            <BookOpen size={15} />
            <span className="hidden md:inline">BANK</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
