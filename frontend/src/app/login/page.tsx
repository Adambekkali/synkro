'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserRole } from '@/app/types';

// Interfaces locales
interface RegisterData {
  email: string;
  mot_de_passe: string;
  nom: string;
  prenom: string;
  role: UserRole;
  organization?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [organization, setOrganization] = useState('');
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
      const loginData: LoginData = { email, password };
      console.log('=== DÉBUT DEBUG CONNEXION ===');
      console.log('Données envoyées:', loginData);
      
      const res = await axios.post('http://localhost:3000/auth/login', loginData);

      console.log('=== RÉPONSE SERVEUR ===');
      console.log('Status:', res.status);
      console.log('Données complètes:', res.data);
      console.log('Token reçu:', res.data.access_token);

      // Stocker le token
      localStorage.setItem('token', res.data.access_token);
      console.log('Token stocké dans localStorage');

      // Décoder le token pour vérifier son contenu
      try {
        const tokenParts = res.data.access_token.split('.');
        console.log('Parties du token:', tokenParts.length);
        
        if (tokenParts.length === 3) {
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf-8'));
          console.log('=== PAYLOAD DU TOKEN ===');
          console.log('Payload complet:', payload);
          console.log('ID utilisateur:', payload.id);
          console.log('Email:', payload.username);
          console.log('Rôle:', payload.role);
          console.log('Organisation:', payload.organization);
          console.log('Expiration:', new Date(payload.exp * 1000));
          
          // Vérifier si le rôle est correct
          if (payload.role && Object.values(UserRole).includes(payload.role)) {
            console.log('✅ Rôle valide:', payload.role);
          } else {
            console.error('❌ Rôle invalide ou manquant:', payload.role);
          }
        }
      } catch (decodeError) {
        console.error('❌ Erreur décodage token:', decodeError);
      }

      console.log('=== TENTATIVE DE REDIRECTION ===');
      console.log('Avant redirection - Token présent:', !!localStorage.getItem('token'));
      
      // Essayer plusieurs méthodes de redirection
      console.log('Méthode 1: router.push()');
      router.push('/');
      
      // Backup après un délai
      setTimeout(() => {
        console.log('Méthode 2: window.location (backup)');
        window.location.href = '/';
      }, 1000);

      // Backup immédiat si router.push ne fonctionne pas
      setTimeout(() => {
        if (window.location.pathname === '/login') {
          console.log('Méthode 3: window.location (forcé)');
          window.location.replace('/');
        }
      }, 2000);
      
    } catch (err: any) {
      console.error('=== ERREUR CONNEXION ===');
      console.error('Erreur complète:', err);
      console.error('Response:', err.response);
      
      if (err.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur de connexion. Vérifiez que le serveur est démarré.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (role === UserRole.ORGANIZER && !organization.trim()) {
      setError('Le nom de l\'organisation est obligatoire pour les organisateurs');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const registerData: RegisterData = {
        email: email.trim(),
        mot_de_passe: password,
        nom: lastName.trim(),
        prenom: firstName.trim(),
        role,
        organization: role === UserRole.ORGANIZER ? organization.trim() : undefined
      };

      console.log('=== DEBUG INSCRIPTION ===');
      console.log('Données d\'inscription envoyées:', { ...registerData, mot_de_passe: '***' });

      const res = await axios.post('http://localhost:3000/utilisateurs', registerData);
      
      console.log('Réponse inscription:', res.data);
      
      if (role === UserRole.ORGANIZER) {
        alert('✅ Inscription réussie ! Votre compte organisateur doit être approuvé par un administrateur avant de pouvoir créer des événements.');
      } else {
        alert('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.');
      }
      
      // Reset du formulaire et passage en mode connexion
      setTimeout(() => {
        setShowLogin(true);
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setConfirmPassword('');
        setOrganization('');
        setRole(UserRole.CITIZEN);
        setError('');
        setIsLoading(false);
      }, 1000);
      
    } catch (err: any) {
      console.error('=== ERREUR INSCRIPTION ===');
      console.error('Erreur complète:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Données invalides. Vérifiez tous les champs.');
      } else if (err.response?.status === 409) {
        setError('Cette adresse email est déjà utilisée.');
      } else {
        setError('Erreur lors de l\'inscription. Vérifiez que le serveur est démarré.');
      }
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setConfirmPassword('');
    setOrganization('');
    setRole(UserRole.CITIZEN);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div 
        className={`bg-white p-8 rounded-lg shadow-xl w-full max-w-md transition-all duration-500 ease-in-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Logo/Titre */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Synkro</h1>
          <p className="text-gray-600 text-sm">Plateforme d'événements locaux</p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {showLogin ? 'Connexion' : 'Inscription'}
        </h2>
        
        {/* Onglets Connexion/Inscription */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex w-full max-w-xs">
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 text-sm font-medium ${
                showLogin ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => {
                setShowLogin(true);
                resetForm();
              }}
            >
              Connexion
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 text-sm font-medium ${
                !showLogin ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => {
                setShowLogin(false);
                resetForm();
              }}
            >
              Inscription
            </button>
          </div>
        </div>

        {/* Debug info - à supprimer plus tard */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          <strong>Debug:</strong> Regardez la console (F12) pour les logs détaillés
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-md">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* FORMULAIRE DE CONNEXION */}
        {showLogin ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="votre@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        ) : (
          /* FORMULAIRE D'INSCRIPTION */
          <form onSubmit={handleRegister} className="space-y-4">
            {/* TYPE DE COMPTE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de compte
              </label>
              <div className="space-y-2">
                <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value={UserRole.CITIZEN}
                    checked={role === UserRole.CITIZEN}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mr-3 mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">🏠 Citoyen</div>
                    <div className="text-sm text-gray-500">
                      Participer aux événements de ma ville
                    </div>
                  </div>
                </label>
                
                <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value={UserRole.ORGANIZER}
                    checked={role === UserRole.ORGANIZER}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mr-3 mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">🏛️ Organisateur</div>
                    <div className="text-sm text-gray-500">
                      Mairie, association, service municipal
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* ORGANISATION (si organisateur) */}
            {role === UserRole.ORGANIZER && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de votre organisation *
                </label>
                <input
                  id="organization"
                  type="text"
                  placeholder="ex: Mairie de Paris, Association Sportive..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required={role === UserRole.ORGANIZER}
                />
                <p className="text-xs text-blue-600 mt-2 flex items-center">
                  <span className="mr-1">ℹ️</span>
                  Votre compte devra être approuvé par un administrateur
                </p>
              </div>
            )}
            
            {/* INFORMATIONS PERSONNELLES */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="votre@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="Jean"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Dupont"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                id="register-password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe *
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création du compte...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>
        )}
        
        {/* LIEN POUR CHANGER D'ONGLET */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {showLogin ? (
            <p>
              Pas encore inscrit ?{' '}
              <button 
                onClick={() => {
                  setShowLogin(false);
                  resetForm();
                }}
                className="text-blue-600 font-medium hover:underline focus:outline-none"
              >
                Créer un compte
              </button>
            </p>
          ) : (
            <p>
              Déjà inscrit ?{' '}
              <button 
                onClick={() => {
                  setShowLogin(true);
                  resetForm();
                }}
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