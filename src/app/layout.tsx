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
      return;
    }

    axios
      .get('http://localhost:3000/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log('Token valide', res.data);
      })
      .catch((err) => {
        console.error('Token verification failed:', err.response?.data || err.message);
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]); // Added 'router' to the dependency array

  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900 font-sans flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">Synkro</h1>
          <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">À propos</Link>
          <a href="/about" className="hover:text-blue-600 transition-colors">À propos</a>
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
