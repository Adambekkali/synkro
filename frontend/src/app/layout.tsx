'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import './globals.css';
import Link from 'next/link';
import { useRole } from '@/hooks/useRole';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const { user, loading, isAuthenticated, isCitizen, isOrganizer, isAdmin, logout } = useRole();

  // Pages publiques qui ne nécessitent pas d'authentification
  const publicPages = ['/login'];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (loading) return;

    // Rediriger vers login si pas authentifié (sauf pages publiques)
    if (!isAuthenticated && !isPublicPage) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, isPublicPage, router]);

  // Affichage du loading
  if (loading) {
    return (
      <html lang="fr">
        <body className="bg-gray-100 text-gray-900 font-sans min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </body>
      </html>
    );
  }

  // Pages publiques (login) sans layout
  if (isPublicPage) {
    return (
      <html lang="fr">
        <body className="bg-gray-100 text-gray-900 font-sans">
          {children}
        </body>
      </html>
    );
  }

  // Layout principal pour les utilisateurs connectés
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900 font-sans flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center sticky top-0 z-50">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">Synkro</h1>
          </Link>

          {/* Navigation conditionnelle selon le rôle */}
          <nav className="flex items-center space-x-6">
            {/* Navigation pour tous les utilisateurs */}
            <Link 
              href="/" 
              className={`hover:text-blue-600 transition-colors ${
                pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              Événements
            </Link>

            {/* Navigation pour les Citoyens */}
            {isCitizen && (
              <>
                <Link 
                  href="/my-inscriptions" 
                  className={`hover:text-blue-600 transition-colors ${
                    pathname === '/my-inscriptions' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Mes inscriptions
                </Link>
              </>
            )}

            {/* Navigation pour les Organisateurs */}
            {isOrganizer && (
              <>
                <Link 
                  href="/organizer" 
                  className={`hover:text-blue-600 transition-colors ${
                    pathname === '/organizer' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Espace organisateur
                </Link>
               
              </>
            )}

            {/* Navigation pour les Admins */}
            {isAdmin && (
              <>
                <Link 
                  href="/admin" 
                  className={`hover:text-blue-600 transition-colors ${
                    pathname === '/admin' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Administration
                </Link>
                <Link 
                  href="/organizer" 
                  className={`hover:text-blue-600 transition-colors ${
                    pathname === '/organizer' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Créer événement
                </Link>
              </>
            )}

            {/* Profil pour tous */}
            <Link 
              href="/profil" 
              className={`hover:text-blue-600 transition-colors ${
                pathname === '/profil' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              Profil
            </Link>
          </nav>

          {/* Informations utilisateur et déconnexion */}
          <div className="flex items-center space-x-4">
            {/* Badge de rôle */}
            {user && (
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isCitizen ? 'bg-green-100 text-green-800' :
                  isOrganizer ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {isCitizen && '🏠 Citoyen'}
                  {isOrganizer && '🏛️ Organisateur'}
                  {isAdmin && '👑 Admin'}
                </span>
                
                {/* Nom d'organisation pour les organisateurs */}
                {isOrganizer && user.organization && (
                  <span className="text-sm text-gray-600">
                    ({user.organization})
                  </span>
                )}
              </div>
            )}

            {/* Bouton de déconnexion */}
            <button
              onClick={logout}
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Message de bienvenue selon le rôle */}
        {user && pathname === '/' && (
          <div className={`px-8 py-3 text-sm ${
            isCitizen ? 'bg-green-50 text-green-800 border-b border-green-200' :
            isOrganizer ? 'bg-blue-50 text-blue-800 border-b border-blue-200' :
            'bg-purple-50 text-purple-800 border-b border-purple-200'
          }`}>
            {isCitizen && (
              <p>👋 Bienvenue ! Découvrez les événements organisés dans votre ville.</p>
            )}
            {isOrganizer && (
              <p>👋 Bienvenue dans votre espace organisateur ! Créez et gérez vos événements.</p>
            )}
            {isAdmin && (
              <p>👋 Bienvenue dans l'interface d'administration. Vous avez accès à toutes les fonctionnalités.</p>
            )}
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-grow">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-white shadow-inner p-4 text-center text-sm text-gray-500 mt-10">
          <div className="max-w-6xl mx-auto">
            © 2025 - Synkro • Plateforme d'événements locaux • Tous droits réservés
            {user && (
              <span className="ml-4 text-gray-400">
                Connecté en tant que {user.email}
              </span>
            )}
          </div>
        </footer>
      </body>
    </html>
  );
}