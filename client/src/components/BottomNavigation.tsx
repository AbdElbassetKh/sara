import { Link, useLocation } from 'wouter';
import { Home, Clock, Sparkles, Bell, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';

export default function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const { data: unreadCount } = trpc.notifications.unreadCount.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const NAV_ITEMS = [
    {
      path: '/',
      icon: Home,
      label: t('navHome'),
      activeGradient: 'from-sky-400 to-blue-500',
      activeShadow: 'rgba(79,195,247,0.45)',
      inactiveColor: '#9CA3AF',
    },
    {
      path: '/timeline',
      icon: Clock,
      label: t('navTimeline'),
      activeGradient: 'from-violet-400 to-purple-500',
      activeShadow: 'rgba(139,92,246,0.45)',
      inactiveColor: '#9CA3AF',
    },
    {
      path: '/insights',
      icon: Sparkles,
      label: t('navInsights'),
      activeGradient: 'from-pink-400 to-rose-500',
      activeShadow: 'rgba(244,114,182,0.45)',
      inactiveColor: '#9CA3AF',
    },
    {
      path: '/notifications',
      icon: Bell,
      label: t('navAlerts'),
      activeGradient: 'from-amber-400 to-orange-500',
      activeShadow: 'rgba(251,191,36,0.45)',
      inactiveColor: '#9CA3AF',
      badge: unreadCount && unreadCount > 0 ? unreadCount : undefined,
    },
    {
      path: '/settings',
      icon: Settings,
      label: t('navSettings'),
      activeGradient: 'from-slate-500 to-slate-600',
      activeShadow: 'rgba(100,116,139,0.45)',
      inactiveColor: '#9CA3AF',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center max-w-md mx-auto"
      style={{
        height: '72px',
        borderTop: '1px solid #F1F5F9',
        boxShadow: '0 -6px 30px rgba(79,195,247,0.10)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {NAV_ITEMS.map(({ path, icon: Icon, label, activeGradient, activeShadow, inactiveColor, badge }) => {
        const isActive = location === path || (path !== '/' && location.startsWith(path));
        return (
          <Link
            key={path}
            href={path}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-1 transition-all"
            title={label}
          >
            <div className="relative">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-br ${activeGradient} text-white`
                    : 'text-gray-400'
                }`}
                style={isActive ? { boxShadow: `0 4px 14px ${activeShadow}` } : {}}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} color={isActive ? 'white' : inactiveColor} />
              </div>
              {badge && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center px-1 shadow">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span
              className="text-[9px] font-semibold leading-tight transition-colors"
              style={{ color: isActive ? '#0288D1' : '#9CA3AF' }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
