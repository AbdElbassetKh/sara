import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/const';
import { LogOut, Bell, Globe, Lock } from 'lucide-react';

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const handleLogout = () => {
    // TODO: Call logout mutation
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted">Manage your preferences</p>
        </div>

        {/* Language Settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Language</h2>
          </div>
          <Select value={language} onValueChange={(value) => setLanguage(value as typeof SUPPORTED_LANGUAGES[number])}>
            <SelectTrigger>
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
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-sm font-medium cursor-pointer">
                Push Notifications
              </Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts" className="text-sm font-medium cursor-pointer">
                Email Alerts
              </Label>
              <Switch
                id="email-alerts"
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>
            <p className="text-xs text-muted">
              Get reminders for vaccinations, doctor appointments, and important health milestones.
            </p>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock size={20} className="text-orange-600" />
            <h2 className="text-lg font-semibold text-foreground">Privacy</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="data-sharing" className="text-sm font-medium cursor-pointer">
                Share Anonymous Data
              </Label>
              <Switch
                id="data-sharing"
                checked={dataSharing}
                onCheckedChange={setDataSharing}
              />
            </div>
            <p className="text-xs text-muted">
              Help improve AlleNest by sharing anonymized health data for research purposes.
            </p>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">About</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted">App Version</span>
              <span className="text-sm font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">Build</span>
              <span className="text-sm font-medium text-foreground">2026.05.05</span>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 text-base font-medium gap-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </Button>

        {/* Footer */}
        <div className="text-center space-y-2 text-xs text-muted">
          <p>© 2026 AlleNest. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
