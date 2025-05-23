import { Moon, Sun } from "lucide-react"
import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Switch = ({ checked, onCheckedChange, className }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-primary" : "bg-input"
      } ${className}`}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

export default function Header({darkMode, setDarkMode}) {
  const navigate = useNavigate() 

  const toggleDarkMode = () => {
    console.log("now dark mode: " + !darkMode);
    setDarkMode(!darkMode)
    localStorage.setItem("darkMode", !darkMode)
    if (!darkMode)
        document.documentElement.classList.add("dark")
    else 
        document.documentElement.classList.remove("dark")
  }

  useEffect(() => {
    if (darkMode)
        document.documentElement.classList.add("dark")
    else 
        document.documentElement.classList.remove("dark")
  }, [])

  return (
      <header className="bg-[#47300A] dark:bg-[#333] text-white py-4 px-6 flex justify-between items-center shadow-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center">
          <span className="font-bold text-2xl cursor-pointer tracking-wide" onClick={() => navigate("/")}>DOY!</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              className={`${darkMode ? "bg-amber-500" : "bg-gra-300"} transition-colors duration-300`}
            />
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </div>
          <span className="mx-1 text-white/30">|</span>
          <button
            onClick={() => navigate("/auth")}
            className="bg-[#e8c886] hover:bg-[#d9b978] dark:bg-amber-600 dark:hover:bg-amber-500 transition-colors rounded-full px-5 py-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 text-[#6b4b10] dark:text-white"
          >
            Kayıt
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="bg-[#d9b978] hover:bg-[#c9a968] dark:bg-amber-700 dark:hover:bg-amber-600 transition-colors rounded-full px-5 py-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 text-[#6b4b10] dark:text-white"
          >
            Giriş
          </button>
        </div>
      </header>
)};
