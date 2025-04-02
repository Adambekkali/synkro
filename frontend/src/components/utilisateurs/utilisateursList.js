'use client';
import React, { useEffect, useState } from "react";
import { getUsers } from "../../api";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.nom} {user.prenom} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
