import React from 'react';
import { Link } from 'wouter';

export default function ProfileTestPage() {
  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-amber-800 text-center mb-8">
          Profil Sayfaları Test
        </h1>
        
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-amber-700 mb-4">Bu sayfa, farklı ID'li profil sayfalarını test etmek içindir</h2>
          <p className="text-gray-600 mb-4">
            Aşağıdaki linkler, farklı ID'lere sahip kullanıcı profillerine yönlendirme yapacaktır.
            Gerçekte bu ID'ler API'den gelecek ve kullanıcıya ait benzersiz değerler olacaktır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Müşteri Profilleri */}
          <div className="border rounded-lg p-4 bg-amber-50">
            <h3 className="text-lg font-medium text-amber-800 mb-3">Müşteri Profilleri</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/customer/profile/1">
                  <span className="text-amber-600 hover:text-amber-800 hover:underline flex items-center cursor-pointer">
                    <span className="mr-2">👤</span> Müşteri ID: 1 (Ahmet Yılmaz)
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/customer/profile/2">
                  <span className="text-amber-600 hover:text-amber-800 hover:underline flex items-center cursor-pointer">
                    <span className="mr-2">👤</span> Müşteri ID: 2 (Zeynep Kaya)
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/customer/profile/3">
                  <span className="text-amber-600 hover:text-amber-800 hover:underline flex items-center cursor-pointer">
                    <span className="mr-2">👤</span> Müşteri ID: 3 (Mehmet Demir)
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Restoran Profilleri */}
          <div className="border rounded-lg p-4 bg-amber-50">
            <h3 className="text-lg font-medium text-amber-800 mb-3">Restoran Profilleri</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/restaurant/profile/1">
                  <span className="text-amber-600 hover:text-amber-800 hover:underline flex items-center cursor-pointer">
                    <span className="mr-2">🍔</span> Restoran ID: 1 (Kebapçı Selim)
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/restaurant/profile/2">
                  <span className="text-amber-600 hover:text-amber-800 hover:underline flex items-center cursor-pointer">
                    <span className="mr-2">🍕</span> Restoran ID: 2 (Pizza House)
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/restaurant/profile/3">
                  <span className="text-amber-600 hover:text-amber-800 hover:underline flex items-center cursor-pointer">
                    <span className="mr-2">🍣</span> Restoran ID: 3 (Sushi Express)
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurye Profilleri */}
          <div className="border rounded-lg p-4 bg-amber-50">
            <h3 className="text-lg font-medium text-amber-800 mb-3">Kurye Profilleri</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courier/profile/1">
                  <span className="text-amber-600 hover:text-amber-800 hover:underline flex items-center cursor-pointer">
                    <span className="mr-2">🛵</span> Kurye ID: 1 (Ali Öztürk)
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courier/profile/2">
                  <span className="text-amber-600 hover:text-amber-800 hover:underline flex items-center cursor-pointer">
                    <span className="mr-2">🚲</span> Kurye ID: 2 (Ayşe Çelik)
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courier/profile/3">
                  <span className="text-amber-600 hover:text-amber-800 hover:underline flex items-center cursor-pointer">
                    <span className="mr-2">🚗</span> Kurye ID: 3 (Emre Şahin)
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <span className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer">
              Ana Sayfaya Dön
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}