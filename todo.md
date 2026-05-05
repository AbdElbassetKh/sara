# AlleNest – Child Safety AI - TODO

## Phase 1 : Configuration et Structure de Base
- [x] Configurer les dépendances et polices (Poppins, Tajawal)
- [x] Configurer Tailwind CSS avec palette de couleurs personnalisée
- [x] Configurer i18next pour multilingue (EN, FR, AR avec RTL)
- [x] Configurer Zustand pour gestion d'état global
- [x] Créer la structure des pages et navigation

## Phase 2 : Schéma Base de Données
- [x] Créer les tables Drizzle (profiles, children, food_entries, symptom_entries, doctor_visits, prescriptions, growth_records, vaccines, child_vaccines, documents)
- [x] Générer et appliquer les migrations SQL
- [x] Créer les helpers de requête dans server/db.ts

## Phase 3 : Authentification et Onboarding
- [x] Implémenter l'écran de bienvenue avec sélection de langue
- [x] Implémenter la page de connexion/inscription (Supabase Auth simulée)
- [x] Implémenter la création du profil enfant (nom, âge, allergies, photo)
- [x] Implémenter la redirection post-connexion

## Phase 4 : Tableau de Bord Principal
- [x] Créer la barre de navigation inférieure (5 icônes)
- [x] Implémenter le dashboard avec statistiques de santé
- [x] Afficher les alertes actives et la chronologie des activités
- [x] Créer les cartes d'actions rapides

## Phase 5 : Journal des Repas avec IA
- [x] Implémenter l'interface de suivi des repas (grille d'aliments, recherche)
- [x] Intégrer l'analyse LLM pour détection d'allergènes
- [x] Afficher les alertes d'allergènes potentiels
- [x] Permettre l'upload de photos des repas (via Storage Supabase - doc backend)
- [x] Sauvegarder les entrées de repas en base de données

## Phase 6 : Suivi des Symptômes
- [x] Implémenter l'interface de suivi des symptômes (grille, curseur de sévérité)
- [x] Créer le système de corrélation symptômes-repas
- [x] Afficher l'historique des symptômes
- [x] Permettre l'upload de photos et notes (via Storage Supabase - doc backend)

## Phase 7 : Chronologie et Filtres
- [x] Implémenter la page Timeline avec filtres (mois, type)
- [x] Afficher les entrées chronologiques avec badges colorés
- [x] Permettre la modification et suppression des entrées

## Phase 8 : Insights IA et Rapports
- [x] Implémenter l'appel LLM pour analyse des 30 derniers jours
- [x] Afficher le niveau de risque et aliments probables
- [x] Créer le graphique de consommation vs symptômes (dans la page Insights)
- [x] Implémenter l'export PDF des rapports (page ExportReport)
- [x] Ajouter les recommandations personnalisées

## Phase 9 : Suivi de Croissance
- [x] Implémenter l'enregistrement des mesures (poids, taille, périmètre crânien)
- [x] Créer les graphiques de courbes de percentiles (Recharts)
- [x] Afficher les statistiques de croissance

## Phase 10 : Carnet de Vaccination
- [x] Implémenter la liste des vaccins avec statuts
- [x] Créer le système de rappels (notifications locales)
- [x] Afficher le prochain vaccin à faire

## Phase 11 : Suivi Médecin et Documents
- [x] Implémenter la gestion des visites médicales
- [x] Créer l'upload et stockage des prescriptions/documents (via Storage Supabase - doc backend)
- [x] Afficher l'historique des visites et prescriptions

## Phase 12 : Page d'Urgence
- [x] Implémenter la page d'urgence (fond rouge, signes de danger)
- [x] Ajouter les boutons d'appel (14, 17, personnalisé)
- [x] Afficher les protocoles de premiers secours

## Phase 13 : Centre de Conseils
- [x] Créer la liste d'articles (au moins 6)
- [x] Implémenter les filtres par catégorie
- [x] Ajouter la barre de recherche
- [x] Créer les modales d'affichage des articles

## Phase 14 : Notifications et Rappels
- [x] Implémenter le système de notifications
- [x] Créer les rappels de vaccins
- [x] Créer les rappels de médicaments
- [x] Créer les alertes de symptômes inhabituels
- [x] Afficher le centre de notifications

## Phase 15 : Paramètres et Profil
- [x] Implémenter la modification du profil enfant
- [x] Créer le sélecteur de langue en temps réel
- [x] Ajouter les préférences de notifications
- [x] Implémenter l'export des données (page ExportReport)
- [x] Ajouter la suppression du compte (dans Settings)

## Phase 16 : Finalisation et Tests
- [x] Tester tous les flux utilisateur
- [x] Valider la responsivité mobile
- [x] Vérifier l'accessibilité
- [x] Créer les tests Vitest (15 tests passants)
- [x] Optimiser les performances

## Phase 17 : Fonctionnalités Premium et Nouvelles Pages
- [x] Implémenter le système Premium/Freemium (abonnement mensuel/annuel)
- [x] Créer la page Premium avec plans tarifaires (500 DZD/mois, 4000 DZD/an)
- [x] Implémenter le Daily Check-in avec historique 30 jours et streak
- [x] Créer la page d'évaluation (RateApp) avec étoiles et commentaires
- [x] Créer les pages légales (Politique de confidentialité, CGU, Partenaires)
- [x] Créer la page d'export de rapport HTML
- [x] Ajouter les nouvelles tables DB (subscriptions, daily_checkins, feedbacks, payment_history)
- [x] Ajouter les liens dans Settings et Dashboard vers les nouvelles pages
- [x] Créer les tests unitaires pour le routeur premium (5 tests)
- [x] Corriger les traductions FR/AR dans toutes les pages
- [x] Intégrer le logo AlleNest dans l'application

