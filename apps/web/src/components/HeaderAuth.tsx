"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout, getUser } from "@/lib/auth";

export default function HeaderAuth() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status on mount and after navigation
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
      setUser(getUser());
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener("storage", checkAuth);

    // Check auth on focus (when user comes back to tab)
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Reclama Golpe"
              width={180}
              height={60}
              className="h-[60px] w-auto"
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

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="font-medium">{user?.name || "Usuário"}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    {user?.isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                          </svg>
                          Painel Admin
                        </div>
                      </Link>
                    )}

                    <Link
                      href="/painel"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Meu Painel
                      </div>
                    </Link>

                    <Link
                      href="/painel/denuncias"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
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
                        Minhas Denúncias
                      </div>
                    </Link>

                    <Link
                      href="/painel/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Editar Perfil
                      </div>
                    </Link>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sair
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Entrar
              </Link>
            )}
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

              {isLoggedIn ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="px-2 mb-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/painel"
                      className="block text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Meu Painel
                    </Link>
                    <Link
                      href="/painel/denuncias"
                      className="block text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Minhas Denúncias
                    </Link>
                    <Link
                      href="/painel/perfil"
                      className="block text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Editar Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 transition-colors text-left w-full mt-2"
                    >
                      Sair
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-center"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
