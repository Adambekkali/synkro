import React from "react";
import UserList from "../components/utilisateurs/utilisateursList";
import UserById from "../components/utilisateurs/utilisateursById";




export default function Home() {
  return (
    <div>
    <h1>Bienvenue</h1>
    <UserList />

    <h2>By id</h2>
    <UserById id={1} />
  </div>
  );

  
}

