import { useState } from 'react';
import { DANGER_SIGNS, EMERGENCY_NUMBERS } from '@/const';
import { AlertTriangle, Phone, CheckSquare, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import type { TranslationKey } from '@/lib/translations';

export default function EmergencyPage() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [checkedSigns, setCheckedSigns] = useState<string[]>([]);

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const toggleSign = (sign: string) => {
    setCheckedSigns((prev) =>
      prev.includes(sign) ? prev.filter((s) => s !== sign) : [...prev, sign]
    );
  };

  const FIRST_AID_STEPS = [
    {
      emoji: '😌',
      title: isAr ? 'ابقَ هادئاً' : isFr ? 'Restez calme' : 'Stay Calm',
      desc: isAr ? 'حافظ على هدوئك وهدوء طفلك. هذا يساعدك على التفكير بوضوح.' : isFr ? 'Gardez votre calme et celui de votre enfant. Cela vous aide à réfléchir clairement.' : 'Keep yourself and your child calm. This helps you think clearly.',
    },
    {
      emoji: '📞',
      title: isAr ? 'اتصل بالطوارئ' : isFr ? 'Appelez les secours' : 'Call Emergency',
      desc: isAr ? 'اتصل فوراً بـ 14 (الإسعاف) أو رقم الطوارئ المحلي.' : isFr ? "Appelez immédiatement le 14 (SAMU) ou votre numéro d'urgence local." : 'Immediately call 14 (SAMU) or your local emergency number.',
    },
    {
      emoji: '🛌',
      title: isAr ? 'ضع الطفل بأمان' : isFr ? 'Positionnez en sécurité' : 'Position Safely',
      desc: isAr ? 'ضع طفلك في وضع مريح. إذا كان فاقداً للوعي، ضعه على جانبه.' : isFr ? 'Placez votre enfant dans une position confortable. Si inconscient, placez-le sur le côté.' : 'Place your child in a comfortable position. If unconscious, place them on their side.',
    },
    {
      emoji: '💉',
      title: isAr ? 'أعطِ العلاج' : isFr ? 'Administrez le traitement' : 'Administer Treatment',
      desc: isAr ? 'إذا كان لديك حقنة أدرينالين تلقائية، استخدمها. وإلا، راقب العلامات الحيوية.' : isFr ? "Si vous avez un auto-injecteur d'épinéphrine, utilisez-le. Sinon, surveillez les signes vitaux." : 'If you have an epinephrine auto-injector, use it. Otherwise, monitor vital signs.',
    },
  ];

  const CALL_BUTTONS = [
    {
      label: t('callAmbulance'),
      number: EMERGENCY_NUMBERS.ambulance,
      gradient: 'linear-gradient(135deg, #EF9A9A, #E53935)',
      shadow: 'rgba(229,57,53,0.5)',
      emoji: '🚑',
    },
    {
      label: t('callPolice'),
      number: EMERGENCY_NUMBERS.police,
      gradient: 'linear-gradient(135deg, #90CAF9, #1565C0)',
      shadow: 'rgba(21,101,192,0.45)',
      emoji: '🚓',
    },
    {
      label: t('callFirefighters'),
      number: EMERGENCY_NUMBERS.fire,
      gradient: 'linear-gradient(135deg, #FFCC80, #E65100)',
      shadow: 'rgba(230,81,0,0.45)',
      emoji: '🚒',
    },
  ];

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#FFF5F5', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-7"
        style={{
          background: 'linear-gradient(135deg, #EF5350 0%, #C62828 60%, #E53935 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 8px 32px rgba(198,40,40,0.45)',
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-10 pointer-events-none" style={{ background: 'white', transform: 'translate(-30%, 40%)' }} />

        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setLocation('/')} className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              {isAr ? <ChevronRight size={20} color="white" /> : <ChevronLeft size={20} color="white" />}
            </button>
            <div className="w-9 h-9" />
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <div
              className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
              style={{ boxShadow: '0 0 0 6px rgba(255,255,255,0.15)' }}
            >
              <AlertTriangle size={34} color="white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-black leading-tight">{t('emergency')}</h1>
              <p className="text-white/80 text-sm mt-1 max-w-xs">{t('emergencyWarning')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">

        {/* Emergency Call Buttons */}
        <div className="space-y-3">
          {CALL_BUTTONS.map((btn) => (
            <button
              key={btn.number}
              onClick={() => { window.location.href = `tel:${btn.number}`; }}
              className="w-full flex items-center gap-4 p-4 rounded-3xl text-white transition-all active:scale-[0.97]"
              style={{ background: btn.gradient, boxShadow: `0 8px 24px ${btn.shadow}` }}
            >
              <span style={{ fontSize: 32 }}>{btn.emoji}</span>
              <div className="flex-1 text-start">
                <p className="font-extrabold text-base leading-tight">{btn.label}</p>
                <p className="text-white/80 text-sm font-bold">{btn.number}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Phone size={20} color="white" />
              </div>
            </button>
          ))}
        </div>

        {/* Danger Signs */}
        <div
          className="p-5 rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '2px solid #FFCDD2' }}
        >
          <p className="text-sm font-extrabold text-red-700 mb-4">🚨 {t('dangerSigns')}</p>
          <div className="space-y-3">
            {DANGER_SIGNS.map((sign) => {
              const checked = checkedSigns.includes(sign);
              return (
                <button
                  key={sign}
                  onClick={() => toggleSign(sign)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all active:scale-[0.98]"
                  style={{
                    background: checked ? '#FFEBEE' : '#F9FAFB',
                    border: `1.5px solid ${checked ? '#FFCDD2' : '#F1F5F9'}`,
                  }}
                >
                  {checked
                    ? <CheckSquare size={20} style={{ color: '#E53935', flexShrink: 0 }} />
                    : <Square size={20} style={{ color: '#9CA3AF', flexShrink: 0 }} />}
                  <span className="text-sm font-semibold" style={{ color: checked ? '#C62828' : '#374151' }}>
                    {t(sign as TranslationKey)}
                  </span>
                </button>
              );
            })}
          </div>
          {checkedSigns.length > 0 && (
            <div
              className="mt-4 p-3 rounded-2xl text-center"
              style={{ background: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', border: '1.5px solid #EF9A9A' }}
            >
              <p className="text-sm font-extrabold text-red-700">
                ⚠️ {checkedSigns.length} {isAr ? 'علامة خطر — اتصل بالطوارئ فوراً!' : isFr ? `signe${checkedSigns.length > 1 ? 's' : ''} de danger — Appelez les secours immédiatement !` : `danger sign${checkedSigns.length > 1 ? 's' : ''} — Call emergency services now!`}
              </p>
            </div>
          )}
        </div>

        {/* First Aid Steps */}
        <div
          className="p-5 rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
        >
          <p className="text-sm font-extrabold text-gray-800 mb-4">🩺 {t('firstAidSteps')}</p>
          <div className="space-y-4">
            {FIRST_AID_STEPS.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: 'linear-gradient(135deg, #FFCDD2, #EF9A9A)', boxShadow: '0 4px 12px rgba(239,154,154,0.4)' }}
                >
                  {step.emoji}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-800">{step.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div
          className="p-4 rounded-3xl space-y-2"
          style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFFDE7)', border: '2px solid #FFE082' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold text-lg">⚠️</span>
            <p className="text-sm font-extrabold text-amber-800">
              {isAr ? 'تنبيه: هذا التطبيق أداة مساعدة وليس بديلاً عن الطبيب' : isFr ? "Attention : application d'aide, pas de remplacement d'un avis médical" : 'Warning: this app is an aid tool, not a replacement for medical advice'}
            </p>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            {isAr ? 'اتصل دائماً بالطوارئ أولاً. هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية المتخصصة.' : isFr ? "Appelez toujours les secours en premier (14 – SAMU). Cette application est une aide, pas un remplacement d'un avis médical professionnel." : 'Always call emergency services first. This app is a health aid tool, not a replacement for professional medical advice.'}
          </p>
        </div>
      </div>
    </div>
  );
}
