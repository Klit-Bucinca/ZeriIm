import { Outlet } from 'react-router-dom';
import SocialNavbar from './SocialNavbar';

const SocialLayout = () => {
  return (
    <div className="min-h-screen text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <SocialNavbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default SocialLayout;
