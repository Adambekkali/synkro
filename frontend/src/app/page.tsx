"use client";
import { useEffect, useState } from "react";
import { createEvent, getEventsByOrganizer, getInscriptionsByUser, getInvitationsByUser } from "@/api"; // Remplace par ton import correct
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';
import { Event, Invitation, Inscription } from "./types"; 

export default function MyEvents() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [myInvitations, setMyInvitations] = useState<Invitation[]>([]);
  const [myInscriptions, setMyInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('organized');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    titre: '',
    date_debut: '',
    date_fin: '',
    date_creation: '',
    lieu: '',
    evenement_categorie: '',
    max_participants: 0,
    nb_participants: 0,
    proprietaire_id: 0,
    description: '',
    est_prive: false
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const parsedToken = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString("utf-8")
      );
      setCurrentUserId(parsedToken?.id || null);
    }
  }, []);

  // Fonction pour créer un événement
  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("Utilisateur non authentifié");
      return;
    }
    
    // Convertir les dates au format ISO-8601 si elles existent
    const eventToCreate = {
      ...newEvent,
      date_debut: newEvent.date_debut ? new Date(newEvent.date_debut).toISOString() : undefined,
      date_fin: (newEvent as any).date_fin ? new Date((newEvent as any).date_fin).toISOString() : undefined,
      date_limite_inscription: (newEvent as any).date_limite_inscription
        ? new Date((newEvent as any).date_limite_inscription).toISOString()
        : undefined,
      proprietaire_id: currentUserId,
    };

    try {
      await createEvent(eventToCreate);
      setShowCreateModal(false);
      // Recharger les événements après création
      const events = await getEventsByOrganizer(currentUserId);
      setMyEvents(events);
      // Réinitialiser le formulaire
      setNewEvent({
        id: 0,
        titre: '',
        date_debut: '',
        date_fin: '',
        date_creation: '',
        lieu: '',
        evenement_categorie: '',
        max_participants: 0,
        nb_participants: 0,
        proprietaire_id: 0,
        description: '',
        est_prive: false
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      alert("Erreur lors de la création de l'événement");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const parsedToken = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString("utf-8")
        );
        console.log("Parsed Token:", parsedToken);
        const userId = parsedToken?.id;
        const email = parsedToken?.username;

        if (userId) {
          try {
            const events = await getEventsByOrganizer(userId);
            const invitations = await getInvitationsByUser(email); 
            const inscriptions = await getInscriptionsByUser(userId); 
            console.log("invitations", invitations);
            console.log("inscriptions", inscriptions);
            console.log("events", events);
            setMyEvents(events);
            setMyInvitations(invitations); 
            setMyInscriptions(inscriptions);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }
      setLoading(false); 
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <h2>Loading ...</h2>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Mon Espace Événements
      </h1>
      
      {/* Navigation Tabs */}
      <div className="flex mb-6 border-b">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'organized' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('organized')}
        >
          Mes Événements Organisés
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'invitations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('invitations')}
        >
          Mes Invitations
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'registrations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('registrations')}
        >
          Mes Inscriptions
        </button>
      </div>
      
      {/* Organized Events */}
      {activeTab === 'organized' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Événements que j&apos;organise</h2>
          
          {myEvents?.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {myEvents.map((event, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{event.titre}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar size={16} className="mr-2 text-blue-500" />
                      <span>{new Date(event.date_debut).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock size={16} className="mr-2 text-blue-500" />
                      <span>{new Date(event.date_debut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin size={16} className="mr-2 text-blue-500" />
                      <span>{event.lieu}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag size={12} className="mr-1" />
                        {event.evenement_categorie || 'Social'}
                      </span>
                      
                      <button 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => window.location.href = `about-event/${event.id}`}
                      >
                        Détails →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
                <div className="text-gray-500 mb-4">Ou créer un événement</div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setShowCreateModal(true)}
                >
                  Créer un événement
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <div className="text-gray-500 mb-4">Vous n&apos;avez pas encore créé d&apos;événement</div>
              <button
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowCreateModal(true)}
              >
                Créer un événement
              </button>
            </div>
          )}

          {/* Modal de création d'événement */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-4">Créer un événement</h2>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={newEvent.titre}
                      onChange={e => setNewEvent({ ...newEvent, titre: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      value={(newEvent as any).description || ""}
                      onChange={e => setNewEvent({ ...newEvent, description: e.target.value } as any)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lieu</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={newEvent.lieu}
                      onChange={e => setNewEvent({ ...newEvent, lieu: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Date de début</label>
                      <input
                        type="datetime-local"
                        className="w-full border rounded px-3 py-2"
                        value={newEvent.date_debut}
                        onChange={e => setNewEvent({ ...newEvent, date_debut: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Date de fin</label>
                      <input
                        type="datetime-local"
                        className="w-full border rounded px-3 py-2"
                        value={(newEvent as any).date_fin || ""}
                        onChange={e => setNewEvent({ ...newEvent, date_fin: e.target.value } as any)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre max. de participants</label>
                    <input
                      type="number"
                      className="w-full border rounded px-3 py-2"
                      value={(newEvent as any).max_participants || ""}
                      onChange={e => setNewEvent({ ...newEvent, max_participants: e.target.value ? parseInt(e.target.value) : undefined } as any)}
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date limite d'inscription</label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded px-3 py-2"
                      value={(newEvent as any).date_limite_inscription || ""}
                      onChange={e => setNewEvent({ ...newEvent, date_limite_inscription: e.target.value } as any)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="est_prive"
                      checked={(newEvent as any).est_prive || false}
                      onChange={e => setNewEvent({ ...newEvent, est_prive: e.target.checked } as any)}
                    />
                    <label htmlFor="est_prive" className="text-sm font-medium">Événement privé</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Catégorie</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={newEvent.evenement_categorie || "Social"}
                      onChange={e => setNewEvent({ ...newEvent, evenement_categorie: e.target.value })}
                    >
                      <option value="Conférence">Conférence</option>
                      <option value="Formation">Formation</option>
                      <option value="Social">Social</option>
                      <option value="Sport">Sport</option>
                      <option value="Virtuel">Virtuel</option>
                      <option value="Fête">Fête</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-2 px-4 py-2 rounded bg-gray-200 text-gray-700"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Créer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Invitations */}
      {activeTab === 'invitations' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes Invitations</h2>
          {myInvitations?.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {myInvitations.map((invitation, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{invitation.evenements.titre}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar size={16} className="mr-2 text-blue-500" />
                      <span>{new Date(invitation.evenements.date_debut).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock size={16} className="mr-2 text-blue-500" />
                      <span>{new Date(invitation.evenements.date_debut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin size={16} className="mr-2 text-blue-500" />
                      <span>{invitation.evenements.lieu}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                        Accepter
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <div className="text-gray-500">Vous n&apos;avez reçu aucune invitation</div>
            </div>
          )}
        </div>
      )}
          
      {/* Registrations */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes Inscriptions</h2>
          {myInscriptions?.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {myInscriptions.map((inscription, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{inscription.evenements.titre}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar size={16} className="mr-2 text-blue-500" />
                      <span>{new Date(inscription.evenements.date_debut).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock size={16} className="mr-2 text-blue-500" />
                      <span>{new Date(inscription.evenements.date_debut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin size={16} className="mr-2 text-blue-500" />
                      <span>{inscription.evenements.lieu}</span>
                    </div>

                    <div className="flex items-center mb-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          inscription.statut === "Confirmée"
                          ? "bg-green-200 text-green-900 border border-green-800"
                          : inscription.statut === "en attente"
                          ? "bg-yellow-200 text-yellow-900 border border-yellow-800"
                          : "bg-red-200 text-red-900 border border-red-800"
                        }`}
                      >
                        {inscription.statut.toUpperCase()}
                      </span>
                    </div>
                    
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Voir les détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <div className="text-gray-500">Vous n&apos;êtes inscrit à aucun événement</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}