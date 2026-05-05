import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';

const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  backPath?: string;
  rightElement?: React.ReactNode;
}

export default function AppHeader({ title, showBack = true, backPath, rightElement }: AppHeaderProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center gap-3">
      {showBack && (
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}
      {!showBack && (
        <img
          src={LOGO_URL}
          alt="AlleNest"
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-sm"
        />
      )}
      <h1 className="flex-1 text-lg font-semibold text-gray-800 truncate">{title}</h1>
      {rightElement && <div className="flex-shrink-0">{rightElement}</div>}
    </div>
  );
}
