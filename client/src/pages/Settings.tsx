import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/const';
import { LogOut, Bell, Globe, Lock, Info, Crown, Sun, FileText, Star, ChevronRight, Baby, Settings as SettingsIcon, Stethoscope } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { ChildPhotoEditor } from '@/components/ChildPhotoEditor';

const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [, setLocation] = useLocation();

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setLocation('/');
      window.location.reload();
    },
  });

  const LANG_FLAGS: Record<string, string> = { ar: '🇩🇿', fr: '🇫🇷', en: '🇬🇧' };

  const MENU_ITEMS = [
    {
      icon: Crown,
      label: isAr ? 'AlleNest المميز' : isFr ? 'AlleNest Premium' : 'AlleNest Premium',
      sub: isAr ? 'اشتراك شهري 500 دج / سنوي 4000 دج' : isFr ? 'Mensuel 500 DA / Annuel 4 000 DA' : 'Monthly 500 DA / Yearly 4,000 DA',
      gradient: 'linear-gradient(135deg, #FFD54F, #FF8F00)',
      shadow: 'rgba(255,213,79,0.4)',
      path: '/subscription',
    },
    {
      icon: Sun,
      label: isAr ? 'التسجيل اليومي' : isFr ? 'Bilan quotidien' : 'Daily Check-in',
      sub: isAr ? 'التتبع يوما بيوم' : isFr ? 'Suivi jour par jour' : 'Day-by-day tracking',
      gradient: 'linear-gradient(135deg, #A5D6A7, #388E3C)',
      shadow: 'rgba(165,214,167,0.4)',
      path: '/daily-checkin',
    },
    {
      icon: Stethoscope,
      label: isAr ? 'قائمة الأطباء' : isFr ? 'Mes Médecins' : 'My Doctors',
      sub: isAr ? 'إدارة جهات الاتصال الطبية' : isFr ? 'Gérer vos contacts médicaux' : 'Manage your medical contacts',
      gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
      shadow: 'rgba(79,195,247,0.4)',
      path: '/doctors',
    },
    {
      icon: FileText,
      label: isAr ? 'تصدير تقرير' : isFr ? 'Exporter un rapport' : 'Export Report',
      sub: isAr ? 'تنزيل بيانات الصحة' : isFr ? 'Télécharger les données de santé' : 'Download health data',
      gradient: 'linear-gradient(135deg, #90CAF9, #1565C0)',
      shadow: 'rgba(144,202,249,0.4)',
      path: '/export',
    },
    {
      icon: Star,
      label: isAr ? 'تقييم التطبيق' : isFr ? "Évaluer l'application" : 'Rate the App',
      sub: isAr ? 'أعطِ رأيك' : isFr ? 'Donnez votre avis' : 'Share your feedback',
      gradient: 'linear-gradient(135deg, #FFCC80, #E65100)',
      shadow: 'rgba(255,204,128,0.4)',
      path: '/rate',
    },
  ];

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-7"
        style={{
          background: 'linear-gradient(135deg, #9FA8DA 0%, #5C6BC0 60%, #7986CB 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 8px 32px rgba(92,107,192,0.35)',
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-10 pointer-events-none" style={{ background: 'white', transform: 'translate(-30%, 40%)' }} />

        <div className="relative z-10 max-w-md mx-auto flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <SettingsIcon size={28} color="white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-extrabold leading-tight">{t('settings')}</h1>
            <p className="text-white/75 text-xs mt-0.5">
              {isAr ? 'إدارة حسابك وتفضيلاتك' : isFr ? 'Gérez votre compte et préférences' : 'Manage your account & preferences'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">

        {/* Children Profiles */}
        <ChildrenProfileSection language={language} />

        {/* Language */}
        <div
          className="p-5 rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4FC3F7, #0288D1)', boxShadow: '0 4px 12px rgba(79,195,247,0.4)' }}>
              <Globe size={18} color="white" />
            </div>
            <p className="text-sm font-extrabold text-gray-800">{t('language')}</p>
          </div>
          <div className="space-y-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all active:scale-[0.97]"
                style={{
                  background: language === lang ? 'linear-gradient(135deg, #E3F2FD, #BBDEFB)' : '#F9FAFB',
                  border: `2px solid ${language === lang ? '#90CAF9' : '#F1F5F9'}`,
                }}
              >
                <span style={{ fontSize: 22 }}>{LANG_FLAGS[lang]}</span>
                <span className="text-sm font-bold text-gray-700 flex-1 text-start">{LANGUAGE_NAMES[lang]}</span>
                {language === lang && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div
          className="p-5 rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F48FB1, #E91E8C)', boxShadow: '0 4px 12px rgba(244,143,177,0.4)' }}>
              <Bell size={18} color="white" />
            </div>
            <p className="text-sm font-extrabold text-gray-800">{t('notifications')}</p>
          </div>
          <div className="space-y-4">
            {[
              { id: 'push', label: t('pushNotifications'), value: notifications, onChange: setNotifications },
              { id: 'email', label: t('emailAlerts'), value: emailAlerts, onChange: setEmailAlerts },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <Switch checked={item.value} onCheckedChange={item.onChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div
          className="p-5 rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFCC80, #E65100)', boxShadow: '0 4px 12px rgba(255,204,128,0.4)' }}>
              <Lock size={18} color="white" />
            </div>
            <p className="text-sm font-extrabold text-gray-800">{t('privacy')}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">{t('dataSharing')}</span>
            <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-3">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white transition-all active:scale-[0.97]"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: item.gradient, boxShadow: `0 4px 12px ${item.shadow}` }}
              >
                <item.icon size={20} color="white" />
              </div>
              <div className="flex-1 text-start">
                <p className="text-sm font-bold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* About */}
        <div
          className="p-5 rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #80DEEA, #00838F)', boxShadow: '0 4px 12px rgba(128,222,234,0.4)' }}>
              <Info size={18} color="white" />
            </div>
            <p className="text-sm font-extrabold text-gray-800">{t('about')}</p>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <img src={LOGO_URL} alt="AlleNest" className="w-14 h-14 object-cover rounded-2xl" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }} />
            <div>
              <p className="text-sm font-extrabold text-gray-800">AlleNest</p>
              <p className="text-xs text-gray-400">{t('version')} 1.0.0 · Build 2026.05</p>
            </div>
          </div>
          <div
            className="px-4 py-3 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg, #E3F2FD, #FCE4EC)', border: '1px solid #BBDEFB' }}
          >
            <p className="text-xs font-bold italic" style={{ background: 'linear-gradient(135deg, #0288D1, #E91E8C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ✨ {isAr ? 'لأن كل بكاء طفلك له سبب' : isFr ? 'Parce que chaque pleur de votre enfant a une cause' : 'Because every cry of your child has a cause'} ✨
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full h-14 font-extrabold text-base rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #FFCDD2, #EF9A9A)',
            border: '2px solid #FFCDD2',
            color: '#C62828',
            boxShadow: '0 4px 16px rgba(239,154,154,0.4)',
          }}
        >
          <LogOut size={20} />
          {logoutMutation.isPending ? t('loading') : t('logout')}
        </button>

        {/* Footer */}
        <div className="text-center space-y-2 text-xs text-gray-400 pb-4">
          <p>© 2026 AlleNest. All rights reserved.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => setLocation('/legal/privacy')} className="hover:text-gray-600 transition-colors">{t('privacyPolicy')}</button>
            <button onClick={() => setLocation('/legal/terms')} className="hover:text-gray-600 transition-colors">{t('termsOfService')}</button>
            <button onClick={() => setLocation('/legal/partners')} className="hover:text-gray-600 transition-colors">
              {isAr ? 'الشركاء' : isFr ? 'Partenaires' : 'Partners'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Children profile photo section ───────────────────────────
function ChildrenProfileSection({ language }: { language: string }) {
  const lbl = (fr: string, ar: string, en: string) =>
    language === 'fr' ? fr : language === 'ar' ? ar : en;

  const { data: children, isLoading } = trpc.children.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div
        className="p-5 rounded-3xl bg-white"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-pink-100 flex items-center justify-center">
            <Baby size={18} className="text-pink-500" />
          </div>
          <p className="text-sm font-extrabold text-gray-800">{lbl('Profils enfants', 'ملفات الأطفال', 'Children Profiles')}</p>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!children || children.length === 0) {
    return (
      <div
        className="p-5 rounded-3xl bg-white"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F48FB1, #E91E8C)', boxShadow: '0 4px 12px rgba(244,143,177,0.4)' }}>
            <Baby size={18} color="white" />
          </div>
          <p className="text-sm font-extrabold text-gray-800">{lbl('Profils enfants', 'ملفات الأطفال', 'Children Profiles')}</p>
        </div>
        <p className="text-sm text-gray-400 text-center py-4">
          {lbl(
            'Aucun profil enfant. Ajoutez un enfant depuis le tableau de bord.',
            'لا يوجد ملف طفل. أضف طفلاً من لوحة التحكم.',
            'No child profile yet. Add a child from the dashboard.',
          )}
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-5 rounded-3xl bg-white"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F48FB1, #E91E8C)', boxShadow: '0 4px 12px rgba(244,143,177,0.4)' }}>
          <Baby size={18} color="white" />
        </div>
        <p className="text-sm font-extrabold text-gray-800">{lbl('Profils enfants', 'ملفات الأطفال', 'Children Profiles')}</p>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        {lbl(
          'Appuyez sur la caméra pour changer la photo de profil.',
          'اضغط على الكاميرا لتغيير صورة الملف الشخصي.',
          'Tap the camera icon to change the profile photo.',
        )}
      </p>
      <div className="space-y-4">
        {children.map((child) => (
          <ChildPhotoEditor key={child.id} child={child} />
        ))}
      </div>
    </div>
  );
}
