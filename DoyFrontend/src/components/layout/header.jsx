import React from 'react';
import { Link } from 'wouter';
import { cn } from '../../lib/utils';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-[#47300A] backdrop-blur supports-[backdrop-filter]:bg-[#47300A]">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M16.8 2.5c1 0 1.5 0 2.1.2.7.3 1.2.8 1.5 1.5.2.6.2 1.2.2 2.1v2.2c0 2.7 0 4.1-.5 5.2-.4.9-1 1.5-1.9 1.9-1.1.5-2.5.5-5.2.5h-.1c-2.7 0-4.1 0-5.2-.5-.9-.4-1.5-1-1.9-1.9-.5-1.1-.5-2.5-.5-5.2V6.3c0-.9 0-1.5.2-2.1.3-.7.8-1.2 1.5-1.5.6-.2 1.2-.2 2.1-.2h8.7Z" />
              <path d="M9 15.5v2.4a2.1 2.1 0 1 0 4.2 0v-2.4" />
              <path d="M12 2.5v9.65a.2.2 0 0 1-.2.2H8.7a.2.2 0 0 1-.2-.2V2.5" />
              <path d="M16.5 2.5v9.65a.2.2 0 0 1-.2.2h-4.1" />
            </svg>
            <span className="ml-2 text-xl font-bold text-primary">DOY</span>
          </Link>
        </div>
        
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/restaurants">
              <a className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                "text-foreground/60"
              )}>
                Restoranlar
              </a>
            </Link>
            <Link href="/orders">
              <a className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                "text-foreground/60"
              )}>
                Siparişlerim
              </a>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/auth">
              <a className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                "text-foreground/60"
              )}>
                Giriş Yap
              </a>
            </Link>
            <Link href="/cart">
              <a className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span className="ml-2">Sepet</span>
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}