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
      throw new Error(`Erreur lors de la suppression de l'événement avec ID ${eventId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}











