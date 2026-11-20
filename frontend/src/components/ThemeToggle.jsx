
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={darkMode ? "Light mode" : "Dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
      className="flex h-10 w-10 items-center justify-center
        rounded-xl border border-slate-200 bg-white
        text-slate-600 transition hover:bg-slate-100
        dark:border-slate-700 dark:bg-slate-900
        dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {darkMode ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}

export default ThemeToggle;
