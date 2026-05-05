import { useState } from 'react';
import DatePicker from '@/components/DatePicker';
import { trpc } from '@/lib/trpc';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ALLERGEN_LIST, FEEDING_TYPES, GENDER_OPTIONS } from '@/const';
import { Upload, ArrowRight, ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';

const BABY_HERO_IMG = '/manus-storage/baby-hero_463105f2.png';

export default function ChildProfileSetup() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '',
    feedingType: '',
    allergies: [] as string[],
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedChild } = useAppContext();

  const createChild = trpc.children.create.useMutation({
    onSuccess: (newChild) => {
      setSelectedChild({
        id: newChild.id,
        name: newChild.name,
        birthDate: newChild.birthDate ? new Date(newChild.birthDate).toISOString().split('T')[0] : '',
        gender: (newChild.gender as 'boy' | 'girl') ?? 'boy',
        allergies: Array.isArray(newChild.allergies) ? newChild.allergies : [],
        photoUrl: newChild.photoUrl ?? undefined,
      });
      toast.success(isAr ? 'تم الحفظ بنجاح! ✅' : isFr ? 'Profil enregistré ! ✅' : 'Profile saved! ✅', {
        description: isAr ? `تم إنشاء ملف ${newChild.name}` : isFr ? `Profil de ${newChild.name} créé` : `${newChild.name}'s profile created`,
      });
      setLocation('/');
    },
    onError: (err) => {
      toast.error(isAr ? 'خطأ في الحفظ' : isFr ? 'Erreur d\'enregistrement' : 'Save error', {
        description: err.message,
      });
      setIsLoading(false);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllergyToggle = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergen)
        ? prev.allergies.filter((a) => a !== allergen)
        : [...prev.allergies, allergen],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate || !formData.gender) return;
    setIsLoading(true);
    createChild.mutate({
      name: formData.name,
      birthDate: formData.birthDate,
      gender: formData.gender as 'boy' | 'girl',
      feedingType: formData.feedingType as 'breast' | 'formula' | 'mixed' | 'solids' | undefined || undefined,
      allergies: formData.allergies,
      emergencyContact: formData.emergencyContactName
        ? { name: formData.emergencyContactName, phone: formData.emergencyContactPhone }
        : undefined,
      photoUrl: photoPreview ?? undefined,
    });
  };

  const getGenderLabel = (option: string) => {
    if (option === 'boy') return t('boy');
    if (option === 'girl') return t('girl');
    return option;
  };

  const getFeedingLabel = (option: string) => {
    const map: Record<string, string> = {
      breast: t('breast'),
      formula: t('formula'),
      mixed: t('mixed'),
      solids: t('solids'),
    };
    return map[option] || option;
  };

  const getAllergenLabel = (allergen: string) => {
    const map: Record<string, string> = {
      milk: t('milk'),
      egg: t('egg'),
      peanuts: t('peanuts'),
      wheat: t('wheat'),
      fish: t('fish'),
      soy: t('soy'),
      berries: t('berries'),
      shellfish: t('shellfish'),
      tree_nuts: t('tree_nuts'),
      sesame: t('sesame'),
    };
    return map[allergen] || allergen;
  };

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: '#F0F7FF', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Hero Header */}
      <div
        className="relative overflow-hidden flex items-end justify-between px-5 pt-10 pb-0"
        style={{
          background: 'linear-gradient(135deg, #F8BBD0 0%, #F48FB1 50%, #4FC3F7 100%)',
          borderBottomLeftRadius: '40px',
          borderBottomRightRadius: '40px',
          boxShadow: '0 12px 40px rgba(244,143,177,0.35)',
          minHeight: '200px',
        }}
      >
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 pointer-events-none" style={{ background: 'white', transform: 'translate(35%, -35%)' }} />
        <div className="absolute top-0 left-0 w-28 h-28 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(-25%, -25%)' }} />

        {/* Back button */}
        <button
          onClick={() => setLocation('/child-select')}
          className="absolute top-5 left-5 w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <ChevronLeft size={20} color="white" />
        </button>

        {/* Text */}
        <div className="relative z-10 pb-5 flex-1">
          <h1
            className="text-2xl font-black text-white leading-tight"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            {isAr ? 'معلومات طفلي' : isFr ? 'Profil de mon enfant' : 'My Child\'s Profile'}
          </h1>
          <p className="text-white/85 text-sm font-medium mt-1">
            {isAr ? 'ساعدنا على التعرف على طفلك' : isFr ? 'Aidez-nous à connaître votre enfant' : 'Help us know your child better'}
          </p>
          <p className="text-white/70 text-xs font-medium italic mt-1">
            ✨ {isAr ? 'لأن كل بكاء طفلك له سبب' : isFr ? 'Parce que chaque pleur a une cause' : 'Because every cry has a cause'} ✨
          </p>
        </div>

        {/* Baby illustration */}
        <div className="relative z-10 flex-shrink-0" style={{ height: '160px', width: '130px' }}>
          <img
            src={BABY_HERO_IMG}
            alt="Baby"
            className="absolute bottom-0 right-0 object-contain"
            style={{ height: '155px', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.12))' }}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-4">

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Upload */}
          <Card className="p-5 space-y-4 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors shadow-sm">
            <Label className="text-sm font-semibold">
              {language === 'fr' ? 'Photo de l\'enfant (optionnel)' : language === 'ar' ? 'صورة الطفل (اختياري)' : 'Child Photo (Optional)'}
            </Label>
            <div className="flex flex-col items-center gap-4">
              {photoPreview ? (
                <img src={photoPreview} alt="Child" className="w-24 h-24 rounded-full object-cover border-4 border-primary/20" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload size={32} className="text-primary/50" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
              <label htmlFor="photo-upload">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>{t('addPhoto')}</span>
                </Button>
              </label>
            </div>
          </Card>

          {/* Basic Info */}
          <Card className="p-5 space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-semibold">{t('childName')} *</Label>
              <Input
                id="name"
                placeholder={language === 'fr' ? 'ex. Emma' : language === 'ar' ? 'مثال: أحمد' : 'e.g., Emma'}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <DatePicker
              label={`${t('birthDate')} *`}
              value={formData.birthDate}
              onChange={(v) => handleInputChange('birthDate', v)}
              maxYear={new Date().getFullYear()}
            />

            <div className="space-y-1.5">
              <Label htmlFor="gender" className="text-sm font-semibold">{t('gender')} *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder={t('selectGender')} />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {getGenderLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feedingType" className="text-sm font-semibold">{t('feedingType')}</Label>
              <Select value={formData.feedingType} onValueChange={(value) => handleInputChange('feedingType', value)}>
                <SelectTrigger id="feedingType">
                  <SelectValue placeholder={t('selectFeedingType')} />
                </SelectTrigger>
                <SelectContent>
                  {FEEDING_TYPES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {getFeedingLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Allergies */}
          <Card className="p-5 space-y-4 shadow-sm">
            <Label className="text-sm font-semibold">{t('knownAllergies')}</Label>
            <div className="grid grid-cols-2 gap-3">
              {ALLERGEN_LIST.map((allergen) => (
                <div key={allergen} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergen}
                    checked={formData.allergies.includes(allergen)}
                    onCheckedChange={() => handleAllergyToggle(allergen)}
                  />
                  <Label htmlFor={allergen} className="text-sm cursor-pointer font-normal">
                    {getAllergenLabel(allergen)}
                  </Label>
                </div>
              ))}
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="p-5 space-y-3 shadow-sm">
            <Label className="text-sm font-semibold">{t('emergencyContact')}</Label>
            <Input
              placeholder={t('contactName')}
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
            />
            <Input
              placeholder={t('contactPhone')}
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
            />
          </Card>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.name || !formData.birthDate || !formData.gender || isLoading}
            className="w-full h-14 text-white text-base font-bold rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%)',
              boxShadow: '0 8px 24px rgba(79,195,247,0.45)',
            }}
          >
            {isLoading ? (isAr ? 'جاري الحفظ...' : isFr ? 'Enregistrement...' : 'Saving...') : (isAr ? 'حفظ ومتابعة' : isFr ? 'Enregistrer le profil' : 'Save Profile')}
            {!isLoading && <ArrowRight size={20} />}
          </button>

          {/* Footer Signature */}
          <div className="text-center pb-2">
            <p className="text-[11px] font-medium italic text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-pink-500">
              ✨ {language === 'ar' ? 'لأن كل بكاء طفلك له سبب' : language === 'fr' ? 'Parce que chaque pleur de votre enfant a une cause' : 'Because every cry of your child has a cause'} ✨
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
