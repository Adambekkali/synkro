export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900">
        {/* HEADER */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl blue font-bold">Synkro</h1>
          <nav>
            <a href="/" className="mr-4">Accueil</a>
            <a href="/about">À propos</a>
          </nav>
        </header>

        {/* CONTENU PRINCIPAL */}
        <main className="p-6">{children}</main>

        {/* FOOTER */}
        <footer className="bg-gray-800 text-white p-4 text-center">
          © 2025 - Mon site Next.js
        </footer>
      </body>
    </html>
  );
}
