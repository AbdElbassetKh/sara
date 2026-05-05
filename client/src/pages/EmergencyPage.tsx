const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DANGER_SIGNS, EMERGENCY_NUMBERS } from '@/const';
import { AlertTriangle, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKey } from '@/lib/translations';

export default function EmergencyPage() {
  const { t } = useLanguage();
  const [checkedSigns, setCheckedSigns] = useState<string[]>([]);

  const toggleSign = (sign: string) => {
    setCheckedSigns((prev) =>
      prev.includes(sign) ? prev.filter((s) => s !== sign) : [...prev, sign]
    );
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const FIRST_AID_STEPS_TRANSLATED = [
    {
      title: t('language') === 'fr' ? 'Restez calme' : t('language') === 'ar' ? 'ابقَ هادئاً' : 'Stay Calm',
      description:
        t('language') === 'fr'
          ? 'Gardez votre calme et celui de votre enfant. Cela vous aide à réfléchir clairement.'
          : t('language') === 'ar'
          ? 'حافظ على هدوئك وهدوء طفلك. هذا يساعدك على التفكير بوضوح.'
          : 'Keep yourself and your child calm. This helps you think clearly and respond effectively.',
    },
    {
      title: t('language') === 'fr' ? 'Appelez les secours' : t('language') === 'ar' ? 'اتصل بالطوارئ' : 'Call Emergency',
      description:
        t('language') === 'fr'
          ? 'Appelez immédiatement le 14 (SAMU) ou votre numéro d\'urgence local.'
          : t('language') === 'ar'
          ? 'اتصل فوراً بـ 14 (الإسعاف) أو رقم الطوارئ المحلي.'
          : 'Immediately call 14 (SAMU) or your local emergency number.',
    },
    {
      title: t('language') === 'fr' ? 'Positionnez en sécurité' : t('language') === 'ar' ? 'ضع الطفل بأمان' : 'Position Safely',
      description:
        t('language') === 'fr'
          ? 'Placez votre enfant dans une position confortable. Si inconscient, placez-le sur le côté.'
          : t('language') === 'ar'
          ? 'ضع طفلك في وضع مريح. إذا كان فاقداً للوعي، ضعه على جانبه.'
          : 'Place your child in a comfortable position. If unconscious, place them on their side.',
    },
    {
      title: t('language') === 'fr' ? 'Administrez le traitement' : t('language') === 'ar' ? 'أعطِ العلاج' : 'Administer Treatment',
      description:
        t('language') === 'fr'
          ? 'Si vous avez un auto-injecteur d\'épinéphrine, utilisez-le. Sinon, surveillez les signes vitaux.'
          : t('language') === 'ar'
          ? 'إذا كان لديك حقنة أدرينالين تلقائية، استخدمها. وإلا، راقب العلامات الحيوية.'
          : 'If you have an epinephrine auto-injector, use it. Otherwise, monitor vital signs.',
    },
  ];

  return (
    <div className="min-h-screen bg-red-50 pb-24 overflow-x-hidden">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header - Red Alert */}
        <div className="space-y-3 text-center pt-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/40">
              <AlertTriangle size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{t('emergency')}</h1>
          <p className="text-white/80 text-sm px-4">{t('emergencyWarning')}</p>
        </div>

        {/* Emergency Calls */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleCall(EMERGENCY_NUMBERS.ambulance)}
            className="h-16 text-lg font-bold bg-red-600 hover:bg-red-700 text-white gap-3 rounded-xl shadow-md"
          >
            <Phone size={24} />
            {t('callAmbulance')} — {EMERGENCY_NUMBERS.ambulance}
          </Button>
          <Button
            onClick={() => handleCall(EMERGENCY_NUMBERS.police)}
            className="h-16 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white gap-3 rounded-xl shadow-md"
          >
            <Phone size={24} />
            {t('callPolice')} — {EMERGENCY_NUMBERS.police}
          </Button>
          <Button
            onClick={() => handleCall(EMERGENCY_NUMBERS.fire)}
            className="h-16 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white gap-3 rounded-xl shadow-md"
          >
            <Phone size={24} />
            {t('callFirefighters')} — {EMERGENCY_NUMBERS.fire}
          </Button>
        </div>

        {/* Danger Signs */}
        <Card className="p-5 space-y-4 border-red-200 bg-white shadow-sm">
          <h2 className="text-lg font-bold text-red-900">{t('dangerSigns')}</h2>
          <div className="space-y-3">
            {DANGER_SIGNS.map((sign) => (
              <div key={sign} className="flex items-center space-x-3">
                <Checkbox
                  id={sign}
                  checked={checkedSigns.includes(sign)}
                  onCheckedChange={() => toggleSign(sign)}
                />
                <label
                  htmlFor={sign}
                  className="text-sm font-medium text-red-900 cursor-pointer flex-1"
                >
                  {t(sign as TranslationKey)}
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* First Aid Steps */}
        <Card className="p-5 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">{t('firstAidSteps')}</h2>
          <div className="space-y-4">
            {FIRST_AID_STEPS_TRANSLATED.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0 text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Important Note */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️</strong>{' '}
            {t('language') === 'fr'
              ? 'Appelez toujours les secours en premier. Ces instructions ne remplacent pas un avis médical professionnel.'
              : t('language') === 'ar'
              ? 'اتصل دائماً بالطوارئ أولاً. هذه الإرشادات لا تحل محل المشورة الطبية المتخصصة.'
              : 'Always call emergency services first. These are guidelines only and do not replace professional medical advice.'}
          </p>
        </div>
      </div>
    </div>
  );
}
