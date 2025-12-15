import { Link, NavLink } from 'react-router-dom';

const SocialNavbar = () => {
  const isAuthed = false; // mock auth flag

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
        </nav>
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                <span>Profili</span>
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
