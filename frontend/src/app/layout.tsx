import React from 'react';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900 font-sans flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">Synkro</h1>
          <nav className="space-x-6 text-gray-700 text-sm font-medium">
            <a href="/" className="hover:text-blue-600 transition-colors">Accueil</a>
            <a href="/about" className="hover:text-blue-600 transition-colors">À propos</a>
          </nav>
        </header>

        {/* MAIN */}
        <main className="max-w-6xl mx-auto p-6 flex-grow">{children}</main>

        {/* FOOTER */}
        <footer className="bg-white shadow-inner p-4 text-center text-sm text-gray-500 mt-10">
          © 2025 - Synkro • Tous droits réservés
        </footer>
      </body>
    </html>
  );
}
