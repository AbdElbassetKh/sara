import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, getLoginUrl } from '@/const';
import { Globe, Heart, Shield, Sparkles } from 'lucide-react';

const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';

export default function Onboarding() {
  const { setLanguage, language, t } = useLanguage();

  const handleLanguageSelect = (lang: typeof SUPPORTED_LANGUAGES[number]) => {
    setLanguage(lang);
    window.location.href = getLoginUrl();
  };

  const FEATURES = [
    { icon: Shield, label: 'Allergen Detection', labelFr: 'Détection d\'allergènes', labelAr: 'كشف مسببات الحساسية', color: 'text-sky-500', bg: 'bg-sky-50' },
    { icon: Sparkles, label: 'AI Insights', labelFr: 'Insights IA', labelAr: 'رؤى الذكاء الاصطناعي', color: 'text-pink-500', bg: 'bg-pink-50' },
    { icon: Heart, label: 'Health Tracking', labelFr: 'Suivi santé', labelAr: 'تتبع الصحة', color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-pink-50 p-6">
      <div className="max-w-sm w-full space-y-8 text-center">

        {/* Logo */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-sky-200/50 blur-xl scale-110" />
            <img
              src={LOGO_URL}
              alt="AlleNest Logo"
              className="relative w-40 h-40 object-contain drop-shadow-2xl rounded-full"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">
              AlleNest
            </h1>
            <p className="text-sm text-gray-500 font-medium italic mt-0.5">Nature's Gentle Embrace</p>
          </div>
        </div>

        {/* Signature */}
        <div className="space-y-2 px-2">
          <h2 className="text-xl font-bold text-gray-800">
            Child Safety AI
          </h2>
          {/* Signature officielle */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-100 to-pink-100 blur-sm" />
            <div className="relative bg-gradient-to-r from-sky-50 to-pink-50 border border-sky-100 rounded-2xl px-4 py-3">
              <p className="text-sm font-semibold text-gray-700 italic leading-relaxed text-center">
                <span className="text-sky-500">✨</span>
                {' '}
                <span className="bg-gradient-to-r from-sky-600 to-pink-600 bg-clip-text text-transparent font-bold">
                  {language === 'ar' ? 'لأن كل بكاء طفلك له سبب' : language === 'fr' ? 'Parce que chaque pleur de votre enfant a une cause' : 'Because every cry of your child has a cause'}
                </span>
                {' '}
                <span className="text-pink-500">✨</span>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex justify-center gap-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center shadow-sm`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <span className="text-[10px] font-semibold text-gray-500 text-center leading-tight">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Language Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 justify-center text-gray-500">
            <Globe size={15} />
            <span className="text-xs font-semibold uppercase tracking-wider">Choose your language</span>
          </div>

          <div className="space-y-3">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const gradients: Record<string, string> = {
                en: 'from-sky-500 to-blue-600',
                fr: 'from-blue-500 to-indigo-600',
                ar: 'from-pink-500 to-rose-600',
              };
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full h-13 py-3.5 rounded-2xl bg-gradient-to-r ${gradients[lang]} text-white font-bold text-base shadow-md transition-all active:scale-95 hover:shadow-lg`}
                  style={{ boxShadow: lang === 'en' ? '0 6px 20px rgba(79,195,247,0.4)' : lang === 'fr' ? '0 6px 20px rgba(99,102,241,0.4)' : '0 6px 20px rgba(244,114,182,0.4)' }}
                >
                  {LANGUAGE_NAMES[lang]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Disclaimer médical */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-left">
          <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            {language === 'ar'
              ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية المتخصصة. استشر دائماً طبيباً لأي مشكلة صحية.'
              : language === 'fr'
              ? "Cette application est une aide, pas un remplacement d'un avis médical. Consultez toujours un médecin pour tout problème de santé."
              : 'This app is a health aid tool, not a replacement for professional medical advice. Always consult a doctor for any health concern.'}
          </p>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-gray-400 pb-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
