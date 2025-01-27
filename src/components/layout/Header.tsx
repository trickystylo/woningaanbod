import React, { useState } from 'react';
import { Menu as MenuIcon, X, ChevronDown, LayoutDashboard, Building2, Settings, Key, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthMenu } from '../auth/AuthMenu';
import { CountryMenu } from './CountryMenu';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRole } from '../../hooks/useUserRole';

export function Header() {
  const { user } = useAuth();
  const { isAdmin, isRealtor, isOwner } = useUserRole();
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [isMobileCountryMenuOpen, setIsMobileCountryMenuOpen] = useState(false);

  const closeAllMenus = () => {
    setIsAuthMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileCountryMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3" onClick={closeAllMenus}>
              <div className="w-10 h-10 relative">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  {/* House */}
                  <path
                    fill="url(#logoGradient)"
                    d="M12 2L2 12h2v8h5v-5h6v5h5v-8h2L12 2z"
                  />
                  {/* EU Circle */}
                  <circle
                    cx="12"
                    cy="12"
                    r="7"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="1.5"
                    strokeDasharray="3,2"
                  />
                  {/* Star */}
                  <path
                    fill="#2563eb"
                    d="M12 7l1 1.732L15 9.5l-1 1.732.5 2h-5l.5-2-1-1.732L11 8.732z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Woningaanbod</span>
                <span className="text-xl font-bold text-blue-600">.eu</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <div className="relative">
                <button
                  onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
                  onMouseEnter={() => setIsCountryMenuOpen(true)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 py-2"
                >
                  <span>Landen</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCountryMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCountryMenuOpen && (
                  <div 
                    className="absolute top-full left-0 pt-2" 
                    onMouseLeave={() => setIsCountryMenuOpen(false)}
                  >
                    <div className="py-2 bg-white rounded-lg shadow-lg">
                      <CountryMenu 
                        onSelect={() => {
                          setIsCountryMenuOpen(false);
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/zoeken" className="text-gray-600 hover:text-blue-600">
                Alle woningen
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  {isRealtor && (
                    <Link to="/makelaar" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      <span>Makelaar</span>
                    </Link>
                  )}
                  {isOwner && (
                    <Link to="/owner" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      <span>Mijn Woning</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsAuthMenuOpen(true)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </button>
            </div>

            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setIsAuthMenuOpen(true)}
                className="text-gray-600 hover:text-blue-600"
              >
                <User className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-1">
              <button
                onClick={() => setIsMobileCountryMenuOpen(!isMobileCountryMenuOpen)}
                className="w-full text-left py-2 text-gray-600"
              >
                Landen
              </button>
              {isMobileCountryMenuOpen && (
                <div className="pl-4">
                  <CountryMenu 
                    mobile 
                    onSelect={() => {
                      setIsMobileCountryMenuOpen(false);
                      setIsMobileMenuOpen(false);
                    }} 
                  />
                </div>
              )}
              <Link
                to="/zoeken"
                className="block py-2 text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Alle woningen
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-gray-600 flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  {isRealtor && (
                    <Link
                      to="/makelaar"
                      className="block py-2 text-gray-600 flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Building2 className="w-5 h-5" />
                      <span>Makelaar</span>
                    </Link>
                  )}
                  {isOwner && (
                    <Link
                      to="/owner"
                      className="block py-2 text-gray-600 flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Key className="w-5 h-5" />
                      <span>Mijn Woning</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-2 text-gray-600 flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthMenu isOpen={isAuthMenuOpen} onClose={() => setIsAuthMenuOpen(false)} />
    </>
  );
}