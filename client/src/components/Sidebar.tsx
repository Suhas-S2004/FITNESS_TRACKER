import {
  ActivityIcon,
  HomeIcon,
  UserIcon,
  UtensilsIcon,
  MoonIcon,
  SunIcon,
  PersonStandingIcon
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useEffect } from "react"

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/foodlog", label: "Food", icon: UtensilsIcon },
    { path: "/activitylog", label: "Activity", icon: ActivityIcon },
    { path: "/profile", label: "Profile", icon: UserIcon },
  ]

  // This is the CRITICAL change: This logic forces the browser to 
  // actually swap colors by adding the 'dark' class to the HTML root.
//   useEffect(() => {
//     const root = window.document.documentElement;
//     if (theme === 'dark') {
//       root.classList.add('dark');
//     } else {
//       root.classList.remove('dark');
//     }
//   }, [theme]);

  return (
    <nav className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 transition-colors duration-200">

      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center">
          <PersonStandingIcon className="size-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          FitTrack
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 border-l-[3px] transition-all duration-200 ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 font-medium border-emerald-500"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 border-transparent"
              }`
            }
          >
            <item.icon className="size-5" />
            <span className="text-base">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Theme Toggle Button */}
      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={toggleTheme}
          type="button"
          className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors duration-200"
        >
          {theme === "light" ? (
            <MoonIcon className="size-5" />
          ) : (
            <SunIcon className="size-5" />
          )}
          <span className="text-base">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>
      </div>

    </nav>
  )
}

export default Sidebar