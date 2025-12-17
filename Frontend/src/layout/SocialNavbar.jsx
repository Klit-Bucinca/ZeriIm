import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SocialNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const navClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium ${
      isActive
        ? 'text-primary'
        : 'text-gray-600 hover:text-primary dark:text-gray-300'
    }`;

  return (
    <header className="fixed top-0 z-20 w-full border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link
            to="/posts"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            ZeriIm
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <NavLink to="/posts" className={navClass}>
            Shfleto
          </NavLink>
          {isAdmin && (
            <NavLink to="/dashboard" className={navClass}>
              Admin
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/signin');
                }}
                className="rounded-full border border-primary px-4 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Dil
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="rounded-full border border-primary px-4 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Kyçu
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default SocialNavbar;



