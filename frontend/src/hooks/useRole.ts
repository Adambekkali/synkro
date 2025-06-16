// /src/hooks/useRole.ts

"use client";
import { useState, useEffect } from 'react';
import { UserRole, User, JwtPayload } from '@/app/types';

export function useRole() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('=== DEBUG HOOK useRole ===');
        const token = localStorage.getItem('token');
        console.log('Token présent:', !!token);
        console.log('Token brut:', token ? token.substring(0, 50) + '...' : null);
        
        if (!token) {
          console.log('❌ Pas de token trouvé - utilisateur non connecté');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Décoder le token JWT
        console.log('📝 Tentative de décodage du token...');
        const tokenParts = token.split('.');
        console.log('Parties du token:', tokenParts.length);
        
        if (tokenParts.length !== 3) {
          console.error('❌ Token JWT malformé (pas 3 parties)');
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const payload: JwtPayload = JSON.parse(
          Buffer.from(tokenParts[1], 'base64').toString('utf-8')
        );
        
        console.log('=== PAYLOAD DÉCODÉ ===');
        console.log('Payload complet:', payload);
        console.log('ID:', payload.id);
        console.log('Username:', payload.username);
        console.log('Rôle:', payload.role);
        console.log('Organisation:', payload.organization);
        console.log('Expiration:', new Date(payload.exp * 1000));
        console.log('Token expiré?', payload.exp * 1000 < Date.now());

        // Vérifier si le token n'est pas expiré
        if (payload.exp * 1000 < Date.now()) {
          console.log('❌ Token expiré, suppression');
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Vérifier que le rôle est valide
        if (!payload.role || !Object.values(UserRole).includes(payload.role)) {
          console.error('❌ Rôle invalide ou manquant:', payload.role);
          console.log('Rôles valides:', Object.values(UserRole));
          // Ne pas supprimer le token, juste assigner un rôle par défaut
          payload.role = UserRole.CITIZEN;
          console.log('🔄 Rôle assigné par défaut:', UserRole.CITIZEN);
        }

        // Créer l'objet utilisateur à partir du payload
        const userData: User = {
          id: payload.id,
          email: payload.username,
          role: payload.role,
          organization: payload.organization || null,
          // Ces champs devront être récupérés via API si nécessaire
          nom: null,
          prenom: null,
          is_approved: true, // Assumé si le token existe
          date_creation: null
        };

        console.log('=== UTILISATEUR CRÉÉ ===');
        console.log('Données utilisateur:', userData);
        console.log('Rôle final:', userData.role);

        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ Utilisateur authentifié avec succès');
        
        // Vérifier les flags de rôle
        const isCitizen = userData.role === UserRole.CITIZEN;
        const isOrganizer = userData.role === UserRole.ORGANIZER;
        const isAdmin = userData.role === UserRole.ADMIN;
        
        console.log('=== FLAGS DE RÔLE ===');
        console.log('isCitizen:', isCitizen);
        console.log('isOrganizer:', isOrganizer);
        console.log('isAdmin:', isAdmin);

      } catch (error) {
        console.error('❌ Erreur dans checkAuth:', error);
        console.error('Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        console.log('🏁 Fin checkAuth - loading = false');
        setLoading(false);
      }
    };

    console.log('🚀 Démarrage useRole hook');
    checkAuth();
    
    // Écouter les changements de localStorage (si connexion/déconnexion dans un autre onglet)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        console.log('🔄 Token changé dans localStorage, re-vérification');
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fonctions utilitaires
  const isCitizen = user?.role === UserRole.CITIZEN;
  const isOrganizer = user?.role === UserRole.ORGANIZER;
  const isAdmin = user?.role === UserRole.ADMIN;
  const canCreateEvents = isOrganizer || isAdmin;
  const canManageAllEvents = isAdmin;

  console.log('=== HOOK RENDER ===');
  console.log('Loading:', loading);
  console.log('Authenticated:', isAuthenticated);
  console.log('User:', user ? `${user.email} (${user.role})` : null);

  // Fonction de déconnexion
  const logout = () => {
    console.log('🚪 Déconnexion utilisateur');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return {
    user,
    loading,
    isAuthenticated,
    isCitizen,
    isOrganizer,
    isAdmin,
    canCreateEvents,
    canManageAllEvents,
    logout
  };
}

// Hook spécialisé pour protéger les routes
export function useRequireRole(requiredRole: UserRole | UserRole[]) {
  const { user, loading, isAuthenticated } = useRole();

  useEffect(() => {
    console.log('=== useRequireRole ===');
    console.log('Required role(s):', requiredRole);
    console.log('Current user:', user);
    console.log('Loading:', loading);
    console.log('Authenticated:', isAuthenticated);

    if (loading) {
      console.log('⏳ En cours de chargement, attente...');
      return;
    }

    if (!isAuthenticated) {
      console.log('❌ Non authentifié, redirection vers login');
      window.location.href = '/login';
      return;
    }

    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    console.log('Rôles autorisés:', allowedRoles);
    
    if (user && !allowedRoles.includes(user.role)) {
      console.log('❌ Rôle non autorisé, redirection selon le rôle');
      // Rediriger selon le rôle
      if (user.role === UserRole.CITIZEN) {
        console.log('Redirection vers / (citoyen)');
        window.location.href = '/';
      } else if (user.role === UserRole.ORGANIZER) {
        console.log('Redirection vers /organizer');
        window.location.href = '/organizer';
      } else {
        console.log('Redirection vers /admin');
        window.location.href = '/admin';
      }
    } else {
      console.log('✅ Rôle autorisé, accès accordé');
    }
  }, [user, loading, isAuthenticated, requiredRole]);

  return { user, loading, isAuthenticated };
}