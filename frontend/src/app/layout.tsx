'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import './globals.css';
import Link from 'next/link';
import axios from 'axios';
export default function Layout({ children }: { children: React.ReactNode }) {

  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    axios
    .get('http://localhost:3000/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log('Token valide', res.data);
    })
    .catch((err) => {
      localStorage.removeItem('token');
      router.push('/login/page');
      console.error('Token invalide', err);
    });

  }, []);
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900 font-sans flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">Synkro</h1>
            <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">À propos</Link>
            <a href="/profil" className="hover:text-blue-600 transition-colors">Profil</a>
            <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition transform hover:scale-105 hover:cursor-pointer touch:cursor-pointer"
        >
          Déconnexion
        </button>
      </div>
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
