"use client";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Tag, Users, CheckCircle } from 'lucide-react';
import { Event } from "./types";
import { useRole } from "@/hooks/useRole";
import { 
  getAllPublicEvents, 
  inscribeToEvent, 
  checkUserSubscription, 
  unsubscribeFromEvent 
} from "@/api";

interface EventWithSubscription extends Event {
  isUserSubscribed?: boolean;
}

export default function HomePage() {
  const [events, setEvents] = useState<EventWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingSubscriptions, setLoadingSubscriptions] = useState<{[key: number]: boolean}>({});
  const { user, isCitizen, isOrganizer, isAdmin } = useRole();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const publicEvents = await getAllPublicEvents();
        setEvents(publicEvents);
        
        // Vérifier les inscriptions de l'utilisateur connecté
        if (user && isCitizen) {
          await checkUserSubscriptions(publicEvents);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, isCitizen]);

  const checkUserSubscriptions = async (eventsList: Event[]) => {
    if (!user) return;
    
    try {
      const eventsWithSubscription = await Promise.all(
        eventsList.map(async (event) => {
          try {
            const isSubscribed = await checkUserSubscription(event.id, user.id);
            return { ...event, isUserSubscribed: isSubscribed };
          } catch (error) {
            console.error(`Erreur vérification inscription événement ${event.id}:`, error);
            return { ...event, isUserSubscribed: false };
          }
        })
      );
      setEvents(eventsWithSubscription);
    } catch (error) {
      console.error("Erreur lors de la vérification des inscriptions:", error);
    }
  };

  // Filtrage des événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.lieu?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || event.categorie === selectedCategory;
    
    // Seulement les événements futurs et non annulés
    const isFuture = new Date(event.date_debut) > new Date();
    const isNotCanceled = !event.est_annule;
    
    return matchesSearch && matchesCategory && isFuture && isNotCanceled;
  });

  const handleInscription = async (event: EventWithSubscription) => {
    if (!user) {
      alert("Vous devez être connecté pour vous inscrire");
      window.location.href = "/auth";
      return;
    }

    if (!isCitizen) {
      alert("Seuls les citoyens peuvent s'inscrire aux événements");
      return;
    }

    // Vérifier si l'événement est complet
    if (event.max_participants && (event.nb_participants || 0) >= event.max_participants) {
      alert("Cet événement est complet");
      return;
    }

    // Vérifier la date limite d'inscription
    if (event.date_limite_inscription && new Date(event.date_limite_inscription) < new Date()) {
      alert("La date limite d'inscription est dépassée");
      return;
    }

    setLoadingSubscriptions(prev => ({ ...prev, [event.id]: true }));

    try {
      if (event.isUserSubscribed) {
        // Désinscription
        await unsubscribeFromEvent(event.id, user.id);
        
        // Mettre à jour l'état local
        setEvents(prevEvents => 
          prevEvents.map(e => 
            e.id === event.id 
              ? { 
                  ...e, 
                  isUserSubscribed: false,
                  nb_participants: Math.max(0, (e.nb_participants || 0) - 1)
                }
              : e
          )
        );
        
        alert("Désinscription réussie !");
      } else {
        // Inscription
        await inscribeToEvent(event.id, user.id);
        
        // Mettre à jour l'état local
        setEvents(prevEvents => 
          prevEvents.map(e => 
            e.id === event.id 
              ? { 
                  ...e, 
                  isUserSubscribed: true,
                  nb_participants: (e.nb_participants || 0) + 1
                }
              : e
          )
        );
        
        alert("Inscription réussie !");
      }
    } catch (error: any) {
      console.error("Erreur lors de l'inscription/désinscription:", error);
      alert(error.message || "Erreur lors de l'opération");
    } finally {
      setLoadingSubscriptions(prev => ({ ...prev, [event.id]: false }));
    }
  };

  const getSubscriptionButtonText = (event: EventWithSubscription) => {
    if (loadingSubscriptions[event.id]) {
      return "...";
    }
    
    if (event.isUserSubscribed) {
      return "Se désinscrire";
    }
    
    if (event.max_participants && (event.nb_participants || 0) >= event.max_participants) {
      return "Complet";
    }
    
    return "S'inscrire";
  };

  const getSubscriptionButtonStyle = (event: EventWithSubscription) => {
    if (loadingSubscriptions[event.id]) {
      return "bg-gray-400 text-white cursor-not-allowed";
    }
    
    if (event.isUserSubscribed) {
      return "bg-red-600 text-white hover:bg-red-700";
    }
    
    if (event.max_participants && (event.nb_participants || 0) >= event.max_participants) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }
    
    return "bg-blue-600 text-white hover:bg-blue-700";
  };

  const isSubscriptionDisabled = (event: EventWithSubscription): boolean => {
    return Boolean(
      loadingSubscriptions[event.id] || 
      (!event.isUserSubscribed && event.max_participants && (event.nb_participants || 0) >= event.max_participants)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Découvrez les événements de votre ville
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Participez aux activités organisées par votre mairie et les associations locales
          </p>
          
          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto flex gap-4">
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">Toutes catégories</option>
              <option value="Social">Social</option>
              <option value="Sport">Sport</option>
              <option value="Formation">Formation</option>
              <option value="Conference">Conférence</option>
              <option value="Virtuel">Virtuel</option>
              <option value="Fete">Fête</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions rapides selon le rôle */}
      {user && (
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {isCitizen && "Mes actions"}
                {isOrganizer && "Actions organisateur"}
                {isAdmin && "Actions administrateur"}
              </h2>
            </div>
            <div className="flex gap-3">
              {isCitizen && (
                <a
                  href="/my-inscriptions"
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Mes inscriptions
                </a>
              )}
              {(isOrganizer || isAdmin) && (
                <>
                  <a
                    href="/organizer"
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Créer un événement
                  </a>
                  <a
                    href="/organizer"
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    Mes événements
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Liste des événements */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Événements à venir ({filteredEvents.length})
          </h2>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-500">
              {searchTerm ? "Essayez de modifier votre recherche" : "Aucun événement prévu pour le moment"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Image d'en-tête colorée */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute top-4 right-4">
                    <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {event.categorie}
                    </span>
                  </div>
                  {isCitizen && event.isUserSubscribed && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle size={12} />
                        Inscrit
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Titre */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {event.titre}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Informations pratiques */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2 text-blue-500" />
                      <span>{new Date(event.date_debut).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-2 text-blue-500" />
                      <span>{new Date(event.date_debut).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    
                    {event.lieu && (
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2 text-blue-500" />
                        <span>{event.lieu}</span>
                      </div>
                    )}

                    {event.max_participants && (
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-2 text-blue-500" />
                        <span>
                          {event.nb_participants || 0}/{event.max_participants} participants
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = `/about-event/${event.id}`}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Voir détails
                    </button>
                    
                    {isCitizen && (
                      <button
                        onClick={() => handleInscription(event)}
                        disabled={isSubscriptionDisabled(event)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${getSubscriptionButtonStyle(event)}`}
                      >
                        {getSubscriptionButtonText(event)}
                      </button>
                    )}
                    
                    {!user && (
                      <button
                        onClick={() => window.location.href = "/auth"}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Se connecter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}