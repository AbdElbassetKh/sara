import { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Plus, Search, CheckCircle, Camera, X, Loader2, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Meals() {
  const { t, language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const utils = trpc.useUtils();

  // Load categories from DB
  const { data: categories = [] } = trpc.foodCatalog.listCategories.useQuery();

  // Load items for active category (or all if searching)
  const { data: allItems = [] } = trpc.foodCatalog.listItems.useQuery(
    { categoryId: searchQuery ? undefined : (activeCategoryId ?? undefined) },
    { enabled: true }
  );

  // Set first category as default once loaded
  if (categories.length > 0 && activeCategoryId === null) {
    setActiveCategoryId(categories[0].id);
  }

  const filteredItems = allItems.filter((item) => {
    const name = isAr ? item.nameAr : isFr ? item.nameFr : item.nameEn;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const addMeal = trpc.meals.create.useMutation({
    onSuccess: () => {
      toast.success(
        isAr ? 'تم تسجيل الوجبة ✅' : isFr ? 'Repas enregistré ✅' : 'Meal saved ✅',
        { description: isAr ? 'تحليل الذكاء الاصطناعي جاهز' : isFr ? 'Analyse IA disponible' : 'AI analysis ready' }
      );
      setSelectedFoods([]);
      setPhotoPreview(null);
      setPhotoFile(null);
      utils.meals.list.invalidate();
    },
    onError: (err) => {
      toast.error(isAr ? 'خطأ في التسجيل' : isFr ? "Erreur d'enregistrement" : 'Save error', {
        description: err.message,
      });
    },
  });

  const uploadPhoto = trpc.children.uploadPhoto.useMutation();

  const MEAL_TYPES = [
    { key: 'breakfast', label: isFr ? 'Petit-déj' : isAr ? 'إفطار' : 'Breakfast', emoji: '🌅' },
    { key: 'lunch', label: isFr ? 'Déjeuner' : isAr ? 'غداء' : 'Lunch', emoji: '☀️' },
    { key: 'dinner', label: isFr ? 'Dîner' : isAr ? 'عشاء' : 'Dinner', emoji: '🌙' },
    { key: 'snack', label: isFr ? 'Collation' : isAr ? 'وجبة خفيفة' : 'Snack', emoji: '🍪' },
  ];

  const getItemName = (item: { nameAr: string; nameFr: string; nameEn: string }) =>
    isAr ? item.nameAr : isFr ? item.nameFr : item.nameEn;

  const toggleFood = (foodName: string) => {
    setSelectedFoods((prev) =>
      prev.includes(foodName) ? prev.filter((f) => f !== foodName) : [...prev, foodName]
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(isAr ? 'حجم الصورة يجب أن يكون أقل من 5 ميغابايت' : isFr ? 'La photo doit faire moins de 5 Mo' : 'Photo must be under 5 MB');
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedChild) {
      toast.error(isAr ? 'يرجى اختيار طفل أولاً' : isFr ? 'Veuillez sélectionner un enfant' : 'Please select a child first');
      return;
    }
    if (selectedFoods.length === 0) {
      toast.error(isAr ? 'يرجى اختيار وجبة واحدة على الأقل' : isFr ? 'Veuillez sélectionner au moins un aliment' : 'Please select at least one food');
      return;
    }

    let photoUrl: string | undefined;

    // Upload photo if selected
    if (photoFile && photoPreview) {
      setIsUploadingPhoto(true);
      try {
        // Strip the data:image/...;base64, prefix if present
        const base64Data = photoPreview.includes(',') ? photoPreview.split(',')[1] : photoPreview;
        const result = await uploadPhoto.mutateAsync({
          childId: selectedChild.id,
          base64Data,
        });
        photoUrl = result.photoUrl ?? undefined;
      } catch {
        toast.error(isAr ? 'فشل رفع الصورة' : isFr ? "Échec de l'upload photo" : 'Photo upload failed');
      } finally {
        setIsUploadingPhoto(false);
      }
    }

    addMeal.mutate({
      childId: selectedChild.id,
      foodName: selectedFoods[0] || 'Mixed meal',
      ingredients: selectedFoods,
      notes: mealType,
      photoUrl,
    });
  };

  const isLoading = addMeal.isPending || isUploadingPhoto;

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden" style={{ background: '#F9FAFB' }}>
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div
          className="px-5 pt-12 pb-6 rounded-b-3xl"
          style={{ background: 'linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%)' }}
        >
          <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: isAr ? 'Tajawal, sans-serif' : 'Poppins, sans-serif' }}>
            {isFr ? 'Journal des Repas' : isAr ? 'سجل الوجبات' : 'Meal Journal'}
          </h1>
          <p className="text-sm text-white/80 mt-1">
            {isFr ? 'Sélectionnez les ingrédients du repas de votre enfant' : isAr ? 'اختر مكونات وجبة طفلك' : "Select ingredients from your child's meal"}
          </p>
          {/* Meal Type Selector */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {MEAL_TYPES.map((mt) => (
              <button
                key={mt.key}
                onClick={() => setMealType(mt.key as typeof mealType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  mealType === mt.key ? 'bg-white text-blue-600 shadow-md' : 'bg-white/20 text-white'
                }`}
              >
                {mt.emoji} {mt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 space-y-4">
          {/* AI Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-700">
                {isFr ? 'Analyse IA active' : isAr ? 'تحليل الذكاء الاصطناعي نشط' : 'AI Analysis Active'}
              </p>
              <p className="text-xs text-blue-500 mt-0.5">
                {isFr ? 'Nous analyserons les allergènes potentiels' : isAr ? 'سنحلل مسببات الحساسية المحتملة' : "We'll analyze for potential allergens"}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={isFr ? 'Rechercher des aliments...' : isAr ? 'البحث عن الأطعمة...' : 'Search foods...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-2xl bg-white border-gray-200"
            />
          </div>

          {/* Category Tabs */}
          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border-2 ${
                    activeCategoryId === cat.id
                      ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-100 bg-white text-gray-600'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isAr ? cat.nameAr : isFr ? cat.nameFr : cat.nameEn}</span>
                </button>
              ))}
            </div>
          )}

          {/* Food Grid */}
          <div className="grid grid-cols-3 gap-2">
            {filteredItems.length === 0 ? (
              <div className="col-span-3 py-8 text-center text-gray-400">
                <p className="text-sm">{isFr ? 'Aucun aliment trouvé' : isAr ? 'لا توجد أطعمة' : 'No foods found'}</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const name = getItemName(item);
                const isSelected = selectedFoods.includes(name);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleFood(name)}
                    className={`p-3 rounded-2xl text-center transition-all border-2 bg-white relative ${
                      isSelected ? 'border-blue-400 bg-blue-50 shadow-md' : 'border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    {item.isCommonAllergen === 1 && (
                      <span className="absolute top-1 right-1 text-[8px] bg-amber-100 text-amber-600 rounded-full px-1 font-bold">⚠️</span>
                    )}
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-xs font-medium text-gray-700 leading-tight">{name}</p>
                    {isSelected && <CheckCircle size={12} className="text-blue-500 mx-auto mt-1" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Selected Foods */}
          {selectedFoods.length > 0 && (
            <Card className="p-4 space-y-3 shadow-sm rounded-2xl bg-white">
              <Label className="text-sm font-semibold text-gray-700">
                {isFr ? `Aliments sélectionnés (${selectedFoods.length})` : isAr ? `الأطعمة المختارة (${selectedFoods.length})` : `Selected Foods (${selectedFoods.length})`}
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedFoods.map((food) => (
                  <div
                    key={food}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {food}
                    <button onClick={() => toggleFood(food)} className="text-blue-400 hover:text-blue-600 font-bold">×</button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Photo Upload */}
          <Card className="p-4 rounded-2xl bg-white shadow-sm">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              {isFr ? 'Photo du repas (optionnel)' : isAr ? 'صورة الوجبة (اختياري)' : 'Meal photo (optional)'}
            </Label>
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="meal" className="w-full h-40 object-cover rounded-xl" />
                <button
                  onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-all"
              >
                <Camera size={24} />
                <span className="text-xs font-medium">
                  {isFr ? 'Prendre une photo ou choisir depuis la galerie' : isAr ? 'التقاط صورة أو اختيار من المعرض' : 'Take a photo or choose from gallery'}
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </Card>

          {/* Submit Button */}
          <button
            disabled={selectedFoods.length === 0 || isLoading}
            onClick={handleSubmit}
            className="w-full h-14 text-white text-base font-bold rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%)',
              boxShadow: '0 8px 24px rgba(79,195,247,0.45)',
            }}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            {isUploadingPhoto
              ? (isAr ? 'جاري رفع الصورة...' : isFr ? 'Upload photo...' : 'Uploading photo...')
              : addMeal.isPending
              ? (isAr ? 'جاري التسجيل...' : isFr ? 'Enregistrement...' : 'Saving...')
              : (isAr ? 'تسجيل الوجبة' : isFr ? 'Enregistrer le repas' : 'Save Meal')}
          </button>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
            <span className="text-amber-500 text-sm">⚠️</span>
            <p className="text-xs text-amber-700">
              {isFr ? "Cette application est une aide, pas un remplacement d'un avis médical." : isAr ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية.' : 'This app is a guide, not a replacement for medical advice.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
