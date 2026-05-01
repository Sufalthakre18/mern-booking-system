import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
      pathname === path
        ? 'text-[var(--sage)]'
        : 'text-[var(--text-2)] hover:text-[var(--text)]'
    }`;

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-lg tracking-tight"
          style={{ color: 'var(--sage)' }}
        >
          <span className="text-xl">🌿</span>
          <span>ExpertBook</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/" className={linkClass('/')}>Experts</Link>
          <Link to="/my-bookings" className={linkClass('/my-bookings')}>My Bookings</Link>
        </div>
      </div>
    </nav>
  );
}