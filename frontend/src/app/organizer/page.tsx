"use client";
import { useEffect, useState } from "react";
import { useRole } from "@/hooks/useRole";
import { 
  createEvent, 
  getEventsByOrganizer, 
  getEventParticipants, 
  updateEvent, 
  deleteEventById,
  sendInvitation
} from "@/api";
import { Calendar, MapPin, Clock, Users, Plus, Eye, Edit, Trash2, UserCheck, Mail, X } from 'lucide-react';
import { Event } from "@/app/types";

interface Participant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  statut: string;
}

export default function OrganizerSpace() {
  const { user, isOrganizer, isAdmin, loading } = useRole();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  
  // Formulaire de création/modification d'événement
  const [eventForm, setEventForm] = useState({
    titre: '',
    description: '',
    lieu: '',
    date_debut: '',
    date_fin: '',
    max_participants: '',
    date_limite_inscription: '',
    est_prive: false,
    evenement_categorie: 'Social'
  });

  useEffect(() => {
    if (loading) return;
    
    if (!isOrganizer && !isAdmin) {
      window.location.href = '/';
      return;
    }

    fetchMyEvents();
  }, [user, loading, isOrganizer, isAdmin]);

  const fetchMyEvents = async () => {
    if (!user) return;
    
    try {
      const events = await getEventsByOrganizer(user.id);
      setMyEvents(events || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEventForm({
      titre: '',
      description: '',
      lieu: '',
      date_debut: '',
      date_fin: '',
      max_participants: '',
      date_limite_inscription: '',
      est_prive: false,
      evenement_categorie: 'Social'
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const eventData = {
        ...eventForm,
        max_participants: eventForm.max_participants ? parseInt(eventForm.max_participants) : null,
        proprietaire_id: user.id,
        date_debut: new Date(eventForm.date_debut).toISOString(),
        date_fin: new Date(eventForm.date_fin).toISOString(),
        date_limite_inscription: eventForm.date_limite_inscription 
          ? new Date(eventForm.date_limite_inscription).toISOString() 
          : null,
      };

      await createEvent(eventData);
      
      resetForm();
      setShowCreateModal(false);
      fetchMyEvents();
      alert('Événement créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de l\'événement');
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedEvent) return;

    try {
      const eventData = {
        ...eventForm,
        max_participants: eventForm.max_participants ? parseInt(eventForm.max_participants) : null,
        date_debut: new Date(eventForm.date_debut).toISOString(),
        date_fin: new Date(eventForm.date_fin).toISOString(),
        date_limite_inscription: eventForm.date_limite_inscription 
          ? new Date(eventForm.date_limite_inscription).toISOString() 
          : null,
      };

      await updateEvent(selectedEvent.id, eventData);
      
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
      fetchMyEvents();
      alert('Événement modifié avec succès !');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification de l\'événement');
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!user) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.titre}" ?`)) {
      try {
        await deleteEventById(event.id, user.id);
        fetchMyEvents();
        alert('Événement supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'événement');
      }
    }
  };

  const handleModifyEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      titre: event.titre,
      description: event.description || '',
      lieu: event.lieu || '',
      date_debut: new Date(event.date_debut).toISOString().slice(0, 16),
      date_fin: new Date(event.date_fin).toISOString().slice(0, 16),
      max_participants: event.max_participants?.toString() || '',
      date_limite_inscription: event.date_limite_inscription 
        ? new Date(event.date_limite_inscription).toISOString().slice(0, 16)
        : '',
      est_prive: event.est_prive || false,
      evenement_categorie: event.categorie || 'Social'
    });
    setShowEditModal(true);
  };

  const loadParticipants = async (event: Event) => {
    setSelectedEvent(event);
    try {
      const eventParticipants = await getEventParticipants(event.id);
      setParticipants(eventParticipants || []);
      setShowParticipantsModal(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error);
      setParticipants([]);
      setShowParticipantsModal(true);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !inviteEmail.trim()) return;

    try {
      await sendInvitation(selectedEvent.id, inviteEmail.trim());
      setInviteEmail('');
      setShowInviteModal(false);
      alert('Invitation envoyée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', error);
      alert('Erreur lors de l\'envoi de l\'invitation');
    }
  };

  const getEventStats = () => {
    const totalEvents = myEvents.length;
    const totalParticipants = myEvents.reduce((sum, event) => sum + (event.nb_participants || 0), 0);
    const upcomingEvents = myEvents.filter(event => new Date(event.date_debut) > new Date()).length;
    const fullEvents = myEvents.filter(event => 
      event.max_participants && (event.nb_participants || 0) >= event.max_participants
    ).length;

    return { totalEvents, totalParticipants, upcomingEvents, fullEvents };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isOrganizer && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès restreint</h2>
          <p className="text-gray-600">Cette page est réservée aux organisateurs.</p>
        </div>
      </div>
    );
  }

  const dashboardStats = getEventStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Espace Organisateur</h1>
              <p className="text-gray-600 mt-1">
                Bonjour {user?.email} • {user?.organization || 'Organisation non spécifiée'}
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Nouvel événement
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Mes événements ({myEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Statistiques
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total événements</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalEvents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total participants</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalParticipants}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">À venir</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.upcomingEvents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Événements complets</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.fullEvents}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Événements récents */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Événements récents</h3>
              </div>
              <div className="p-6">
                {myEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.titre}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar size={14} className="mr-1" />
                        {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                        <span className="mx-2">•</span>
                        <Users size={14} className="mr-1" />
                        {event.nb_participants || 0}/{event.max_participants || '∞'} participants
                      </div>
                    </div>
                    <button
                      onClick={() => loadParticipants(event)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Voir détails
                    </button>
                  </div>
                ))}
                {myEvents.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Aucun événement créé. Commencez par créer votre premier événement !
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mes événements */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {myEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun événement</h3>
                <p className="text-gray-500 mb-6">Créez votre premier événement pour commencer</p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Créer un événement
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {myEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{event.titre}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              new Date(event.date_debut) > new Date()
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {new Date(event.date_debut) > new Date() ? 'À venir' : 'Passé'}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{event.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center text-gray-500">
                              <Calendar size={16} className="mr-2 text-blue-500" />
                              {new Date(event.date_debut).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            
                            <div className="flex items-center text-gray-500">
                              <Clock size={16} className="mr-2 text-blue-500" />
                              {new Date(event.date_debut).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            
                            <div className="flex items-center text-gray-500">
                              <MapPin size={16} className="mr-2 text-blue-500" />
                              {event.lieu}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-6">
                          <button
                            onClick={() => loadParticipants(event)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Voir les participants"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleModifyEvent(event)}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              <Users size={14} className="inline mr-1" />
                              {event.nb_participants || 0}/{event.max_participants || '∞'} participants
                            </span>
                            <span className="text-sm text-gray-500">
                              Catégorie: {event.categorie}
                            </span>
                          </div>
                          <button
                            onClick={() => loadParticipants(event)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Gérer les participants →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Statistiques */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Statistiques par catégorie */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par catégorie</h3>
                <div className="space-y-3">
                  {Object.entries(
                    myEvents.reduce((acc, event) => {
                      const cat = event.categorie || 'Sans catégorie';
                      acc[cat] = (acc[cat] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${myEvents.length > 0 ? (count / myEvents.length) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                  {myEvents.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Aucune donnée disponible
                    </p>
                  )}
                </div>
              </div>

              {/* Participation au fil du temps */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Participation par mois</h3>
                <div className="space-y-3">
                  {Object.entries(
                    myEvents.reduce((acc, event) => {
                      const month = new Date(event.date_debut).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long' 
                      });
                      acc[month] = (acc[month] || 0) + (event.nb_participants || 0);
                      return acc;
                    }, {} as Record<string, number>)
                  ).slice(0, 6).map(([month, participants]) => {
                    const maxParticipants = Math.max(...Object.values(
                      myEvents.reduce((acc, event) => {
                        const m = new Date(event.date_debut).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long' 
                        });
                        acc[m] = (acc[m] || 0) + (event.nb_participants || 0);
                        return acc;
                      }, {} as Record<string, number>)
                    ));
                    
                    return (
                      <div key={month} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ 
                                width: `${maxParticipants > 0 ? (participants / maxParticipants) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{participants}</span>
                        </div>
                      </div>
                    );
                  })}
                  {myEvents.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Aucune donnée disponible
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de création d'événement */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Créer un nouvel événement</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateEvent} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'événement *
                  </label>
                  <input
                    type="text"
                    value={eventForm.titre}
                    onChange={(e) => setEventForm({ ...eventForm, titre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    value={eventForm.lieu}
                    onChange={(e) => setEventForm({ ...eventForm, lieu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={eventForm.evenement_categorie}
                    onChange={(e) => setEventForm({ ...eventForm, evenement_categorie: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Social">Social</option>
                    <option value="Sport">Sport</option>
                    <option value="Formation">Formation</option>
                    <option value="Conference">Conférence</option>
                    <option value="Virtuel">Virtuel</option>
                    <option value="Fete">Fête</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date et heure de début *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.date_debut}
                    onChange={(e) => setEventForm({ ...eventForm, date_debut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date et heure de fin *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.date_fin}
                    onChange={(e) => setEventForm({ ...eventForm, date_fin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre maximum de participants
                  </label>
                  <input
                    type="number"
                    value={eventForm.max_participants}
                    onChange={(e) => setEventForm({ ...eventForm, max_participants: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date limite d'inscription
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.date_limite_inscription}
                    onChange={(e) => setEventForm({ ...eventForm, date_limite_inscription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="private-event"
                      checked={eventForm.est_prive}
                      onChange={(e) => setEventForm({ ...eventForm, est_prive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="private-event" className="ml-2 block text-sm text-gray-700">
                      Événement privé (sur invitation uniquement)
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                  Créer l'événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification d'événement */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Modifier l'événement</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditEvent} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'événement *
                  </label>
                  <input
                    type="text"
                    value={eventForm.titre}
                    onChange={(e) => setEventForm({ ...eventForm, titre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    value={eventForm.lieu}
                    onChange={(e) => setEventForm({ ...eventForm, lieu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={eventForm.evenement_categorie}
                    onChange={(e) => setEventForm({ ...eventForm, evenement_categorie: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Social">Social</option>
                    <option value="Sport">Sport</option>
                    <option value="Formation">Formation</option>
                    <option value="Conference">Conférence</option>
                    <option value="Virtuel">Virtuel</option>
                    <option value="Fete">Fête</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date et heure de début *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.date_debut}
                    onChange={(e) => setEventForm({ ...eventForm, date_debut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date et heure de fin *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.date_fin}
                    onChange={(e) => setEventForm({ ...eventForm, date_fin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre maximum de participants
                  </label>
                  <input
                    type="number"
                    value={eventForm.max_participants}
                    onChange={(e) => setEventForm({ ...eventForm, max_participants: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date limite d'inscription
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.date_limite_inscription}
                    onChange={(e) => setEventForm({ ...eventForm, date_limite_inscription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="private-event-edit"
                      checked={eventForm.est_prive}
                      onChange={(e) => setEventForm({ ...eventForm, est_prive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="private-event-edit" className="ml-2 block text-sm text-gray-700">
                      Événement privé (sur invitation uniquement)
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                  Modifier l'événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal des participants */}
      {showParticipantsModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Participants</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedEvent.titre}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowInviteModal(true);
                      setShowParticipantsModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Inviter
                  </button>
                  <button
                    onClick={() => {
                      setShowParticipantsModal(false);
                      setSelectedEvent(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Total: {participants.length} participant{participants.length !== 1 ? 's' : ''}
                  </span>
                  {selectedEvent.max_participants && (
                    <span className="text-sm text-gray-500">
                      Limite: {selectedEvent.max_participants}
                    </span>
                  )}
                </div>
                {selectedEvent.max_participants && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((participants.length / selectedEvent.max_participants) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>

              {participants.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun participant</h3>
                  <p className="text-gray-500 mb-4">Cet événement n'a pas encore de participants inscrits.</p>
                  <button
                    onClick={() => {
                      setShowInviteModal(true);
                      setShowParticipantsModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                  >
                    Inviter des participants
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {participant.prenom.charAt(0)}{participant.nom.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {participant.prenom} {participant.nom}
                          </h4>
                          <p className="text-sm text-gray-500">{participant.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          participant.statut === 'Confirmé' 
                            ? 'bg-green-100 text-green-800'
                            : participant.statut === 'En attente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {participant.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'invitation */}
      {showInviteModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Inviter quelqu'un</h2>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSendInvitation} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="exemple@email.com"
                  required
                />
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Une invitation sera envoyée pour l'événement "{selectedEvent.titre}".
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                  Envoyer l'invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}