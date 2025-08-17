"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex bg-red-500 items-center">
            <Image
              src="/logo.png"
              alt="Reclama Golpe"
              width={200}
              height={80}
              className="h-[80px] w-[200px] "
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/golpes"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Golpes
            </Link>
            <Link
              href="/trending"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Trending
            </Link>
            <Link
              href="/verificar"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium flex items-center gap-1"
            >
              Verificar Site
            </Link>
            <Link
              href="/sobre"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/dicas"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Dicas
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/denunciar"
              className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Denunciar Golpe
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Entrar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/verificar"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                🔍 Verificar Site
              </Link>
              <Link
                href="/golpes"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Golpes
              </Link>
              <Link
                href="/trending"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Trending
              </Link>
              <Link
                href="/sobre"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Sobre
              </Link>
              <Link
                href="/dicas"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Dicas
              </Link>
              <Link
                href="/denunciar"
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Denunciar Golpe
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors text-center"
              >
                Entrar
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
