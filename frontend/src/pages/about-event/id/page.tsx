import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "@/api";
import Layout from "@/app/layout";

export default function EventPage() {
    interface Event {
        titre: string;
        description: string;
        date: string;
    }

    const [event, setEvent] = React.useState<Event | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchEventData = async () => {
            if (id) {
                const event = await getEventById(id);
                setEvent(event);
            }
        };
        fetchEventData().catch((err: unknown) => {
            console.error("Error fetching event data:", err);
        });
    }, [id]);

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
