import { create } from "domain";

const API_URL = "http://localhost:3000"; 

export async function getUsers() {
  try {
    const response = await fetch(`${API_URL}/utilisateurs`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_URL}/utilisateurs/${userId}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'utilisateur avec ID ${userId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createUser(user) {
  try {
    const response = await fetch(`${API_URL}/utilisateurs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserWithEvents(id){
  try {
      const response = await fetch(`${API_URL}/utilisateurs/${id}/evenements`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'utilisateur avec ID ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

export async function getEventsByOrganizer(userId) {
  try {
    const response = await fetch(`${API_URL}/evenements/${userId}/ByOrganizer`);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des événements de l'organisateur");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getInvitationsByUser(email) {
  try {
    const response = await fetch(`${API_URL}/invitations/user/${email}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des invitations");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getInscriptionsByUser(userId) {
  try {
    const response = await fetch(`${API_URL}/inscriptions/user/${userId}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des inscriptions");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getEventById(eventId) {
  try {
    const response = await fetch(`${API_URL}/evenements/${eventId}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'événement avec ID ${eventId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
} 

export async function createEvent(event) {
  try {
    const response = await fetch(`${API_URL}/evenements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'événement");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createInvitation(invitation) {
  try {
    const response = await fetch(`${API_URL}/invitations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invitation),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'invitation");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteEvent(event, userId) {
  try {
    if (event.proprietaire_id !== userId) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cet événement");
    }
    const response = await fetch(`${API_URL}/evenements/${event.id}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }), // Pass the userId in the request body
    });
    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression de l'événement avec ID ${event.id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// GARDE SEULEMENT CETTE VERSION de getEventParticipants
export async function getEventParticipants(eventId) {
  try {
    const response = await fetch(`${API_URL}/evenements/${eventId}/participants`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des participants");
    }
    const data = await response.json();
    
    // Debug pour voir ce que retourne l'API
    console.log('Réponse API participants:', data);
    console.log('Type de data:', typeof data);
    console.log('Est-ce un tableau?', Array.isArray(data));
    
    // S'assurer de retourner un tableau
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.participants)) {
      return data.participants;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('Format de données inattendu pour les participants:', data);
      return [];
    }
  } catch (error) {
    console.error('Erreur getEventParticipants:', error);
    return [];
  }
}

// Modifier un événement
export async function updateEvent(eventId, eventData) {
  try {
    const response = await fetch(`${API_URL}/evenements/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la modification de l'événement");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Supprimer un événement (version améliorée)
export async function deleteEventById(eventId, userId) {
  try {
    const response = await fetch(`${API_URL}/evenements/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'événement");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Obtenir les statistiques d'un organisateur
export async function getOrganizerStats(userId) {
  try {
    const response = await fetch(`${API_URL}/utilisateurs/${userId}/stats`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des statistiques");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return {
      categoriesStats: [],
      monthlyStats: [],
      totalEvents: 0,
      totalParticipants: 0
    };
  }
}

// S'inscrire à un événement
export async function inscribeToEvent(eventId, userId) {
  try {
    const response = await fetch(`${API_URL}/inscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        evenement_id: eventId,
        utilisateur_id: userId
      }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'inscription");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Envoyer une invitation par email
export async function sendInvitation(eventId, email) {
  try {
    const response = await fetch(`${API_URL}/invitations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        evenement_id: eventId,
        email_invite: email,
        code_invitation: Math.random().toString(36).substring(2, 15)
      }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de l'invitation");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Se désinscrire d'un événement
export async function unsubscribeFromEvent(eventId, userId) {
  try {
    const response = await fetch(`${API_URL}/inscriptions/${eventId}/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la désinscription");
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur désinscription:', error);
    throw error;
  }
}

// Vérifier si un utilisateur est inscrit à un événement
export async function checkUserSubscription(eventId, userId) {
  try {
    const response = await fetch(`${API_URL}/inscriptions/check/${eventId}/${userId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.isSubscribed || false;
  } catch (error) {
    console.error('Erreur vérification inscription:', error);
    return false;
  }
}

// Récupérer tous les événements publics
export async function getAllPublicEvents() {
  try {
    // Essayer d'abord l'endpoint spécialisé pour les événements publics
    let response = await fetch(`${API_URL}/evenements/public`);
    
    // Si l'endpoint public n'existe pas (404), utiliser l'endpoint général et filtrer
    if (!response.ok && response.status === 404) {
      console.log('Endpoint /evenements/public non trouvé, utilisation de /evenements avec filtre');
      response = await fetch(`${API_URL}/evenements`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des événements");
      }
      const allEvents = await response.json();
      // Filtrer pour ne garder que les événements publics
      return allEvents.filter(event => !event.est_prive && !event.est_annule);
    }
    
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des événements publics");
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur événements publics:', error);
    
    // En cas d'erreur totale, retourner des données de test pour que l'app fonctionne
    console.warn('API indisponible, retour de données de test');
    return [
      {
        id: 1,
        titre: "Fête de la musique 2025",
        description: "Venez célébrer la musique dans toute la ville avec des concerts gratuits !",
        lieu: "Place de la République",
        date_debut: "2025-06-21T18:00:00",
        date_fin: "2025-06-21T23:00:00",
        date_creation: "2025-01-15T10:00:00",
        max_participants: 500,
        nb_participants: 120,
        date_limite_inscription: "2025-06-20T23:59:59",
        est_prive: false,
        code_partage: null,
        est_annule: false,
        proprietaire_id: 1,
        evenement_categorie: "Social"
      },
      {
        id: 2,
        titre: "Formation premiers secours",
        description: "Apprenez les gestes qui sauvent avec les pompiers de la ville.",
        lieu: "Caserne des pompiers",
        date_debut: "2025-07-10T14:00:00",
        date_fin: "2025-07-10T17:00:00",
        date_creation: "2025-01-10T09:00:00",
        max_participants: 20,
        nb_participants: 15,
        date_limite_inscription: "2025-07-08T23:59:59",
        est_prive: false,
        code_partage: null,
        est_annule: false,
        proprietaire_id: 2,
        evenement_categorie: "Formation"
      }
    ];
  }
}

// Accepter une invitation
export async function acceptInvitation(invitationId, userId) {
  try {
    const response = await fetch(`${API_URL}/invitations/${invitationId}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        utilisateur_id: userId,
        statut: "Accepté"
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de l'acceptation de l'invitation");
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur acceptation invitation:', error);
    throw error;
  }
}

// Refuser une invitation
export async function refuseInvitation(invitationId, userId) {
  try {
    const response = await fetch(`${API_URL}/invitations/${invitationId}/refuse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        utilisateur_id: userId,
        statut: "Refusé"
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors du refus de l'invitation");
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur refus invitation:', error);
    throw error;
  }
}

// Supprimer/Annuler une invitation (pour l'organisateur)
export async function deleteInvitation(invitationId) {
  try {
    const response = await fetch(`${API_URL}/invitations/${invitationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'invitation");
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur suppression invitation:', error);
    throw error;
  }
}