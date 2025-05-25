
"use client";
import { useEffect, useState } from "react";
import { getEventsByOrganizer, getInscriptionsByUser, getInvitationsByUser } from "@/api"; // Remplace par ton import correct
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';

interface Event {
  id: string;
  titre: string;
  date_debut: string;
  lieu: string;
  categorie?: string;
}

interface Invitation {
  evenements: Event;
}

interface Inscription {
  evenements: Event;
  statut: string;
}

export default function MyEvents() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [myInvitations, setMyInvitations] = useState<Invitation[]>([]);
  const [myInscriptions, setMyInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // État de chargement
  const [activeTab, setActiveTab] = useState('organized');
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
        //const currentUser = getUserById(userId); 

        if (userId) {
          
          const events = await getEventsByOrganizer(userId);
          const invitations = await getInvitationsByUser(email); 
          const inscriptions = await getInscriptionsByUser(userId); 
          console.log("invitations", invitations);
          setMyEvents(events);
          setMyInvitations(invitations); 
          setMyInscriptions(inscriptions);
        }
      }
      setLoading(false); 
    };

    fetchUserData().catch((err) => {
      console.error("Error fetching user data:", err);
      setLoading(false); 
    });
  }, []);

  // Vérifie si les données sont en cours de chargement
  if (loading) {
    return <div>Loading...</div>;
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
                        {event.categorie || 'Social'}
                      </span>
                      
                        <button 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => window.location.href = `/about-event/${event.id}`}
                        >
                        Détails →
                        </button>
                    </div>
                  </div>
                </div>
              ))}
               <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <div className="text-gray-500 mb-4">Ou créer un événement</div>
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Créer un événement
              </button>
            </div>
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <div className="text-gray-500 mb-4">Vous n&apos;avez pas encore créé d&apos;événement</div>
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Créer un événement
              </button>
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

