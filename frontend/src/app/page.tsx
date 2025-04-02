import Image from "next/image";
import React from "react";
import UserList from "../components/utilisateurs/utilisateursList";




export default function Home() {
  return (
    <div>
    <h1>Bienvenue</h1>
    <UserList />
  </div>
  );

  
}

