import { getEventById } from "@/api";
import Layout from "@/app/layout";

export default async function EventPage({ params }: { params: { id: string } }) {
    interface Event {
        titre: string;
        description: string;
        date: string;
    }

    const event: Event = await getEventById(params.id);

    return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <h2 className="text-2xl mb-4 text-center">Événement</h2>
                    {event ? (
                        <div>
                            <p>
                                <strong>Titre:</strong> {event.titre}
                            </p>
                            <p>
                                <strong>Description:</strong> {event.description}
                            </p>
                            <p>
                                <strong>Date:</strong> {event.date}
                            </p>
                        </div>
                    ) : (
                        <p>Chargement des données...</p>
                    )}
                </div>
            </div>
        
    );
}
