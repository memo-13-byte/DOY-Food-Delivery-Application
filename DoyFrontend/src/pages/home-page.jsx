"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ChevronRight, MapPin } from "lucide-react"
import { useState} from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import DoyLogo from "../components/DoyLogo"

export default function HomePage() {
  const navigate = useNavigate() 
  const [darkMode, setDarkMode] = useState(false)

  useState(() => {
    setDarkMode(false);
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#F2E8D6] dark:bg-[#1c1c1c] transition-colors duration-300">

      <Header darkMode={darkMode} setDarkMode={setDarkMode}/>

      <main className="flex-grow">
        <DoyLogo></DoyLogo>

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
          {localStorage.getItem("token") === null && (
          <div className="flex justify-center gap-5 p-5">
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
          </div>)}
        </div>
      </main>

      <Footer darkMode={darkMode}></Footer>
    </div>
  )
}
