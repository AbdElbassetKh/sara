const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ALLERGEN_LIST, FEEDING_TYPES, GENDER_OPTIONS } from '@/const';
import { Upload, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChildProfileSetup() {
  const { t, language } = useLanguage();
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
    setIsLoading(true);
    console.log('Form data:', formData);
    setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="pt-2 space-y-1">
          <h1 className="text-2xl font-bold text-foreground">{t('createProfile')}</h1>
          <p className="text-sm text-muted-foreground">
            {language === 'fr' ? "Aidez-nous à mieux connaître votre enfant" : language === 'ar' ? 'ساعدنا على التعرف على طفلك بشكل أفضل' : "Help us know your child better"}
          </p>
        </div>

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

            <div className="space-y-1.5">
              <Label htmlFor="birthDate" className="text-sm font-semibold">{t('birthDate')} *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                required
              />
            </div>

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
          <Button
            type="submit"
            disabled={!formData.name || !formData.birthDate || !formData.gender || isLoading}
            className="w-full h-12 text-base font-semibold gap-2 rounded-xl"
          >
            {isLoading ? t('saving') : t('saveProfile')}
            {!isLoading && <ArrowRight size={18} />}
          </Button>
        </form>
      </div>
    </div>
  );
}
