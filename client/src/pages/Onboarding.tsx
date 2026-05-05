import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, getLoginUrl } from '@/const';
import { Shield, Sparkles, Heart, Activity, Stethoscope, Apple } from 'lucide-react';

const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
const FAMILY_IMG = '/manus-storage/family-illustration_815e9745.png';
const BABY_HERO_IMG = '/manus-storage/baby-hero_463105f2.png';

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
      label: isAr ? 'تسجيل الأعراض' : isFr ? 'Symptômes' : 'Track Symptoms',
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
      label: isAr ? 'طوارئ' : isFr ? 'Urgence' : 'Emergency',
      gradient: 'linear-gradient(135deg, #EF9A9A, #E53935)',
      shadow: 'rgba(239,83,80,0.4)',
    },
    {
      icon: Heart,
      label: isAr ? 'النصائح' : isFr ? 'Conseils' : 'Advice',
      gradient: 'linear-gradient(135deg, #F48FB1, #E91E8C)',
      shadow: 'rgba(244,143,177,0.4)',
    },
    {
      icon: Stethoscope,
      label: isAr ? 'الطبيب' : isFr ? 'Médecin' : 'Doctor',
      gradient: 'linear-gradient(135deg, #9FA8DA, #3949AB)',
      shadow: 'rgba(159,168,218,0.4)',
    },
    {
      icon: Apple,
      label: isAr ? 'الطعام' : isFr ? 'Repas' : 'Meals',
      gradient: 'linear-gradient(135deg, #80DEEA, #00838F)',
      shadow: 'rgba(128,222,234,0.4)',
    },
  ];

  const LANG_CONFIG = [
    {
      code: 'ar' as const,
      label: 'العربية',
      flag: '🇩🇿',
      sub: isAr ? 'عربي' : isFr ? 'Arabe' : 'Arabic',
      gradient: 'linear-gradient(135deg, #F48FB1, #E91E8C)',
      shadow: 'rgba(244,143,177,0.45)',
    },
    {
      code: 'fr' as const,
      label: 'Français',
      flag: '🇫🇷',
      sub: isAr ? 'فرنسي' : isFr ? 'Français' : 'French',
      gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
      shadow: 'rgba(79,195,247,0.45)',
    },
    {
      code: 'en' as const,
      label: 'English',
      flag: '🇬🇧',
      sub: isAr ? 'إنجليزي' : isFr ? 'Anglais' : 'English',
      gradient: 'linear-gradient(135deg, #A5D6A7, #388E3C)',
      shadow: 'rgba(165,214,167,0.45)',
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F0F7FF', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Hero Section */}
      <div
        className="relative overflow-hidden flex flex-col items-center justify-end px-6 pt-10 pb-0"
        style={{
          background: 'linear-gradient(160deg, #4FC3F7 0%, #29B6F6 50%, #F8BBD0 100%)',
          borderBottomLeftRadius: '48px',
          borderBottomRightRadius: '48px',
          boxShadow: '0 16px 48px rgba(79,195,247,0.4)',
          minHeight: '52vh',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-20 pointer-events-none" style={{ background: 'white', transform: 'translate(35%, -35%)' }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(-25%, 35%)' }} />
        <div className="absolute top-4 left-6 w-20 h-20 rounded-full opacity-10 pointer-events-none" style={{ background: 'white' }} />

        {/* Logo + App name row */}
        <div className="absolute top-8 left-0 right-0 flex items-center justify-center gap-3 px-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ background: 'white', transform: 'scale(1.4)' }} />
            <img
              src={LOGO_URL}
              alt="AlleNest"
              className="relative w-14 h-14 rounded-full object-cover border-3 border-white/80"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.2)', borderWidth: '3px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.8)' }}
            />
          </div>
          <div>
            <h1
              className="text-3xl font-black text-white leading-none"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.15)', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
            >
              AlleNest
            </h1>
            <p className="text-white/80 text-xs font-medium mt-0.5">
              {isAr ? 'رفيقك الذكي لصحة طفلك' : isFr ? 'Votre compagnon santé enfant' : 'Your smart child health companion'}
            </p>
          </div>
        </div>

        {/* Greeting text */}
        <div className="relative z-10 text-center mb-2 mt-20">
          <p
            className="font-black leading-tight"
            style={{
              fontSize: '2rem',
              color: '#E91E8C',
              textShadow: '0 2px 8px rgba(233,30,140,0.25)',
              fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif",
            }}
          >
            {isAr ? 'مرحباً أمي 💙' : isFr ? 'Bonjour Maman 💙' : 'Hello Mum 💙'}
          </p>
          <p
            className="font-black leading-tight"
            style={{
              fontSize: '2rem',
              color: '#0288D1',
              textShadow: '0 2px 8px rgba(2,136,209,0.25)',
              fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif",
            }}
          >
            {isAr ? 'مرحباً أبي 💙' : isFr ? 'Bonjour Papa 💙' : 'Hello Dad 💙'}
          </p>
          <p className="text-white/90 text-sm font-semibold mt-2">
            {isAr ? 'نحن مع طفلك في كل لحظة ❤️' : isFr ? 'Nous veillons sur votre enfant ❤️' : 'We care for your child\'s health ❤️'}
          </p>
        </div>

        {/* Family illustration — bottom aligned, partially clipped */}
        <div className="relative z-10 flex items-end justify-center w-full" style={{ height: '220px', marginTop: '8px' }}>
          {/* Baby hero on the right — mix-blend-mode:multiply removes white background */}
          <img
            src={BABY_HERO_IMG}
            alt="Baby"
            className="absolute right-4 bottom-0 object-contain"
            style={{ height: '180px', mixBlendMode: 'multiply' }}
          />
          {/* Family on the left/center */}
          <img
            src={FAMILY_IMG}
            alt="Family"
            className="absolute left-0 bottom-0 object-contain"
            style={{ height: '210px', mixBlendMode: 'multiply' }}
          />
        </div>
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
                  <span className="text-white font-bold text-lg">{isAr ? '←' : '→'}</span>
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
        <p className="text-[10px] text-gray-400 text-center pb-6">
          {isAr
            ? 'بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية'
            : isFr
            ? "En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité"
            : 'By continuing, you agree to our Terms of Service and Privacy Policy'}
        </p>
      </div>
    </div>
  );
}