## Phase 18 : Signature Officielle et Thème Vivid
- [x] Ajouter la clé `appSignature` dans translations.ts (EN/FR/AR)
- [x] Intégrer la signature dans Onboarding.tsx (carte gradient sous le tagline)
- [x] Intégrer la signature dans Dashboard.tsx (header, texte blanc italique)
- [x] Intégrer la signature dans Settings.tsx (About card + footer gradient)
- [x] Intégrer la signature dans ChildProfileSetup.tsx (header + footer)
- [x] 0 erreur TypeScript après toutes les modifications
- [x] 15 tests unitaires passants

## Phase 19 : Disclaimer Médical
- [x] Ajouter la clé `medicalDisclaimer` dans translations.ts (EN/FR/AR)
- [x] Afficher le disclaimer dans Onboarding.tsx
- [x] Afficher le disclaimer dans Dashboard.tsx (bandeau discret)
- [x] Afficher le disclaimer dans Insights.tsx (avant les recommandations IA)
- [x] Afficher le disclaimer dans EmergencyPage.tsx
- [x] Afficher le disclaimer dans Advice.tsx

## Phase 20 : Photo de profil de l'enfant dans les Paramètres
- [x] Vérifier que la colonne `photoUrl` existe dans la table `children`
- [x] Ajouter la procédure tRPC `children.uploadPhoto` (upload S3 + mise à jour DB)
- [x] Procédure `children.list` existante utilisée directement
- [x] Créer le composant `ChildPhotoEditor` (avatar + bouton upload + preview)
- [x] Intégrer `ChildPhotoEditor` dans Settings.tsx (section "Profils enfants")
- [x] 0 erreur TypeScript après modifications
- [x] 15 tests passants

## Phase 21 : Mise à jour page Premium (Gratuit + 500 DA/mois + 4000 DA/an)
- [x] Lire et analyser la page Premium existante
- [x] Ajouter un plan "Gratuit" bien visible en haut (bandeau vert)
- [x] Mettre à jour le plan mensuel à 500 DA/mois
- [x] Mettre à jour le plan annuel à 4 000 DA/an
- [x] Mettre à jour les traductions FR/EN/AR pour les plans
- [x] 0 erreur TypeScript · 15 tests passants

## Phase 22 : Correction complète du système de langue
- [ ] Auditer LanguageContext et translations.ts
- [ ] Corriger les textes hardcodés dans toutes les pages
- [ ] S'assurer que le changement de langue est réactif partout
- [ ] Vérifier la direction RTL pour l'arabe dans toutes les pages
- [ ] 0 erreur TypeScript

## Phase 23 : Rendez-vous médicaux avec rappels
- [x] Ajouter table `appointments` dans drizzle/schema.ts
- [x] Générer et appliquer la migration SQL
- [x] Procédures tRPC (create, list, update, delete, getNext, getUpcoming)
- [x] Créer la page Appointments.tsx (liste + formulaire + rappels toggle)
- [x] Ajouter le widget "Prochain RDV" dans le Dashboard
- [x] Ajouter le bouton Rendez-vous dans les Quick Actions du Dashboard
- [x] Système de rappel : notification créée automatiquement 24h avant le RDV
- [x] 0 erreur TypeScript · 21 tests passants

## Phase 24 : Page sélection enfant (avant Dashboard)
- [x] Analyser AppContext et flux de navigation existant
- [x] Créer ChildSelector.tsx (liste des enfants avec avatars + bouton ajouter)
- [x] Intégrer dans App.tsx : afficher ChildSelector si aucun enfant sélectionné
- [x] Persister le choix de l'enfant dans AppContext (selectedChild)
- [x] Traductions FR/EN/AR complètes
- [x] 0 erreur TypeScript · 21 tests passants

## Phase 25 : Refonte design (style référence)
- [x] Polices Tajawal (AR) + Poppins (FR/EN) via Google Fonts dans index.html
- [x] Palette couleurs : #4FC3F7 (bleu ciel), #F8BBD0 (rose), #F9FAFB (fond), #EF5350 (urgence)
- [x] CSS variables globales + tokens Tailwind dans index.css
- [x] Refonte BottomNavigation : icônes colorées avec gradient actif, badge notifications
- [x] Refonte Dashboard : header gradient arrondi, cartes arrondies, quick actions avec gradients
- [x] Refonte ChildSelector : avatars emoji, cartes douces, boutons colorés
- [x] 0 erreur TypeScript · 21 tests passants

## Phase 26 : Professionnalisation automatique
- [ ] Composant PageHeader réutilisable (gradient + titre + back button)
- [ ] Refonte Onboarding : illustration, sélecteur langue visuel, bouton CTA
- [ ] Refonte Settings : sections avec icônes colorées, toggles stylisés
- [ ] Refonte ChildProfileSetup : formulaire avec champs stylisés
- [ ] Refonte Symptoms : header rose, sévérité slider coloré
- [ ] Refonte Meals : header bleu, liste ingrédients avec badges
- [ ] Refonte Insights : header violet, graphiques, recommandations IA
- [ ] Refonte Appointments : header cyan, liste RDV avec statuts
- [ ] Refonte EmergencyPage : header rouge vif, boutons d'urgence
- [ ] Refonte Advice : header vert, articles avec images
- [ ] 0 erreur TypeScript · tests passants
