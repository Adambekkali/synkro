"use client";
import { useEffect, useState } from "react";
import { useRole } from "@/hooks/useRole";
import { getInscriptionsByUser } from "@/api";
import { Calendar, MapPin, Clock, Users, Eye, X } from 'lucide-react';

interface Event {
  id: number;
  titre: string;
  description: string;
  lieu: string;
  date_debut: string;
  date_fin: string;
  max_participants: number;
  nb_participants: number;
  evenement_categorie: string;
  proprietaire_id: number;
  proprietaire?: {
    prenom: string;
    nom: string;
    email: string;
  };
}

interface Inscription {
  id: number;
  statut: string;
  date_inscription: string;
  evenement: Event;
}

export default function MyInscriptions() {
  const { user, loading } = useRole();
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    fetchMyInscriptions();
  }, [user, loading]);

  const fetchMyInscriptions = async () => {
    if (!user) return;
    
    try {
      const userInscriptions = await getInscriptionsByUser(user.id);
      console.log('Inscriptions reçues:', userInscriptions); // Debug
      
      // Vérifier et nettoyer les données
      const validInscriptions = (userInscriptions || []).filter((inscription: any) => 
        inscription && 
        inscription.evenement && 
        inscription.evenement.date_debut
      ) as Inscription[];
      
      setInscriptions(validInscriptions);
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
      setInscriptions([]); // Fallback sur tableau vide
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventUpcoming = (dateDebut: string) => {
    if (!dateDebut) return false;
    return new Date(dateDebut) > new Date();
  };

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  // Filtrer en sécurité les événements à venir
  const upcomingEvents = inscriptions.filter((inscription: Inscription) => 
    inscription && 
    inscription.evenement && 
    inscription.evenement.date_debut && 
    isEventUpcoming(inscription.evenement.date_debut)
  );

  // Filtrer en sécurité les événements passés
  const pastEvents = inscriptions.filter((inscription: Inscription) => 
    inscription && 
    inscription.evenement && 
    inscription.evenement.date_debut && 
    !isEventUpcoming(inscription.evenement.date_debut)
  );

  // Statistiques sécurisées
  const confirmedEvents = inscriptions.filter((i: Inscription) => i && i.statut === 'Confirmé');

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Inscriptions</h1>
              <p className="text-gray-600 mt-1">
                Gérez vos participations aux événements
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Connecté en tant que</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total inscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{inscriptions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Événements à venir</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inscriptions confirmées</p>
                <p className="text-2xl font-bold text-gray-900">{confirmedEvents.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des inscriptions */}
        {inscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune inscription</h3>
            <p className="text-gray-500 mb-6">Vous n'êtes inscrit à aucun événement pour le moment</p>
            <a
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              Découvrir les événements
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Vos événements</h2>
            
            {/* Événements à venir */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">À venir ({upcomingEvents.length})</h3>
              {upcomingEvents.map((inscription) => (
                <div key={inscription.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{inscription.evenement.titre}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inscription.statut)}`}>
                            {inscription.statut}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{inscription.evenement.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-500">
                            <Calendar size={16} className="mr-2 text-blue-500" />
                            {new Date(inscription.evenement.date_debut).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          
                          <div className="flex items-center text-gray-500">
                            <Clock size={16} className="mr-2 text-blue-500" />
                            {new Date(inscription.evenement.date_debut).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          
                          <div className="flex items-center text-gray-500">
                            <MapPin size={16} className="mr-2 text-blue-500" />
                            {inscription.evenement.lieu}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => openEventDetails(inscription.evenement)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors ml-4"
                        title="Voir les détails"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          Inscrit le {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-gray-500">
                          <Users size={14} className="inline mr-1" />
                          {inscription.evenement.nb_participants}/{inscription.evenement.max_participants || '∞'} participants
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucun événement à venir</p>
              )}
            </div>

            {/* Événements passés */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Événements passés ({pastEvents.length})</h3>
              {pastEvents.slice(0, 5).map((inscription) => (
                <div key={inscription.id} className="bg-white rounded-lg shadow-sm border overflow-hidden opacity-75">
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{inscription.evenement.titre}</h4>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Terminé
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-2" />
                          {new Date(inscription.evenement.date_debut).toLocaleDateString('fr-FR')}
                          <span className="mx-2">•</span>
                          <MapPin size={14} className="mr-1" />
                          {inscription.evenement.lieu}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => openEventDetails(inscription.evenement)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {pastEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucun événement passé</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal détails événement */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Détails de l'événement</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedEvent.titre}</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar size={20} className="mr-3 text-blue-500" />
                  <div>
                    <p className="font-medium">
                      {new Date(selectedEvent.date_debut).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedEvent.date_debut).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(selectedEvent.date_fin).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin size={20} className="mr-3 text-blue-500" />
                  <span>{selectedEvent.lieu}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users size={20} className="mr-3 text-blue-500" />
                  <span>{selectedEvent.nb_participants}/{selectedEvent.max_participants || '∞'} participants</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
              
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {selectedEvent.evenement_categorie}
                </span>
              </div>
              
              {selectedEvent.proprietaire && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Organisateur</h4>
                  <p className="text-gray-600">
                    {selectedEvent.proprietaire.prenom} {selectedEvent.proprietaire.nom}
                  </p>
                  <p className="text-sm text-gray-500">{selectedEvent.proprietaire.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}