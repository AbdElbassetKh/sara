import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import type { ChildProfile } from '@/contexts/AppContext';
import { Baby, Plus, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

function ChildAvatar({ child, size = 'lg' }: { child: ChildProfile; size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 'w-24 h-24' : 'w-16 h-16';
  const textSize = size === 'lg' ? 'text-3xl' : 'text-xl';
  const bg = child.gender === 'girl' ? 'from-pink-400 to-rose-400' : 'from-sky-400 to-blue-500';

  if (child.photoUrl) {
    return (
      <img
        src={child.photoUrl}
        alt={child.name}
        className={`${dim} rounded-full object-cover border-4 border-white shadow-lg`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br ${bg} flex items-center justify-center border-4 border-white shadow-lg`}>
      <span className={textSize}>{child.gender === 'girl' ? '👧' : '👦'}</span>
    </div>
  );
}

export default function ChildSelector() {
  const { language } = useLanguage();
  const { setSelectedChild, setChildren } = useAppContext();
  const [, setLocation] = useLocation();

  const { data: childrenData = [], isLoading } = trpc.children.list.useQuery();

  // Sync children list into AppContext
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

  const handleAddChild = () => {
    setLocation('/setup');
  };

  const title = language === 'ar' ? 'مرحباً بك في AlleNest' : language === 'fr' ? 'Bienvenue sur AlleNest' : 'Welcome to AlleNest';
  const subtitle = language === 'ar' ? 'اختر طفلك للمتابعة' : language === 'fr' ? 'Choisissez votre enfant pour continuer' : 'Choose your child to continue';
  const noChildTitle = language === 'ar' ? 'لا يوجد ملف طفل بعد' : language === 'fr' ? 'Aucun profil enfant' : 'No child profile yet';
  const noChildSub = language === 'ar' ? 'أضف ملف طفلك الأول للبدء' : language === 'fr' ? 'Ajoutez votre premier profil enfant pour commencer' : 'Add your first child profile to get started';
  const addLabel = language === 'ar' ? 'إضافة طفل جديد' : language === 'fr' ? 'Ajouter un enfant' : 'Add a child';
  const selectLabel = language === 'ar' ? 'اختر' : language === 'fr' ? 'Choisir' : 'Select';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 flex flex-col">
      {/* Header */}
      <div className="page-header-gradient px-6 pt-14 pb-10 text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <img
          src={LOGO_URL}
          alt="AlleNest"
          className="w-20 h-20 rounded-full object-cover border-4 border-white/60 shadow-xl mx-auto mb-4"
        />
        <h1 className="text-2xl font-extrabold text-white mb-1">{title}</h1>
        <p className="text-white/80 text-sm font-medium">
          {language === 'ar' ? '✨ لأن كل بكاء طفلك له سبب' : language === 'fr' ? '✨ Parce que chaque pleur de votre enfant a une cause' : '✨ Because every cry of your child has a cause'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
        {isLoading ? (
          <div className="space-y-4 mt-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-white rounded-3xl animate-pulse shadow-sm" />
            ))}
          </div>
        ) : childrenData.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-5">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-sky-100 to-pink-100 flex items-center justify-center shadow-inner">
              <Baby className="w-14 h-14 text-sky-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{noChildTitle}</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">{noChildSub}</p>
            </div>
            <Button
              onClick={handleAddChild}
              className="w-full max-w-xs h-14 bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 text-white font-bold text-base rounded-2xl shadow-lg flex items-center gap-3"
            >
              <Plus className="w-6 h-6" />
              {addLabel}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-muted-foreground text-center mb-2">{subtitle}</p>

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
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl bg-white shadow-md border-2 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] ${isGirl ? 'border-pink-100 hover:border-pink-300' : 'border-sky-100 hover:border-sky-300'}`}
                >
                  {/* Avatar */}
                  <ChildAvatar child={child} size="lg" />

                  {/* Info */}
                  <div className="flex-1 text-start min-w-0">
                    <h3 className="text-xl font-extrabold text-foreground truncate">{child.name}</h3>
                    {age && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {language === 'ar' ? `العمر: ${age}` : language === 'fr' ? `Âge : ${age}` : `Age: ${age}`}
                      </p>
                    )}
                    {allergyCount > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                          {allergyCount} {language === 'ar' ? 'حساسية' : language === 'fr' ? `allergie${allergyCount > 1 ? 's' : ''}` : `allergen${allergyCount !== 1 ? 's' : ''}`}
                        </span>
                      </div>
                    )}
                    {allergyCount === 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Heart className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">
                          {language === 'ar' ? 'لا حساسية مسجلة' : language === 'fr' ? 'Aucune allergie' : 'No allergies'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${isGirl ? 'bg-pink-100' : 'bg-sky-100'}`}>
                    <ChevronRight className={`w-5 h-5 ${isGirl ? 'text-pink-500' : 'text-sky-500'}`} />
                  </div>
                </button>
              );
            })}

            {/* Add another child */}
            <button
              onClick={handleAddChild}
              className="w-full flex items-center gap-4 p-4 rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary font-semibold transition-all hover:border-primary/50 hover:bg-primary/10"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Plus className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 text-start">
                <p className="text-base font-bold">{addLabel}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {language === 'ar' ? 'أضف ملف طفل آخر' : language === 'fr' ? 'Ajouter un autre profil' : 'Add another profile'}
                </p>
              </div>
            </button>

            {/* Signature */}
            <div className="text-center pt-2 pb-4">
              <p className="text-xs text-muted-foreground/60 italic flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                {language === 'ar' ? 'لأن كل بكاء طفلك له سبب' : language === 'fr' ? 'Parce que chaque pleur de votre enfant a une cause' : 'Because every cry of your child has a cause'}
                <Sparkles className="w-3 h-3" />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
