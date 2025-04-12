import { Link } from "wouter"
import { Button } from "../components/ui/button"
import { ChevronRight, MapPin, Twitter, Instagram, Youtube, Linkedin, Menu } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
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
            <button className="rounded-full w-9 h-9 bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
              <span className="text-white text-xs font-medium">TR</span>
            </button>
            <button className="rounded-full w-9 h-9 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
              <span className="text-white/80 text-xs font-medium">EN</span>
            </button>
          </div>
          <span className="mx-1 text-white/30">|</span>
          <button className="bg-amber-600 hover:bg-amber-500 transition-colors rounded-full px-5 py-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
            Kayıt
          </button>
          <button className="bg-amber-500 hover:bg-amber-400 transition-colors rounded-full px-5 py-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
            Giriş
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-amber-700 text-white p-4 shadow-md">
          <div className="flex justify-center gap-3 mb-4">
            <button className="rounded-full w-9 h-9 bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
              <span className="text-white text-xs font-medium">TR</span>
            </button>
            <button className="rounded-full w-9 h-9 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
              <span className="text-white/80 text-xs font-medium">EN</span>
            </button>
          </div>
          <div className="flex gap-3">
            <button className="bg-amber-600 hover:bg-amber-500 transition-colors rounded-full px-4 py-2 text-sm font-medium flex-1">
              Kayıt
            </button>
            <button className="bg-amber-500 hover:bg-amber-400 transition-colors rounded-full px-4 py-2 text-sm font-medium flex-1">
              Giriş
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {/* Logo section */}
        <div className="flex justify-center py-10">
          <div className="w-40 h-40 flex items-center justify-center bg-white rounded-full shadow-xl p-2 transform hover:scale-105 transition-transform duration-300">
            <img
              src="/image1.png"
              alt="DOY Logo"
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Welcome message */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between mb-12 transform hover:shadow-xl transition-shadow duration-300">
            <p className="text-amber-800 font-medium text-lg mb-4 sm:mb-0">Konumunu seç, karnın doysun!</p>
            <Link href="/restaurants/browse">
              <Button className="bg-amber-500 hover:bg-amber-400 text-white rounded-full flex items-center gap-2 px-6 py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                <MapPin className="w-4 h-4" />
                <span>Adresini Belirle veya Seç</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Main sections */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 transform hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-amber-800 mb-6 border-b border-amber-100 pb-3">Hakkımızda</h2>
            <div className="text-gray-700 space-y-4">
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
              <p className="leading-relaxed font-medium text-amber-700">
                Sen "Açım!" dediğinde, biz hep buradayız: DOY!
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Customer Section */}
            <div className="bg-white rounded-2xl shadow-lg p-7 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-amber-200">
              <h2 className="text-xl font-bold text-amber-800 mb-4">Müşterimiz Olun!</h2>
              <p className="text-gray-600 mb-6 h-16">Kolay online yemek siparişi deneyimi için müşterimiz olun.</p>
              <div className="flex flex-col gap-3">
                <Link href="/auth?tab=register">
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-white rounded-lg py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                    Müşteri Kayıt
                  </Button>
                </Link>
                <Link href="/auth?tab=login">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-800 hover:bg-amber-100 rounded-lg py-2.5"
                  >
                    Müşteri Giriş
                  </Button>
                </Link>
              </div>
            </div>

            {/* Restaurant Section */}
            <div className="bg-white rounded-2xl shadow-lg p-7 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-amber-200">
              <h2 className="text-xl font-bold text-amber-800 mb-4">Restoran İş Ortağımız Olun!</h2>
              <p className="text-gray-600 mb-6 h-16">Menünüzü müşteriye kolayca ulaştırmak için iş ortağımız olun.</p>
              <div className="flex flex-col gap-3">
                <Link href="/restaurants/register">
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-white rounded-lg py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                    Restoran Kayıt
                  </Button>
                </Link>
                <Link href="/auth?tab=login&type=restaurant">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-800 hover:bg-amber-100 rounded-lg py-2.5"
                  >
                    Restoran Giriş
                  </Button>
                </Link>
              </div>
            </div>

            {/* Courier Section */}
            <div className="bg-white rounded-2xl shadow-lg p-7 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-amber-200">
              <h2 className="text-xl font-bold text-amber-800 mb-4">Kuryemiz Olun!</h2>
              <p className="text-gray-600 mb-6 h-16">Siparişleri müşterilerimize ulaştırmak için kuryemiz olun.</p>
              <div className="flex flex-col gap-3">
                <Link href="/couriers/register">
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-white rounded-lg py-2.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                    Kurye Kayıt
                  </Button>
                </Link>
                <Link href="/auth?tab=login&type=courier">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-800 hover:bg-amber-100 rounded-lg py-2.5"
                  >
                    Kurye Giriş
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#47300A] text-white p-10 mt-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="bg-white rounded-full p-4 w-28 h-28 flex items-center justify-center shadow-lg transform hover:rotate-3 transition-transform duration-300">
              <div className="relative w-24 h-24">
                <img src="/image1.png" alt="DOY Logo" className="w-full h-full rounded-full" />
                <div className="text-center text-[10px] font-bold mt-1 text-amber-800">FOOD DELIVERY</div>
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
