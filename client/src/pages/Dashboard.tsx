import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Apple,
  AlertCircle,
  TrendingUp,
  Stethoscope,
  Activity,
  Syringe,
  Plus,
  Sun,
  Crown,
} from 'lucide-react';
import { useLocation } from 'wouter';

const LOGO_URL = '/manus-storage/allenest-logo_9219c293.png';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');

  const QUICK_ACTIONS = [
    { icon: Apple, label: t('actionTrackMeal'), color: 'text-green-600', path: '/meals' },
    { icon: AlertCircle, label: t('actionEmergency'), color: 'text-red-600', path: '/emergency' },
    { icon: TrendingUp, label: t('actionAiInsights'), color: 'text-blue-600', path: '/insights' },
    { icon: Stethoscope, label: t('actionDoctor'), color: 'text-purple-600', path: '/doctor' },
    { icon: Activity, label: t('actionGrowth'), color: 'text-orange-600', path: '/growth' },
    { icon: Syringe, label: t('actionVaccines'), color: 'text-pink-600', path: '/vaccines' },
    { icon: Sun, label: language === 'fr' ? 'Bilan du jour' : language === 'ar' ? 'بيلان اليوم' : 'Daily Check-in', color: 'text-yellow-600', path: '/daily-checkin' },
    { icon: Crown, label: language === 'fr' ? 'Premium' : language === 'ar' ? 'المميز' : 'Premium', color: 'text-amber-600', path: '/premium' },
  ];

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
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 p-5 space-y-1 border-0 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">{greeting}</h2>
          <p className="text-muted-foreground text-sm">{language === 'fr' ? 'Emma se porte bien aujourd\'hui 🌟' : language === 'ar' ? 'إيما بخير اليوم 🌟' : 'Emma is doing great today 🌟'}</p>
        </Card>

        {/* Health Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center space-y-1 shadow-sm">
            <div className="text-2xl font-bold text-primary">8</div>
            <p className="text-[10px] text-muted-foreground leading-tight">{t('mealsTracked')}</p>
          </Card>
          <Card className="p-4 text-center space-y-1 shadow-sm">
            <div className="text-2xl font-bold text-secondary">2</div>
            <p className="text-[10px] text-muted-foreground leading-tight">{t('symptoms')}</p>
          </Card>
          <Card className="p-4 text-center space-y-1 shadow-sm">
            <div className="text-2xl font-bold text-green-600">5</div>
            <p className="text-[10px] text-muted-foreground leading-tight">{t('daysSafe')}</p>
          </Card>
        </div>

        {/* Alert Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-700">{t('allergenDetected')}</p>
            <p className="text-xs text-red-500 mt-0.5">{t('allergenMessage')}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">{t('quickActions')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, color, path }) => (
              <Button
                key={label}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all"
                onClick={() => setLocation(path)}
              >
                <Icon size={24} className={color} />
                <span className="text-xs font-medium text-foreground text-center leading-tight">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">{t('recentActivity')}</h2>
          <div className="space-y-2">
            {[
              { time: language === 'fr' ? 'Aujourd\'hui 14h30' : language === 'ar' ? 'اليوم 2:30 م' : 'Today 2:30 PM', activity: language === 'fr' ? 'Pomme et banane mangées' : language === 'ar' ? 'تناول التفاح والموز' : 'Apple and banana eaten', type: 'meal' },
              { time: language === 'fr' ? 'Aujourd\'hui 13h15' : language === 'ar' ? 'اليوم 1:15 م' : 'Today 1:15 PM', activity: language === 'fr' ? 'Légère éruption observée' : language === 'ar' ? 'لوحظ طفح خفيف' : 'Mild rash observed', type: 'symptom' },
              { time: language === 'fr' ? 'Hier 10h00' : language === 'ar' ? 'أمس 10:00 ص' : 'Yesterday 10:00 AM', activity: language === 'fr' ? 'Visite chez Dr. Smith' : language === 'ar' ? 'زيارة الدكتور سميث' : 'Visited Dr. Smith', type: 'doctor' },
            ].map((item, idx) => (
              <Card key={idx} className="p-3 flex items-start gap-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.activity}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95"
        title={t('add')}
        onClick={() => setLocation('/meals')}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
