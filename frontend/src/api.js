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









