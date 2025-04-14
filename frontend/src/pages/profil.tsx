import React from "react";
import { useEffect } from "react";
import { getUserById } from "@/api";
import Layout from "@/app/layout"; 

export default function Profil() {
  interface User {
    nom: string;
    email: string;
    prenom: string;
  }

  const [user, setUser] = React.useState<User | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  // Récupère l'id de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (token) {
        const parsedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf-8"));
        console.log("Parsed Token:", parsedToken);
        const userId = parsedToken?.id;
        console.log("User ID:", userId);
        const user = await getUserById(userId);
      setUser(user);
    }
  };
    fetchUserData().catch((err) => {
      console.error("Error fetching user data:", err);
      setError(err);
    });
  }, []);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl mb-4 text-center">Profil</h2>
          {user ? (
            <div>
              <p>
                <strong>Nom:</strong> {user.nom}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Prénom:</strong> {user.prenom}
              </p>

            </div>
          ) : (
            <p>Chargement des données...</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

function fetchUserData() {
  throw new Error("Function not implemented.");
}


function setError(err: any) {
  throw new Error("Function not implemented.");
}
