import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, getLoginUrl } from '@/const';
import { Globe } from 'lucide-react';

export default function Onboarding() {
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (lang: typeof SUPPORTED_LANGUAGES[number]) => {
    setLanguage(lang);
    // Redirect to login after language selection
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="space-y-2">
          <div className="text-5xl font-bold tracking-tight">
            <span className="text-primary">Alle</span>
            <span className="text-secondary">Nest</span>
          </div>
          <p className="text-muted text-sm italic">Nature's Gentle Embrace</p>
        </div>

        {/* Welcome Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">Welcome to AlleNest</h1>
          <p className="text-muted">
            Your trusted companion for child health and safety. Manage allergies, track growth, and receive
            personalized insights powered by AI.
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-2 justify-center text-muted">
            <Globe size={18} />
            <span className="text-sm font-medium">Select Your Language</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
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
        <div className="grid grid-cols-2 gap-4 pt-8">
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-2xl mb-2">🍎</div>
            <p className="text-xs font-medium text-foreground">Food Tracking</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-xs font-medium text-foreground">AI Insights</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-2xl mb-2">📈</div>
            <p className="text-xs font-medium text-foreground">Growth Charts</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-2xl mb-2">💉</div>
            <p className="text-xs font-medium text-foreground">Vaccination</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted pt-6 space-y-1">
          <p>By continuing, you agree to our Terms of Service</p>
          <p>and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
