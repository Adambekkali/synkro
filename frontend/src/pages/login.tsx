'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '@/app/globals.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Animation d'apparition au chargement
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.access_token);
      router.push('/');
    } catch (err) {
      setError('Identifiants incorrects');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:3000/utilisateurs', {
      email, prenom: firstName, nom: lastName, mot_de_passe: password
      });
      
      setTimeout(() => {
        setShowLogin(true);
        setIsLoading(false);
        setEmail('');
        setPassword('');
      }, 1000);
      
    } catch (err) {
      setError('Erreur lors de l\'inscription');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div 
        className={`bg-white p-8 rounded-lg shadow-xl w-full max-w-md transition-all duration-500 ease-in-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {showLogin ? 'Connexion' : 'Inscription'}
        </h2>
        
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex w-full max-w-xs">
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                showLogin ? 'bg-white shadow-md text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setShowLogin(true)}
            >
              Connexion
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                !showLogin ? 'bg-white shadow-md text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setShowLogin(false)}
            >
              Inscription
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {showLogin ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="votre@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                {/* <a href="#" className="text-xs text-blue-600 hover:underline">Mot de passe oublié?</a> */}
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div> */}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="register-email"
                type="email"
                placeholder="votre@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="Jean"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Dupont"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                id="register-password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {isLoading ? 'Création du compte...' : "S'inscrire"}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-600">
          {showLogin ? (
            <p>
              Pas encore inscrit ?{' '}
              <button 
                onClick={() => setShowLogin(false)}
                className="text-blue-600 font-medium hover:underline focus:outline-none"
              >
                Créer un compte
              </button>
            </p>
          ) : (
            <p>
              Déjà inscrit ?{' '}
              <button 
                onClick={() => setShowLogin(true)}
                className="text-blue-600 font-medium hover:underline focus:outline-none"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}