import { Link, useLocation, useNavigate } from "react-router";
import {
  PageIcon,
  PlugInIcon,
  HorizontaLDots,
  UserCircleIcon,
  CalenderIcon,
  ListIcon,
  GridIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { name: "Postimet", icon: <PageIcon />, path: "/posts" },
  { name: "Përdoruesit", icon: <UserCircleIcon />, path: "/dashboard" },
  { name: "Komunat", icon: <CalenderIcon />, path: "/municipalities" },
  { name: "Kategoritë", icon: <ListIcon />, path: "/categories" },
  { name: "Prioritetet", icon: <GridIcon />, path: "/priority" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <h2
            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isExpanded || isHovered || isMobileOpen ? (
              "Menu"
            ) : (
              <HorizontaLDots className="size-6" />
            )}
          </h2>
          <div className="space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto mb-6 px-1">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/signin");
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/50 dark:text-red-300 dark:hover:bg-red-900/20"
          >
            <PlugInIcon />
            {(isExpanded || isHovered || isMobileOpen) && <span>Dalje</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
