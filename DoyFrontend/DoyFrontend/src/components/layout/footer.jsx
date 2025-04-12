import React from 'react';
import { Link } from 'wouter';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted py-8 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">DOY</h3>
            <p className="text-sm text-muted-foreground">
              Türkiye'nin en hızlı ve güvenilir yemek teslimat platformu.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Hakkımızda</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about">
                  <a className="hover:text-primary transition-colors">Hakkımızda</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="hover:text-primary transition-colors">Kariyer</a>
                </Link>
              </li>
              <li>
                <Link href="/press">
                  <a className="hover:text-primary transition-colors">Basın</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">İş Ortakları</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/restaurant-register">
                  <a className="hover:text-primary transition-colors">Restoran Kayıt</a>
                </Link>
              </li>
              <li>
                <Link href="/courier-register">
                  <a className="hover:text-primary transition-colors">Kurye Kayıt</a>
                </Link>
              </li>
              <li>
                <Link href="/partners">
                  <a className="hover:text-primary transition-colors">İş Ortaklıkları</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/support">
                  <a className="hover:text-primary transition-colors">Destek</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="hover:text-primary transition-colors">Sık Sorulan Sorular</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-primary transition-colors">İletişim</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} DOY Yemek Teslimatı. Tüm hakları saklıdır.
          </div>
          
          <div className="flex space-x-6">
            <Link href="/terms">
              <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Kullanım Koşulları
              </a>
            </Link>
            <Link href="/privacy">
              <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Gizlilik Politikası
              </a>
            </Link>
            <Link href="/cookies">
              <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Çerez Politikası
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}