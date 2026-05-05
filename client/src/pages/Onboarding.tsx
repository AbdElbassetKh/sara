import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, getLoginUrl } from '@/const';
import { Globe } from 'lucide-react';

const LOGO_URL = '/manus-storage/allenest-logo_9219c293.png';

export default function Onboarding() {
  const { setLanguage, t } = useLanguage();

  const handleLanguageSelect = (lang: typeof SUPPORTED_LANGUAGES[number]) => {
    setLanguage(lang);
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Logo Image */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src={LOGO_URL}
            alt="AlleNest Logo"
            className="w-48 h-48 object-contain drop-shadow-lg"
          />
          <p className="text-muted-foreground text-sm italic font-light">{t('appTagline')}</p>
        </div>

        {/* Welcome Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{t('welcomeTitle')}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed px-4">
            {t('appDescription')}
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 justify-center text-muted-foreground">
            <Globe size={16} />
            <span className="text-sm font-medium">{t('selectLanguage')}</span>
          </div>

          <div className="grid grid-cols-1 gap-3 px-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <Button
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                variant="outline"
                className="h-12 text-base font-medium border-2 hover:border-primary hover:bg-primary/5 transition-all"
              >
                {LANGUAGE_NAMES[lang]}
              </Button>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-3 px-4 pt-2">
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="text-2xl mb-2">🍎</div>
            <p className="text-xs font-semibold text-foreground">{t('featureFoodTracking')}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-xs font-semibold text-foreground">{t('featureAiInsights')}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="text-2xl mb-2">📈</div>
            <p className="text-xs font-semibold text-foreground">{t('featureGrowthCharts')}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="text-2xl mb-2">💉</div>
            <p className="text-xs font-semibold text-foreground">{t('featureVaccination')}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground pt-4 pb-8">
          <p>{t('termsNotice')}</p>
        </div>
      </div>
    </div>
  );
}
