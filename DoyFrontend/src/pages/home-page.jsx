"use client"

import { useNavigate } from "react-router-dom" // Wouter yerine react-router-dom kullanıyoruz
import { Button } from "../components/ui/button"
import { ChevronRight, MapPin, Twitter, Instagram, Youtube, Linkedin, Menu, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
      {/* Header section */}
      <header className="bg-[#47300A] text-white py-4 px-6 flex justify-between items-center shadow-lg sticky top-0 z-50">
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
            <button
              onClick={toggleDarkMode}
              className="rounded-full w-9 h-9 bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <span className="mx-1 text-white/30">|</span>
          <button
            onClick={() => navigate("/auth")}
            className="bg-amber-600 hover:bg-amber-500 transition-colors rounded-full px-5 py-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
          >
            Kayıt
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="bg-amber-500 hover:bg-amber-400 transition-colors rounded-full px-5 py-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
          >
            Giriş
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-amber-700 text-white p-4 shadow-md">
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={toggleDarkMode}
              className="rounded-full w-9 h-9 bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="bg-amber-600 hover:bg-amber-500 transition-colors rounded-full px-4 py-2 text-sm font-medium flex-1"
            >
              Kayıt
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-amber-500 hover:bg-amber-400 transition-colors rounded-full px-4 py-2 text-sm font-medium flex-1"
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
              className="text-xl bg-amber-500 hover:bg-amber-400 text-white text-2xl rounded-full flex items-center gap-2 px-6 py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
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
            <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-400 mb-6 border-b border-amber-100 dark:border-gray-700 pb-3">
              Hakkımızda
            </h2>
            <div className="text-2xl text-gray-700 dark:text-gray-300 space-y-4">
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
              <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-4">Müşterimiz Olun!</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 h-16">
                Kolay online yemek siparişi deneyimi için müşterimiz olun.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/auth?tab=register")}
                  className="text-xl w-full bg-amber-500 hover:bg-amber-400 text-white rounded-lg py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                >
                  Müşteri Kayıt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth?tab=login")}
                  className="text-xl w-full border-amber-300 text-amber-800 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-gray-700 rounded-lg py-2.5"
                >
                  Müşteri Giriş
                </Button>
              </div>
            </div>

            {/* Restaurant Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-amber-200 dark:hover:border-amber-700">
              <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-4">
                Restoran İş Ortağımız Olun!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 h-16">
                Menünüzü müşteriye kolayca ulaştırmak için iş ortağımız olun.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/restaurants/register")}
                  className="text-xl w-full bg-amber-500 hover:bg-amber-400 text-white rounded-lg py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                >
                  Restoran Kayıt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth?tab=login&type=restaurant")}
                  className="text-xl w-full border-amber-300 text-amber-800 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-gray-700 rounded-lg py-2.5"
                >
                  Restoran Giriş
                </Button>
              </div>
            </div>

            {/* Courier Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-amber-200 dark:hover:border-amber-700">
              <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-4">Kuryemiz Olun!</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 h-16">
                Siparişleri müşterilerimize ulaştırmak için kuryemiz olun.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/couriers/register")}
                  className="text-xl w-full bg-amber-500 hover:bg-amber-400 text-white rounded-lg py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                >
                  Kurye Kayıt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/auth?tab=login&type=courier")}
                  className="text-xl w-full border-amber-300 text-amber-800 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-gray-700 rounded-lg py-2.5"
                >
                  Kurye Giriş
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#47300A] text-white py-6 px-10 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="bg-white dark:bg-gray-700 rounded-full p-4 w-28 h-28 flex items-center justify-center shadow-lg transform hover:rotate-3 transition-transform duration-300">
              <div className="relative w-24 h-24">
                <img src="/image1.png" alt="DOY Logo" className="w-full h-full rounded-full" />
                <div className="text-center text-[10px] font-bold mt-1 text-amber-800 dark:text-amber-400">
                  FOOD DELIVERY
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="text-xl font-medium mb-4">Bizi Takip Edin</div>
            <div className="flex gap-5">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6 text-sm text-white/80">© 2025 DOY! Tüm hakları saklıdır.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
