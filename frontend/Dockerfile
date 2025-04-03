# Utiliser l'image Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier les fichiers du projet
COPY . .

# Construire l'application (pour React, Angular, Vue)
RUN npm run build

# Exposer le port du serveur web
EXPOSE 3000

# Lancer le serveur (ou utiliser un serveur comme nginx pour React/Vue en production)
CMD ["npm", "run", "start"]
