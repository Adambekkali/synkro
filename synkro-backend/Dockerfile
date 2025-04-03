# Utiliser l'image Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port de l'API
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "start"]
