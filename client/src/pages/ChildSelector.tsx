import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import type { ChildProfile } from '@/contexts/AppContext';
import { Plus, Heart, ChevronRight } from 'lucide-react';

const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';

function getAge(birthDate: string, language: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (months < 1) {
    const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    if (language === 'ar') return `${days} يوم`;
    if (language === 'fr') return `${days} jour${days > 1 ? 's' : ''}`;
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  if (months < 12) {
    if (language === 'ar') return `${months} شهر`;
    if (language === 'fr') return `${months} mois`;
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (language === 'ar') return rem > 0 ? `${years} سنة و${rem} شهر` : `${years} سنة`;
  if (language === 'fr') return rem > 0 ? `${years} an${years > 1 ? 's' : ''} ${rem} mois` : `${years} an${years > 1 ? 's' : ''}`;
  return rem > 0 ? `${years}y ${rem}m` : `${years} year${years !== 1 ? 's' : ''}`;
}

function ChildAvatar({ child, size = 80 }: { child: ChildProfile; size?: number }) {
  const isGirl = child.gender === 'girl';
  if (child.photoUrl) {
    return (
      <img
        src={child.photoUrl}
        alt={child.name}
        className="rounded-full object-cover border-4 border-white shadow-lg"
        style={{ width: size, height: size }}
      />
    );
  }
  const gradient = isGirl
    ? 'linear-gradient(135deg, #F8BBD0 0%, #F48FB1 100%)'
    : 'linear-gradient(135deg, #B3E5FC 0%, #4FC3F7 100%)';
  const emoji = isGirl ? '👧' : '👦';
  return (
    <div
      className="rounded-full flex items-center justify-center border-4 border-white shadow-lg"
      style={{ width: size, height: size, background: gradient, fontSize: size * 0.45 }}
    >
      {emoji}
    </div>
  );
}

export default function ChildSelector() {
  const { language } = useLanguage();
  const { setSelectedChild, setChildren } = useAppContext();
  const [, setLocation] = useLocation();

  const { data: childrenData = [], isLoading } = trpc.children.list.useQuery();

  useEffect(() => {
    if (childrenData.length > 0) {
      const mapped: ChildProfile[] = childrenData.map((c: any) => ({
        id: c.id,
        name: c.name,
        birthDate: c.birthDate ?? '',
        gender: (c.gender as 'boy' | 'girl') ?? 'boy',
        allergies: Array.isArray(c.allergies) ? c.allergies : [],
        photoUrl: c.photoUrl ?? undefined,
      }));
      setChildren(mapped);
    }
  }, [childrenData, setChildren]);

  const handleSelect = (child: ChildProfile) => {
    setSelectedChild(child);
    setLocation('/');
  };

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const greeting = isAr
    ? ['مرحباً أمي 💙', 'مرحباً أبي 💙']
    : isFr
    ? ['Bonjour Maman 💙', 'Bonjour Papa 💙']
    : ['Hello Mum 💙', 'Hello Dad 💙'];

  const tagline = isAr
    ? 'نحن مع حالة صحة طفلك'
    : isFr
    ? 'Nous veillons sur la santé de votre enfant'
    : 'We care for your child\'s health';

  const title = isAr ? 'اختر طفلك' : isFr ? 'Choisissez votre enfant' : 'Choose your child';
  const noChildTitle = isAr ? 'لا يوجد ملف طفل بعد' : isFr ? 'Aucun profil enfant' : 'No child profile yet';
  const noChildSub = isAr ? 'أضف ملف طفلك الأول للبدء' : isFr ? 'Ajoutez votre premier profil enfant' : 'Add your first child profile to get started';
  const addLabel = isAr ? 'إضافة طفل جديد' : isFr ? 'Ajouter un enfant' : 'Add a child';
  const addAnotherLabel = isAr ? 'إضافة طفل آخر' : isFr ? 'Ajouter un autre enfant' : 'Add another child';
  const startLabel = isAr ? 'ابدأ الآن' : isFr ? 'Commencer' : 'Get Started';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* Hero Header */}
      <div
        className="relative overflow-hidden px-5 pt-12 pb-8"
        style={{
          background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 60%, #B3E5FC 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 8px 32px rgba(79,195,247,0.35)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-20" style={{ background: 'white', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-15" style={{ background: 'white', transform: 'translate(-30%, 40%)' }} />

        <div className="relative z-10 text-center">
          <img
            src={LOGO_URL}
            alt="AlleNest"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-white/60"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
          />
          <div className="space-y-0.5 mb-1">
            {greeting.map((g, i) => (
              <p key={i} className={`font-extrabold text-white leading-tight ${i === 0 ? 'text-2xl' : 'text-xl opacity-90'}`}
                style={{ fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}>
                {g}
              </p>
            ))}
          </div>
          <p className="text-white/80 text-sm mt-2" style={{ fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}>
            {tagline}
          </p>

          {/* Language pills */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[{ code: 'ar', label: 'العربية' }, { code: 'fr', label: 'Français 🇫🇷' }, { code: 'en', label: 'English' }].map(({ code, label }) => (
              <button
                key={code}
                onClick={() => {
                  const ctx = (window as any).__languageContext;
                  if (ctx?.setLanguage) ctx.setLanguage(code);
                  document.documentElement.lang = code;
                  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
                  localStorage.setItem('allenest-language', code);
                  window.location.reload();
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${language === code ? 'bg-white text-sky-600 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-5 max-w-md mx-auto w-full">
        {isLoading ? (
          <div className="space-y-4 mt-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-white rounded-3xl animate-pulse shadow-sm" />
            ))}
          </div>
        ) : childrenData.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center text-center py-8 space-y-5">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #B3E5FC 0%, #F8BBD0 100%)' }}
            >
              <span style={{ fontSize: 60 }}>👶</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-800">{noChildTitle}</h2>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">{noChildSub}</p>
            </div>
            <button
              onClick={() => setLocation('/setup')}
              className="w-full max-w-xs h-14 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%)',
                boxShadow: '0 8px 24px rgba(79,195,247,0.45)',
              }}
            >
              <Plus size={22} />
              {startLabel}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-500 text-center mb-3">{title}</p>

            {/* Children cards */}
            {childrenData.map((c: any) => {
              const child: ChildProfile = {
                id: c.id,
                name: c.name,
                birthDate: c.birthDate ?? '',
                gender: (c.gender as 'boy' | 'girl') ?? 'boy',
                allergies: Array.isArray(c.allergies) ? c.allergies : [],
                photoUrl: c.photoUrl ?? undefined,
              };
              const age = child.birthDate ? getAge(child.birthDate, language) : '';
              const allergyCount = child.allergies.length;
              const isGirl = child.gender === 'girl';

              return (
                <button
                  key={child.id}
                  onClick={() => handleSelect(child)}
                  className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white transition-all active:scale-[0.98] hover:shadow-lg"
                  style={{
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: `2px solid ${isGirl ? '#FCE4EC' : '#E1F5FE'}`,
                  }}
                >
                  <ChildAvatar child={child} size={72} />

                  <div className="flex-1 text-start min-w-0">
                    <h3
                      className="text-lg font-extrabold text-gray-800 truncate"
                      style={{ fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
                    >
                      {child.name}
                    </h3>
                    {age && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        {isAr ? `العمر: ${age}` : isFr ? `Âge : ${age}` : `Age: ${age}`}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {allergyCount > 0 ? (
                        <span
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                          style={{ background: '#FFF3E0', color: '#E65100' }}
                        >
                          ⚠️ {allergyCount} {isAr ? 'حساسية' : isFr ? `allergie${allergyCount > 1 ? 's' : ''}` : `allergen${allergyCount !== 1 ? 's' : ''}`}
                        </span>
                      ) : (
                        <span
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: '#E8F5E9', color: '#2E7D32' }}
                        >
                          <Heart size={10} />
                          {isAr ? 'لا حساسية' : isFr ? 'Aucune allergie' : 'No allergies'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isGirl
                        ? 'linear-gradient(135deg, #F8BBD0, #F48FB1)'
                        : 'linear-gradient(135deg, #B3E5FC, #4FC3F7)',
                    }}
                  >
                    <ChevronRight size={18} color="white" />
                  </div>
                </button>
              );
            })}

            {/* Add another child */}
            <button
              onClick={() => setLocation('/setup')}
              className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white transition-all active:scale-[0.98]"
              style={{
                border: '2px dashed #B3E5FC',
                boxShadow: '0 2px 12px rgba(79,195,247,0.08)',
              }}
            >
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #E1F5FE, #B3E5FC)' }}
              >
                <Plus size={28} color="#0288D1" />
              </div>
              <div className="flex-1 text-start">
                <p className="text-base font-bold text-sky-600">{addLabel}</p>
                <p className="text-xs text-gray-400 mt-0.5">{addAnotherLabel}</p>
              </div>
            </button>

            {/* Signature */}
            <p className="text-center text-xs text-gray-400 italic pt-2 pb-4">
              ✨ {isAr ? 'لأن كل بكاء طفلك له سبب' : isFr ? 'Parce que chaque pleur de votre enfant a une cause' : 'Because every cry of your child has a cause'} ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
