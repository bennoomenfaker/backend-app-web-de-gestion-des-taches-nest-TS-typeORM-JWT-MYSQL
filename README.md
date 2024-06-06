Application de Gestion des Tâches de Travail
Ce dépôt contient le code source du backend d'une application web dédiée à l'organisation et à la gestion des tâches de travail. Cette application a été développée en utilisant Nest.js comme framework côté serveur, offrant ainsi une architecture robuste et modulaire pour répondre aux besoins évolutifs de gestion des tâches.

Description
Cette application permet aux administrateurs de créer des utilisateurs. Les utilisateurs reçoivent un e-mail d'inscription. Les utilisateurs peuvent créer des tâches normales avec des rappels. Lorsque le rappel est déclenché, un e-mail automatique est envoyé à l'utilisateur. Les utilisateurs peuvent collaborer sur une tâche normale avec un ou plusieurs collaborateurs. Les collaborateurs reçoivent un e-mail de collaboration et peuvent suivre l'avancement de la tâche (To Do, In Progress, Done) et mettre à jour l'état d'avancement. Pour les tâches répétitives, seul l'administrateur peut gérer ces tâches. Chaque tâche a une date de publication, et lorsque cette date est atteinte, un e-mail est envoyé à tous les utilisateurs.

Fonctionnalités
Authentification et Autorisation : Utilisation de JSON Web Tokens (JWT) pour assurer une authentification sécurisée et la gestion des autorisations, y compris la réinitialisation de mot de passe via Nodemailer.
Gestion des Utilisateurs : Opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) pour la gestion des utilisateurs.
Gestion des Tâches Normales : Création, modification et suppression de tâches, assignation à des utilisateurs.
Gestion des Tâches Récurrentes : CRUD pour la gestion des tâches répétitives.
Gestion des Rappels : Ajout, suppression et édition d'un rappel, avec envoi automatique d'e-mails lorsque la date de rappel est atteinte.
Gestion des Collaborateurs : Ajout, suppression et consultation des collaborateurs pour une tâche, avec envoi d'e-mails de collaboration.
Base de Données
Intégration de TypeORM pour une manipulation efficace des données avec MySQL.

API RESTful
Adoption des meilleures pratiques pour une architecture API claire et une gestion efficace des requêtes HTTP.

Modèle MVC
Utilisation du modèle MVC (Modèle-Vue-Contrôleur) pour une organisation logique et extensible du code.
