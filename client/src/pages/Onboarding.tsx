import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, getLoginUrl } from '@/const';
import { Shield, Sparkles, Heart, Activity, Stethoscope, Apple } from 'lucide-react';

const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';

export default function Onboarding() {
  const { setLanguage, language } = useLanguage();
  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const handleLanguageSelect = (lang: typeof SUPPORTED_LANGUAGES[number]) => {
    setLanguage(lang);
    window.location.href = getLoginUrl();
  };

  const FEATURES = [
    {
      icon: Activity,
      label: isAr ? 'تسجيل الأعراض' : isFr ? 'Suivi des symptômes' : 'Track Symptoms',
      gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
      shadow: 'rgba(79,195,247,0.4)',
    },
    {
      icon: Sparkles,
      label: isAr ? 'رؤى الذكاء الاصطناعي' : isFr ? 'AI Insights' : 'AI Insights',
      gradient: 'linear-gradient(135deg, #CE93D8, #8E24AA)',
      shadow: 'rgba(206,147,216,0.4)',
    },
    {
      icon: Shield,
      label: isAr ? 'وضع الطوارئ' : isFr ? 'Mode Urgence' : 'Emergency Mode',
      gradient: 'linear-gradient(135deg, #EF9A9A, #E53935)',
      shadow: 'rgba(239,83,80,0.4)',
    },
    {
      icon: Heart,
      label: isAr ? 'مركز النصائح' : isFr ? 'Centre Conseils' : 'Advice Center',
      gradient: 'linear-gradient(135deg, #F48FB1, #E91E8C)',
      shadow: 'rgba(244,143,177,0.4)',
    },
    {
      icon: Stethoscope,
      label: isAr ? 'متابعة الطبيب' : isFr ? 'Suivi Médecin' : 'Doctor Follow-up',
      gradient: 'linear-gradient(135deg, #9FA8DA, #3949AB)',
      shadow: 'rgba(159,168,218,0.4)',
    },
    {
      icon: Apple,
      label: isAr ? 'تتبع الطعام' : isFr ? 'Suivi Repas' : 'Track Meals',
      gradient: 'linear-gradient(135deg, #80DEEA, #00838F)',
      shadow: 'rgba(128,222,234,0.4)',
    },
  ];

  const LANG_CONFIG = [
    {
      code: 'ar' as const,
      label: 'العربية',
      flag: '🇩🇿',
      sub: 'Arabic',
      gradient: 'linear-gradient(135deg, #F48FB1, #E91E8C)',
      shadow: 'rgba(244,143,177,0.45)',
    },
    {
      code: 'fr' as const,
      label: 'Français',
      flag: '🇫🇷',
      sub: 'French',
      gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
      shadow: 'rgba(79,195,247,0.45)',
    },
    {
      code: 'en' as const,
      label: 'English',
      flag: '🇬🇧',
      sub: 'English',
      gradient: 'linear-gradient(135deg, #A5D6A7, #388E3C)',
      shadow: 'rgba(165,214,167,0.45)',
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* Hero Section */}
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center px-6 pt-16 pb-10"
        style={{
          background: 'linear-gradient(160deg, #4FC3F7 0%, #29B6F6 40%, #F8BBD0 100%)',
          borderBottomLeftRadius: '40px',
          borderBottomRightRadius: '40px',
          boxShadow: '0 12px 40px rgba(79,195,247,0.35)',
          minHeight: '42vh',
        }}
      >
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-52 h-52 rounded-full opacity-20 pointer-events-none" style={{ background: 'white', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(-30%, 40%)' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: 'white', transform: 'translate(-50%, -50%)' }} />

        {/* Logo */}
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{ background: 'white', transform: 'scale(1.3)' }} />
          <img
            src={LOGO_URL}
            alt="AlleNest"
            className="relative w-28 h-28 rounded-full object-cover border-4 border-white/70"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
          />
        </div>

        {/* Title */}
        <h1
          className="text-4xl font-black text-white text-center leading-tight"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
        >
          AlleNest
        </h1>

        {/* Signature */}
        <p className="text-white/90 text-sm font-semibold text-center mt-2 max-w-xs leading-relaxed">
          ✨ {isAr ? 'لأن كل بكاء طفلك له سبب' : isFr ? 'Parce que chaque pleur de votre enfant a une cause' : 'Because every cry of your child has a cause'} ✨
        </p>

        {/* Tagline */}
        <p className="text-white/70 text-xs text-center mt-1.5 max-w-xs">
          {isAr
            ? 'رفيقك الذكي لصحة طفلك وسلامته'
            : isFr
            ? 'Votre compagnon intelligent pour la santé de votre enfant'
            : 'Your smart companion for your child\'s health & safety'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 max-w-md mx-auto w-full space-y-6">

        {/* Features Grid */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-4">
            {isAr ? 'المميزات' : isFr ? 'Fonctionnalités' : 'Features'}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center gap-2 p-3 rounded-3xl bg-white"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: f.gradient, boxShadow: `0 4px 12px ${f.shadow}` }}
                >
                  <f.icon size={22} color="white" />
                </div>
                <span className="text-[9px] font-bold text-gray-600 text-center leading-tight">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-4">
            {isAr ? 'اختر لغتك' : isFr ? 'Choisissez votre langue' : 'Choose your language'}
          </p>
          <div className="space-y-3">
            {LANG_CONFIG.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLanguageSelect(l.code)}
                className="w-full flex items-center gap-4 p-4 rounded-3xl text-white transition-all active:scale-[0.97]"
                style={{
                  background: l.gradient,
                  boxShadow: `0 8px 24px ${l.shadow}`,
                }}
              >
                <span className="text-3xl">{l.flag}</span>
                <div className="flex-1 text-start">
                  <p className="font-extrabold text-base leading-tight">{l.label}</p>
                  <p className="text-white/75 text-xs">{l.sub}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-2xl"
          style={{ background: '#FFFDE7', border: '1px solid #FFF176' }}
        >
          <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            {isAr
              ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية المتخصصة.'
              : isFr
              ? "Cette application est une aide, pas un remplacement d'un avis médical."
              : 'This app is a health aid, not a replacement for professional medical advice.'}
          </p>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-gray-400 text-center pb-4">
          {isAr
            ? 'بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية'
            : isFr
            ? 'En continuant, vous acceptez nos Conditions d\'utilisation et notre Politique de confidentialité'
            : 'By continuing, you agree to our Terms of Service and Privacy Policy'}
        </p>
      </div>
    </div>
  );
}
