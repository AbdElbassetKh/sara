import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/const';
import { LogOut, Bell, Globe, Lock, Info } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';

const LOGO_URL = '/manus-storage/allenest-logo_9219c293.png';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [, setLocation] = useLocation();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setLocation('/');
      window.location.reload();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Logo */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 max-w-md mx-auto">
        <img src={LOGO_URL} alt="AlleNest" className="w-10 h-10 object-contain rounded-full" />
        <div>
          <h1 className="text-base font-bold text-foreground leading-tight">AlleNest</h1>
          <p className="text-[10px] text-muted-foreground leading-tight">Child Safety AI</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('settings')}</h2>
        </div>

        {/* Language Settings */}
        <Card className="p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-primary" />
            <h3 className="text-base font-semibold text-foreground">{t('language')}</h3>
          </div>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as typeof SUPPORTED_LANGUAGES[number])}
          >
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {LANGUAGE_NAMES[lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Notifications Settings */}
        <Card className="p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-secondary" />
            <h3 className="text-base font-semibold text-foreground">{t('notifications')}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-sm font-medium cursor-pointer">
                {t('pushNotifications')}
              </Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts" className="text-sm font-medium cursor-pointer">
                {t('emailAlerts')}
              </Label>
              <Switch
                id="email-alerts"
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-orange-600" />
            <h3 className="text-base font-semibold text-foreground">{t('privacy')}</h3>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="data-sharing" className="text-sm font-medium cursor-pointer">
              {t('dataSharing')}
            </Label>
            <Switch
              id="data-sharing"
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-blue-500" />
            <h3 className="text-base font-semibold text-foreground">{t('about')}</h3>
          </div>
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="AlleNest" className="w-12 h-12 object-contain rounded-xl" />
            <div>
              <p className="text-sm font-bold text-foreground">AlleNest – Child Safety AI</p>
              <p className="text-xs text-muted-foreground">{t('version')} 1.0.0 · Build 2026.05.05</p>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          disabled={logoutMutation.isPending}
          className="w-full h-12 text-base font-medium gap-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          {logoutMutation.isPending ? t('loading') : t('logout')}
        </Button>

        {/* Footer */}
        <div className="text-center space-y-2 text-xs text-muted-foreground pb-4">
          <p>© 2026 AlleNest. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              {t('privacyPolicy')}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {t('termsOfService')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
