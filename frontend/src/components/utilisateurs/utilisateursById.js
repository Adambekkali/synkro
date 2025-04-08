'use client';
import React, { useEffect, useState } from 'react';
import { getUserById } from '@/api';

const UtilisateurById = ({ id }) => {
    const [utilisateur, setUtilisateur] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUtilisateur = async () => {
            try {
                const data = await getUserById(id);
                if (!data) {
                    throw new Error('Utilisateur non trouvé');
                }
                setUtilisateur(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (id) {
            fetchUtilisateur();
        }
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!utilisateur) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{utilisateur.name}</h1>
            <p>Email: {utilisateur.email}</p>
            <p>Role: {utilisateur.role}</p>
        </div>
    );
};

export default UtilisateurById;