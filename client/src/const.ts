export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// AlleNest Constants
export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};

export const ALLERGEN_LIST = [
  'milk',
  'egg',
  'peanuts',
  'wheat',
  'fish',
  'soy',
  'berries',
  'shellfish',
  'tree_nuts',
  'sesame',
] as const;

export const SYMPTOM_TYPES = [
  'rash',
  'vomiting',
  'diarrhea',
  'itching',
  'breathing_difficulty',
  'swelling',
  'crying',
  'runny_nose',
  'lethargy',
  'fever',
  'cough',
  'constipation',
] as const;

export const FEEDING_TYPES = ['breast', 'formula', 'mixed', 'solids'] as const;

export const GENDER_OPTIONS = ['boy', 'girl'] as const;

export const DOCUMENT_TYPES = [
  'prescription',
  'lab_result',
  'health_card',
  'vaccination_card',
  'other',
] as const;

export const EMERGENCY_NUMBERS = {
  ambulance: '14',
  fire: '15',
} as const;

export const DANGER_SIGNS = [
  'difficulty_breathing',
  'severe_swelling',
  'loss_of_consciousness',
  'severe_vomiting',
  'blue_lips',
  'severe_rash',
  'seizures',
  'severe_chest_pain',
] as const;

export const FIRST_AID_STEPS = [
  {
    title: 'Stay Calm',
    description: 'Keep yourself and your child calm. This helps you think clearly and respond effectively.',
  },
  {
    title: 'Call Emergency',
    description: 'Immediately call 14 (SAMU) or your local emergency number.',
  },
  {
    title: 'Position Safely',
    description: 'Place your child in a comfortable position. If unconscious, place them on their side.',
  },
  {
    title: 'Administer Treatment',
    description: 'Give only the medication prescribed by your child\'s doctor. Do not administer any other medication without medical advice.',
  },
] as const;

export const ARTICLES = [
  {
    id: 1,
    title: 'Understanding Food Allergies in Infants',
    category: 'allergie',
    content:
      'Food allergies are common in infants. Learn how to identify symptoms and manage them safely.',
    excerpt: 'A comprehensive guide to infant food allergies...',
  },
  {
    id: 2,
    title: 'Nutrition Guide for Growing Children',
    category: 'nutrition',
    content: 'Proper nutrition is essential for healthy child development. Discover the key nutrients...',
    excerpt: 'Essential nutrients for child development...',
  },
  {
    id: 3,
    title: 'Growth Milestones: What to Expect',
    category: 'croissance',
    content: 'Track your child growth with our comprehensive milestone guide.',
    excerpt: 'Understanding growth patterns in children...',
  },
  {
    id: 4,
    title: 'Managing Allergic Reactions at Home',
    category: 'allergie',
    content: 'Quick steps to manage allergic reactions safely at home.',
    excerpt: 'Home management of allergic reactions...',
  },
  {
    id: 5,
    title: 'Introducing Solid Foods Safely',
    category: 'nutrition',
    content: 'Learn the best practices for introducing solid foods to your infant.',
    excerpt: 'Safe introduction of solid foods...',
  },
  {
    id: 6,
    title: 'Vaccination Schedule and Benefits',
    category: 'croissance',
    content: 'Understand the importance of vaccinations in your child health journey.',
    excerpt: 'Complete vaccination guide...',
  },
] as const;
