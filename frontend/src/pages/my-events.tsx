import { useEffect, useState } from "react";
import { getEventsByOrganizer } from "@/api"; // Remplace par ton import correct
import Layout from "@/app/layout"; 

export default function MyEvents() {
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [myInvitations, setMyInvitations] = useState<any[]>([]);
  const [myInscriptions, setMyInscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // État de chargement

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const parsedToken = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString("utf-8")
        );
        const userId = parsedToken?.id;
        if (userId) {
          // Assurer que toutes les données sont récupérées avant de les stocker
          const events = await getEventsByOrganizer(userId);
          setMyEvents(events);
          setMyInvitations(events); // Tu peux ajuster en fonction de la source de tes invitations
          setMyInscriptions(events); // Pareil pour les inscriptions
        }
      }
      setLoading(false); // Arrêter le chargement une fois les données récupérées
    };

    fetchUserData().catch((err) => {
      console.error("Error fetching user data:", err);
      setLoading(false); // Arrêter le chargement même en cas d'erreur
    });
  }, []);

  // Si les données sont en cours de chargement, afficher un message de chargement
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
    <div>
      <h1>My Events</h1>
    <div>
      <h2>Mes Événements Organisés</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '20px' }}>
        <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '8px' }}>Titre</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Lieu</th>
        </tr>
        </thead>
        <tbody>
        {myEvents?.length > 0 ? (
          myEvents.map((event, index) => (
            <tr key={index}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{event.titre}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(event.date_debut).toLocaleDateString()}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{event.lieu}</td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={3} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>No events found.</td></tr>
        )}
        </tbody>
      </table>

      <h2>Mes Invitations</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '20px' }}>
        <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '8px' }}>Titre</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Lieu</th>
        </tr>
        </thead>
        <tbody>
        {/* Liste des invitations */}
        </tbody>
      </table>

      <h2>Mes Inscriptions</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '20px' }}>
        <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '8px' }}>Titre</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Lieu</th>
        </tr>
        </thead>
        
        <tbody>
        {/* Liste des inscriptions */}
        </tbody>
        </table>
    </div>
    </div>

    </Layout>
  );
}
