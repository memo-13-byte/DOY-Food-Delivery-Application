"use client"

import { useNavigate } from "react-router-dom" // Wouter yerine react-router-dom kullanıyoruz
import { Button } from "../components/ui/button"
import { ChevronRight, MapPin, Twitter, Instagram, Youtube, Linkedin, Menu, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"

// Add Switch component
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

export default function HomePage() {
  const navigate = useNavigate() // React Router'ın useNavigate hook'unu kullanıyoruz
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    }
  }

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#F2E8D6] dark:bg-[#1c1c1c] transition-colors duration-300">
      {/* Header section */}
      <header className="bg-[#47300A] dark:bg-[#333] text-white py-4 px-6 flex justify-between items-center shadow-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center">
          <span className="font-bold text-2xl tracking-wide">DOY!</span>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full w-10 h-10 bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              className={`${darkMode ? "bg-amber-500" : "bg-gray-300"} transition-colors duration-300`}
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#6b4b10] dark:bg-gray-800 text-white p-4 shadow-md transition-colors duration-300">
          <div className="flex justify-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className={`${darkMode ? "bg-amber-500" : "bg-gray-300"} transition-colors duration-300`}
              />
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="bg-[#e8c886] hover:bg-[#d9b978] dark:bg-amber-600 dark:hover:bg-amber-500 transition-colors rounded-full px-4 py-2 text-sm font-medium flex-1 text-[#6b4b10] dark:text-white"
            >
              Kayıt
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-[#d9b978] hover:bg-[#c9a968] dark:bg-amber-700 dark:hover:bg-amber-600 transition-colors rounded-full px-4 py-2 text-sm font-medium flex-1 text-[#6b4b10] dark:text-white"
            >
              Giriş
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {/* Logo section */}
        <div className="flex justify-center py-10">
          <div className="w-40 h-40 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-xl p-2 transform hover:scale-105 transition-transform duration-300">
            <img src="/image1.png" alt="DOY Logo" className="w-36 h-36 rounded-full object-cover" />
          </div>
        </div>

        {/* Welcome message */}
        <div className="max-w-[75%] mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between mb-12 transform hover:shadow-xl transition-shadow duration-300">
            <p className="text-amber-800 dark:text-amber-400 font-medium text-2xl mb-4 sm:mb-0">
              Konumunu seç, karnın doysun!
            </p>
            {/* Wouter Link yerine Button kullanıyoruz */}
            <Button
              onClick={() => navigate("/restaurants/browse")}
              className="text-base bg-[#e8c886] hover:bg-[#d9b978] dark:bg-amber-600 dark:hover:bg-amber-500 text-[#6b4b10] dark:text-white rounded-full flex items-center gap-2 px-6 py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
            >
              <MapPin className="w-4 h-4" />
              <span>Adresini Belirle veya Seç</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main sections */}
        <div className="max-w-[75%] mx-auto px-4 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transform hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-[#6b4b10] dark:text-amber-400 mb-6 border-b border-amber-100 dark:border-gray-700 pb-3">
              Hakkımızda
            </h2>
            <div className="text-lg text-gray-700 dark:text-gray-300 space-y-4">
              <p className="leading-relaxed">
                DOY!, lezzeti en hızlı ve en güvenilir şekilde kapına getirmek için yola çıkan bir online yemek siparişi
                platformudur.
              </p>
              <p className="leading-relaxed">
                Yemek siparişini kolaylaştıran arayüzümüz ve kullanıcı dostu deneyimimizle, favori restoranlarını sadece
                birkaç tıklama uzağına getiriyoruz.
              </p>
              <p className="leading-relaxed">
                Amacımız, kullanıcılarımıza geniş bir restoran ağı, çeşitli mutfaklar ve uygun fiyatlı menüler sunarak
                doyurucu ve keyifli bir yemek deneyimi yaşatmak.
              </p>
              <p className="leading-relaxed">
                Güvenli ödeme sistemimiz, hızlı teslimat altyapımız ve sürekli gelişen teknolojimizle her gün daha iyiye
                gidiyoruz.
              </p>
              <p className="leading-relaxed font-medium text-amber-700 dark:text-amber-400">
                Sen "Açım!" dediğinde, biz hep buradayız: DOY!
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-[70%] mx-auto">
            {/* Customer Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-amber-200 dark:hover:border-amber-700">
              <h2 className="text-2xl font-bold text-[#6b4b10] dark:text-amber-400 mb-4">Müşterimiz Olun!</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 h-16">
                Kolay online yemek siparişi deneyimi için müşterimiz olun.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/auth?tab=register")}
                  className="text-base w-full bg-[#2a8e4b] hover:bg-[#237a40] dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                >
                  Müşteri Kayıt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth?tab=login")}
                  className="text-base w-full border-[#2a8e4b] dark:border-green-700 text-[#6b4b10] dark:text-amber-400 hover:bg-[#e8f5ec] dark:hover:bg-gray-700 rounded-lg py-2.5 transition-colors duration-200"
                >
                  Müşteri Giriş
                </Button>
              </div>
            </div>

            {/* Restaurant Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-amber-200 dark:hover:border-amber-700">
              <h2 className="text-2xl font-bold text-[#6b4b10] dark:text-amber-400 mb-4">
                Restoran İş Ortağımız Olun!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 h-16">
                Menünüzü müşteriye kolayca ulaştırmak için iş ortağımız olun.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/restaurants/register")}
                  className="text-base w-full bg-[#2a8e4b] hover:bg-[#237a40] dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                >
                  Restoran Kayıt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth?tab=login&type=restaurant")}
                  className="text-base w-full border-[#2a8e4b] dark:border-green-700 text-[#6b4b10] dark:text-amber-400 hover:bg-[#e8f5ec] dark:hover:bg-gray-700 rounded-lg py-2.5 transition-colors duration-200"
                >
                  Restoran Giriş
                </Button>
              </div>
            </div>

            {/* Courier Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-amber-200 dark:hover:border-amber-700">
              <h2 className="text-2xl font-bold text-[#6b4b10] dark:text-amber-400 mb-4">Kuryemiz Olun!</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 h-16">
                Siparişleri müşterilerimize ulaştırmak için kuryemiz olun.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/couriers/register")}
                  className="text-base w-full bg-[#2a8e4b] hover:bg-[#237a40] dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                >
                  Kurye Kayıt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth?tab=login&type=courier")}
                  className="text-base w-full border-[#2a8e4b] dark:border-green-700 text-[#6b4b10] dark:text-amber-400 hover:bg-[#e8f5ec] dark:hover:bg-gray-700 rounded-lg py-2.5 transition-colors duration-200"
                >
                  Kurye Giriş
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 p-8 flex justify-between items-center bg-white dark:bg-[#1a1a1a] transition-colors duration-300">
        <img src="/image1.png" alt="DOY Logo" className="h-[50px] w-[50px] rounded-full object-cover" />

        <div className="flex gap-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Youtube size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline p-[0.4rem] rounded-full transition-colors duration-300 cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Linkedin size={24} />
          </a>
        </div>
      </footer>
    </div>
  )
}
