import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  gradient: string;
  shadowColor: string;
  icon?: LucideIcon;
  iconBg?: string;
  backPath?: string;
  rightAction?: React.ReactNode;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  gradient,
  shadowColor,
  icon: Icon,
  iconBg,
  backPath,
  rightAction,
  children,
}: PageHeaderProps) {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div
      className="relative overflow-hidden px-4 pt-10 pb-6"
      style={{
        background: gradient,
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        boxShadow: `0 8px 32px ${shadowColor}`,
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'white', transform: 'translate(40%, -40%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'white', transform: 'translate(-30%, 40%)' }}
      />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-3">
          {/* Back button */}
          {backPath ? (
            <button
              onClick={() => setLocation(backPath)}
              className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all active:scale-90"
            >
              {isAr ? <ChevronRight size={20} color="white" /> : <ChevronLeft size={20} color="white" />}
            </button>
          ) : <div className="w-9 h-9" />}

          {/* Right action */}
          {rightAction || <div className="w-9 h-9" />}
        </div>

        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: iconBg || 'rgba(255,255,255,0.25)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              <Icon size={26} color="white" />
            </div>
          )}
          <div>
            <h1
              className="text-white text-xl font-extrabold leading-tight"
              style={{ fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/75 text-xs mt-0.5 font-medium">{subtitle}</p>
            )}
          </div>
        </div>

        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}
