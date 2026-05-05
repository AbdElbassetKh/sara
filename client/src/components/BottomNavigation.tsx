import { Link } from 'wouter';
import { Home, Clock, Lightbulb, BookOpen, Settings } from 'lucide-react';
import { useLocation } from 'wouter';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/timeline', icon: Clock, label: 'Timeline' },
  { path: '/insights', icon: Lightbulb, label: 'Insights' },
  { path: '/advice', icon: BookOpen, label: 'Advice' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-20 pb-4 max-w-md mx-auto">
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
        const isActive = location === path;
        return (
          <Link key={path} href={path}>
            <a
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-all flex-1 h-full ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:bg-muted/10'
              }`}
              title={label}
            >
              <Icon size={24} />
              <span className="text-xs">{label}</span>
            </a>
          </Link>
        );
      })}
    </nav>
  );
}
