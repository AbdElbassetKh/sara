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
- [x] Auditer LanguageContext et translations.ts
- [x] Corriger les textes hardcodés dans toutes les pages
- [x] S'assurer que le changement de langue est réactif partout
- [x] Vérifier la direction RTL pour l'arabe dans toutes les pages
- [x] 0 erreur TypeScript

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
- [x] Composant PageHeader réutilisable (gradient + titre + back button)
- [x] Refonte Onboarding : illustration, sélecteur langue visuel, bouton CTA
- [x] Refonte Settings : sections avec icônes colorées, toggles stylisés
- [x] Refonte ChildProfileSetup : formulaire avec champs stylisés
- [x] Refonte Symptoms : header rose, sévérité slider coloré
- [x] Refonte Meals : header bleu, liste ingrédients avec badges
- [x] Refonte Insights : header violet, graphiques, recommandations IA
- [x] Refonte Appointments : header cyan, liste RDV avec statuts
- [x] Refonte EmergencyPage : header rouge vif, boutons d'urgence
- [x] Refonte Advice : header vert, articles avec images
- [x] 0 erreur TypeScript · tests passants

## Phase 27 : Améliorations UI/UX ciblées

- [x] Animation fade-in + effet flottant sur "مرحبا أمي / مرحبا أبي" dans ChildSelector
- [x] Typographie moderne avec dégradé rose+bleu sur le texte de bienvenue
- [x] Remplacer le sélecteur de date natif par un sélecteur custom (dropdowns mois/année) dans ChildProfileSetup
- [x] Remplacer le sélecteur de date natif dans Appointments
- [x] Remplacer le sélecteur de date natif dans Doctor.tsx et Growth.tsx
- [x] Remplacer la couleur rouge des boutons actifs/clics par bleu clair (#ADD8E6) et rose clair (#FFC0CB)
- [x] Persistance de langue dans localStorage + application globale dès la première utilisation
- [x] Supprimer "الشرطة" (Police 17) de la liste des contacts d'urgence dans EmergencyPage
- [x] Remplacer la mention adrénaline par "Donner uniquement le médicament prescrit par le médecin de l'enfant"
- [x] @keyframes float + fadeInUp ajoutés dans index.css
- [x] 0 erreur TypeScript · 21 tests passants

## Phase 28 : Données dynamiques Dashboard + Timeline + Détection allergènes

- [x] Procédure tRPC `dashboard.getStats` : jours sans symptôme, repas du mois, vaccins effectués, alertes non lues
- [x] Procédure tRPC `dashboard.getRecentAllergenAlert` : dernier repas (24h) avec symptôme sévérité >= 7
- [x] Procédure tRPC `dashboard.getRecentActivity` : 5 dernières entrées (repas + symptômes) triées par date
- [x] Procédure tRPC `timeline.getEntries` : food_entries + symptom_entries + doctor_visits triés par date
- [x] Procédure tRPC `timeline.deleteEntry` : suppression d'une entrée (food ou symptom ou doctor)
- [x] Mettre à jour Dashboard.tsx pour utiliser les vraies stats (remplacer les chiffres fixes)
- [x] Afficher la bannière d'allergène dynamique (vert si aucune alerte, rouge si alerte détectée)
- [x] Mettre à jour Timeline.tsx : chargement réel, filtres (Tout/Repas/Symptômes/Médecin), suppression avec confirmation
- [x] 0 erreur TypeScript · 21 tests passants

## Phase 29 : IA Insights — Corrélations + GPT-4o-mini

- [x] Procédure tRPC `insights.detectCorrelations` : règle simple (même aliment + même symptôme ≥ 3 fois dans 4h)
- [x] Procédure tRPC `insights.analyzeWithAI` : appel LLM intégré (GPT-4o-mini), retourne riskLevel / suspectFood+confidence / mainSymptoms / advice (AR/FR/EN)
- [x] Mettre à jour la page Insights.tsx avec affichage des résultats IA (couleurs #4FC3F7 / #F8BBD0 / #EF5350)
- [x] Ajouter bannière de corrélation dans Dashboard.tsx (si ≥ 1 corrélation détectée, cliquable vers /insights)
- [x] 0 erreur TypeScript · 21 tests passants
- [x] Guide d'installation rédigé et livré à l'utilisateur

## Phase 30 : Graphiques Insights — Évolution des symptômes

- [x] Procédure tRPC `insights.getSymptomTimeSeries` : données journalières sur N jours (count + sévérité moy. + repas)
- [x] Procédure tRPC `insights.getSymptomFrequency` : fréquence par type de symptôme (top 10)
- [x] Procédure tRPC `insights.getMealSymptomHeatmap` : matrice aliment × symptôme (top 6×6)
- [x] Graphique 1 : AreaChart évolution des symptômes + sévérité + repas (dégradés)
- [x] Graphique 2 : BarChart horizontal fréquence par type de symptôme
- [x] Graphique 3 : Heatmap aliment × symptôme (code couleur vert→rouge)
- [x] Sélecteur de période (7j / 14j / 30j) et onglets de graphiques
- [x] 0 erreur TypeScript · 21 tests passants

## Phase 31 : Upload photo + Catégories aliments + Chat IA + Symptômes améliorés

- [x] Migration DB : tables food_categories, food_items, symptom_types créées (6 catégories, 32 aliments, 20 symptômes)
- [x] Routeur tRPC `foodCatalog` : listCategories, listItems, listSymptomTypes
- [x] Formulaire Repas : catégories depuis DB, recherche, multi-sélection, upload photo (5 Mo max)
- [x] Formulaire Symptômes : grille icônes depuis DB, filtre par catégorie, multi-sélection, heure d'apparition, upload photo
- [x] `symptoms.create` : ajout du champ `occurredAt` optionnel
- [x] Chat IA dans Insights : procédure `insights.chat`, 3 questions suggérées, bulles de chat, réponse en AR/FR/EN, animation typing
- [x] 0 erreur TypeScript · 21 tests passants

## Phase 32 : Médecins + Rapport PDF + Photo symptômes

- [x] Migration DB : table `doctors` (name, specialty, phone, email, address, notes, userId, childId)
- [x] Routeur tRPC `doctors` : create, list, update, delete
- [x] Page Doctors.tsx : formulaire + liste + CRUD avec spécialités (pédiatre, allergologue, généraliste)
- [x] Route `/doctors` dans App.tsx + lien depuis Settings (menu card)
- [x] Composant ReportGenerator : génération PDF (jsPDF) avec infos enfant + symptômes + repas + médecins
- [x] Options de partage : téléchargement, email (mailto:), WhatsApp, Web Share API
- [x] Intégré dans ExportReport.tsx (section "Générer PDF directement")
- [x] 0 erreur TypeScript · 21 tests passants

## Phase 33 : Envoi email côté serveur avec rapport PDF

- [x] Installer Resend SDK + PDFKit (npm) pour envoi email côté serveur
- [x] Configurer le secret RESEND_API_KEY via webdev_request_secrets
- [x] Helper `server/_core/email.ts` : envoi via Resend avec PDF en pièce jointe (HTML trilingue FR/EN/AR)
- [x] Helper `server/_core/pdfReport.ts` : génération PDF professionnel avec PDFKit (tableaux, sections, footer)
- [x] Procédure tRPC `report.sendByEmail` : fetch child + symptoms + meals + doctors → PDF → Resend
- [x] Mettre à jour ReportGenerator.tsx : section email bleue, champ email, bouton "Envoyer par email", état loading/succès
- [x] Test Vitest `report.test.ts` : validation RESEND_API_KEY + génération PDF buffer (%PDF header)
- [x] 0 erreur TypeScript · 24 tests passants (7 fichiers)

## Phase 34 : Système d'abonnement Premium (CCP/BaridiMob)

- [x] Migration DB : tables `subscriptions` + `payment_history` créées en base
- [x] Routeur tRPC `subscriptions.getStatus` : isPremium + plan + premiumUntil + status
- [x] Routeur tRPC `subscriptions.create` : soumettre une demande (pending) avec référence transaction
- [x] Routeur tRPC `subscriptions.listHistory` : historique des paiements de l'utilisateur
- [x] Routeur tRPC `subscriptions.adminList` + `subscriptions.adminValidate` : validation/rejet admin
- [x] Page `Subscription.tsx` : choix formule (mensuel 500 DA / annuel 4000 DA), mode paiement CCP/BaridiMob, instructions avec copie, historique trilingue
- [x] Route `/subscription` dans App.tsx + lien depuis Settings (sous-titre avec tarifs)
- [x] Restriction Analyse IA + Chat IA aux abonnés Premium (toast + icône Crown)
- [x] 0 erreur TypeScript · 24 tests passants

## Phase 35 : Audit technique complet — Corrections pré-production

- [x] Routeur tRPC `growth` : create, list, delete (données réelles depuis growth_records + ownership check)
- [x] Routeur tRPC `doctorVisits` : create, list, delete (données réelles depuis doctor_visits + ownership check)
- [x] Growth.tsx : connecté à la DB (remplace GROWTH_DATA hardcodée, graphique Recharts LineChart, états loading/empty)
- [x] Doctor.tsx : connecté à la DB (remplace DOCTOR_VISITS hardcodée + suppression console.log, états loading/empty/delete)
- [x] Vérifier sécurité : toutes les procédures sensibles utilisent protectedProcedure
- [x] Vérifier ownership : growth + doctor-visits vérifient que l'enfant appartient à l'utilisateur connecté
- [x] Vérifier admin : adminList + adminValidate vérifient ctx.user.role === 'admin' avec TRPCError FORBIDDEN
- [x] Vérifier IA : invokeLLM côté serveur uniquement (analyzeWithAI + chat = protectedProcedure), clés non exposées côté client
- [x] Vérifier variables d'environnement : BUILT_IN_FORGE_API_KEY, JWT_SECRET, RESEND_API_KEY présents dans env.ts
- [x] 0 erreur TypeScript · 24 tests passants (7 fichiers)

## Phase 36 : Vérification et correction des 3 fonctionnalités clés
- [x] السجل الزمني (Timeline) : audit complet — données réelles DB, filtres (all/meal/symptom/doctor), suppression avec confirmation, états loading/empty/error, ownership check ✅
- [x] النشاط الأخير (Dashboard Recent Activity) : audit complet — données réelles DB via getRecentActivity, top 5 entrées triées par date, types meal/symptom avec icônes, état vide ✅
- [x] رؤى الذكاء الاصطناعي (Insights IA) : audit complet — 6 procédures (detectCorrelations, analyzeWithAI, getSymptomTimeSeries, getSymptomFrequency, getMealSymptomHeatmap, chat) toutes connectées à la DB réelle ✅
- [x] Correction sécurité : ajout de assertChildOwnership() dans toutes les procédures insights (6 procédures corrigées) ✅
- [x] Tests Vitest : nouveau fichier timeline-dashboard-insights.test.ts (11 tests) couvrant les 3 fonctionnalités ✅
- [x] 0 erreur TypeScript · 35 tests passants (8 fichiers) ✅
