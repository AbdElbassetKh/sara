import { Link, useLocation } from 'wouter';
import { Home, Clock, Sparkles, Bell, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BottomNavigation() {
  const [location] = useLocation();
  const { t, language } = useLanguage();

  const NAV_ITEMS = [
    {
      path: '/',
      icon: Home,
      label: t('navHome'),
      activeColor: 'text-sky-500',
      activeBg: 'bg-sky-50',
      dotColor: 'bg-sky-500',
    },
    {
      path: '/timeline',
      icon: Clock,
      label: t('navTimeline'),
      activeColor: 'text-violet-500',
      activeBg: 'bg-violet-50',
      dotColor: 'bg-violet-500',
    },
    {
      path: '/insights',
      icon: Sparkles,
      label: t('navInsights'),
      activeColor: 'text-pink-500',
      activeBg: 'bg-pink-50',
      dotColor: 'bg-pink-500',
    },
    {
      path: '/notifications',
      icon: Bell,
      label: language === 'fr' ? 'Alertes' : language === 'ar' ? 'تنبيهات' : 'Alerts',
      activeColor: 'text-amber-500',
      activeBg: 'bg-amber-50',
      dotColor: 'bg-amber-500',
    },
    {
      path: '/settings',
      icon: Settings,
      label: t('navSettings'),
      activeColor: 'text-slate-600',
      activeBg: 'bg-slate-100',
      dotColor: 'bg-slate-500',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-[68px] max-w-md mx-auto"
      style={{ boxShadow: '0 -4px 20px rgba(79,195,247,0.12)' }}
    >
      {NAV_ITEMS.map(({ path, icon: Icon, label, activeColor, activeBg, dotColor }) => {
        const isActive = location === path || (path !== '/' && location.startsWith(path));
        return (
          <Link
            key={path}
            href={path}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-1 transition-all"
            title={label}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                isActive ? `${activeBg} ${activeColor}` : 'text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span
              className={`text-[9px] font-semibold leading-tight transition-colors ${
                isActive ? activeColor : 'text-gray-400'
              }`}
            >
              {label}
            </span>
            {isActive && (
              <span className={`w-1 h-1 rounded-full ${dotColor} mt-0.5`} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
