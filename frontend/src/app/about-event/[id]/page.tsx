"use client";
import { useEffect, useState } from "react";
import { createInvitation, deleteEvent, getEventById } from "@/api";
import Layout from "@/app/layout";
import React from "react";
import { Invitation, Event } from "../../types"; // Assuming you have a type for Invitations
import { create } from "domain";

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  

    const unwrappedParams = React.use(params);
    const [event, setEvent] = useState<Event | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteStatus, setInviteStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            const evt = await getEventById(unwrappedParams.id);
            setEvent(evt);
            setLoading(false);
        };
        fetchEvent();
    }, [unwrappedParams.id]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const parsedToken = JSON.parse(
                        Buffer.from(token.split(".")[1], "base64").toString("utf-8")
                    );
                    setCurrentUserId(parsedToken?.id || null);
                } catch (e) {
                    setCurrentUserId(null);
                }
            } else {
                setCurrentUserId(null);
            }
        }
    }, []);

    const isOwner = event && currentUserId !== null && event.proprietaire_id === currentUserId;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <p>Chargement des données...</p>
                </div>
            </div>
        );
    }

    if (!event) return <div>Événement introuvable</div>;

    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen">
            <div className="w-full max-w-6xl flex justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full border border-gray-200 flex flex-col gap-8">
                <h2 className="text-4xl font-bold mb-4 text-center text-purple-700 tracking-tight">
                Détails de l'événement
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <span className="block text-sm font-medium text-gray-500">Titre</span>
                    <p className="text-lg font-semibold text-gray-800">{event.titre}</p>
                </div>
                <div>
                    <span className="block text-sm font-medium text-gray-500">Date</span>
                    <p className="text-gray-700">{event.date_debut}</p>
                </div>
                <div className="md:col-span-2">
                    <span className="block text-sm font-medium text-gray-500">Descriptions</span>
                    <p className="text-gray-700">{event.description}</p>
                </div>
                <div>
                    <span className="block text-sm font-medium text-gray-500">Nombre de personnes inscrites</span>
                    <p className="text-gray-700">{event.nb_participants ?? "Non renseigné"}</p>
                </div>
                <div>
                    <span className="block text-sm font-medium text-gray-500">Capacité maximale</span>
                    <p className="text-gray-700">{event.max_participants ?? "Non renseigné"}</p>
                </div>
                </div>
                {isOwner && (
                <div className="flex gap-4 pt-6 justify-center">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">
                    Modifier
                    </button>
                    <button
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-red-600 hover:to-pink-600 transition"
                        onClick={async () => {
                            if (confirm("Voulez-vous vraiment supprimer cet événement ?")) {
                                try {
                                    deleteEvent(event,currentUserId)
                                    window.location.href = "/";
                                } catch (e) {
                                    alert("Erreur lors de la suppression.");
                                }
                            }
                        }}
                    >
                        Supprimer
                    </button>
                    <button
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg font-semibold shadow cursor-pointer hover:from-green-600 hover:to-teal-600 transition"
                        onClick={() => setShowInviteModal(true)}
                    >
                        Inviter des personness
                    </button>
                    {showInviteModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowInviteModal(false)}
                                >
                                    ×
                                </button>
                                <h3 className="text-xl font-bold mb-4 text-center">Inviter par email</h3>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        // Remplacez ceci par votre logique d'envoi d'invitation
                                        setInviteStatus("Envoi...");
                                        try {
                                        // TODO: call your API to send invitation
                                        // Example: create an invitation object and send it to your backend
                                        const invitation = {
                                            evenement_id: event.id,
                                            email_invite: inviteEmail,
                                            code_invitation: Math.random().toString(36).substring(2, 15),
                                            date_envoi: new Date(),
                                            invitations_statut: "EN_ATTENTE",
                                        };
                                        createInvitation(invitation);
                                        setInviteStatus("Invitation envoyée !");
                                        setInviteEmail("");
                                            
                                        } catch {
                                            setInviteStatus("Erreur lors de l'envoi.");
                                        }
                                    }}
                                    className="flex flex-col gap-4"
                                >
                                    <input
                                        type="email"
                                        required
                                        placeholder="Adresse email"
                                        className="border rounded px-3 py-2"
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded font-semibold"
                                    >
                                        Envoyer l'invitation
                                    </button>
                                    {inviteStatus && (
                                        <div className="text-center text-sm text-gray-600">{inviteStatus}</div>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                )}
            </div>
            </div>
        </div>
    );
}
