import { Link, useLocation } from 'wouter';
import { Home, Clock, Lightbulb, Bell, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BottomNavigation() {
  const [location] = useLocation();
  const { t, language } = useLanguage();

  const NAV_ITEMS = [
    { path: '/', icon: Home, label: t('navHome') },
    { path: '/timeline', icon: Clock, label: t('navTimeline') },
    { path: '/insights', icon: Lightbulb, label: t('navInsights') },
    { path: '/notifications', icon: Bell, label: language === 'fr' ? 'Alertes' : language === 'ar' ? 'تنبيهات' : 'Alerts' },
    { path: '/settings', icon: Settings, label: t('navSettings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-20 pb-4 max-w-md mx-auto">
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
        const isActive = location === path;
        return (
          <Link
            key={path}
            href={path}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-all flex-1 h-full ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/10'
            }`}
            title={label}
          >
            <Icon size={22} />
            <span className="text-[10px] leading-tight text-center">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
