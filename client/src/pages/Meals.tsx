import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Search, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Meals() {
  const { t, language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('fruits');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const utils = trpc.useUtils();
  const addMeal = trpc.meals.create.useMutation({
    onSuccess: () => {
      toast.success(
        isAr ? 'تم تسجيل الوجبة ✅' : isFr ? 'Repas enregistré ✅' : 'Meal saved ✅',
        {
          description: isAr ? 'تحليل الذكاء الاصطناعي جاهز' : isFr ? 'Analyse IA disponible' : 'AI analysis ready',
        }
      );
      setSelectedFoods([]);
      utils.meals.list.invalidate();
    },
    onError: (err) => {
      toast.error(isAr ? 'خطأ في التسجيل' : isFr ? 'Erreur d\'enregistrement' : 'Save error', {
        description: err.message,
      });
    },
  });

  const FOOD_CATEGORIES = [
    { key: 'fruits', name: isFr ? 'Fruits' : isAr ? 'فواكه' : 'Fruits', emoji: '🍎' },
    { key: 'vegetables', name: isFr ? 'Légumes' : isAr ? 'خضروات' : 'Vegetables', emoji: '🥦' },
    { key: 'dairy', name: isFr ? 'Laitiers' : isAr ? 'ألبان' : 'Dairy', emoji: '🥛' },
    { key: 'grains', name: isFr ? 'Céréales' : isAr ? 'حبوب' : 'Grains', emoji: '🌾' },
    { key: 'protein', name: isFr ? 'Protéines' : isAr ? 'بروتين' : 'Protein', emoji: '🍗' },
    { key: 'other', name: isFr ? 'Autre' : isAr ? 'أخرى' : 'Other', emoji: '🍽️' },
  ];

  const FOODS = [
    { name: isFr ? 'Pomme' : isAr ? 'تفاح' : 'Apple', category: 'fruits', emoji: '🍎' },
    { name: isFr ? 'Banane' : isAr ? 'موز' : 'Banana', category: 'fruits', emoji: '🍌' },
    { name: isFr ? 'Fraise' : isAr ? 'فراولة' : 'Strawberry', category: 'fruits', emoji: '🍓' },
    { name: isFr ? 'Brocoli' : isAr ? 'بروكلي' : 'Broccoli', category: 'vegetables', emoji: '🥦' },
    { name: isFr ? 'Carotte' : isAr ? 'جزر' : 'Carrot', category: 'vegetables', emoji: '🥕' },
    { name: isFr ? 'Épinards' : isAr ? 'سبانخ' : 'Spinach', category: 'vegetables', emoji: '🥬' },
    { name: isFr ? 'Lait' : isAr ? 'حليب' : 'Milk', category: 'dairy', emoji: '🥛' },
    { name: isFr ? 'Fromage' : isAr ? 'جبن' : 'Cheese', category: 'dairy', emoji: '🧀' },
    { name: isFr ? 'Yaourt' : isAr ? 'زبادي' : 'Yogurt', category: 'dairy', emoji: '🍶' },
    { name: isFr ? 'Pain' : isAr ? 'خبز' : 'Bread', category: 'grains', emoji: '🍞' },
    { name: isFr ? 'Riz' : isAr ? 'أرز' : 'Rice', category: 'grains', emoji: '🍚' },
    { name: isFr ? 'Pâtes' : isAr ? 'معكرونة' : 'Pasta', category: 'grains', emoji: '🍝' },
    { name: isFr ? 'Poulet' : isAr ? 'دجاج' : 'Chicken', category: 'protein', emoji: '🍗' },
    { name: isFr ? 'Poisson' : isAr ? 'سمك' : 'Fish', category: 'protein', emoji: '🐟' },
    { name: isFr ? 'Œuf' : isAr ? 'بيض' : 'Egg', category: 'protein', emoji: '🥚' },
    { name: isFr ? 'Lentilles' : isAr ? 'عدس' : 'Lentils', category: 'protein', emoji: '🫘' },
    { name: isFr ? 'Eau' : isAr ? 'ماء' : 'Water', category: 'other', emoji: '💧' },
    { name: isFr ? 'Jus' : isAr ? 'عصير' : 'Juice', category: 'other', emoji: '🧃' },
  ];

  const MEAL_TYPES = [
    { key: 'breakfast', label: isFr ? 'Petit-déj' : isAr ? 'إفطار' : 'Breakfast', emoji: '🌅' },
    { key: 'lunch', label: isFr ? 'Déjeuner' : isAr ? 'غداء' : 'Lunch', emoji: '☀️' },
    { key: 'dinner', label: isFr ? 'Dîner' : isAr ? 'عشاء' : 'Dinner', emoji: '🌙' },
    { key: 'snack', label: isFr ? 'Collation' : isAr ? 'وجبة خفيفة' : 'Snack', emoji: '🍪' },
  ];

  const filteredFoods = FOODS.filter(
    (food) =>
      food.category === activeCategory &&
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFood = (foodName: string) => {
    setSelectedFoods((prev) =>
      prev.includes(foodName) ? prev.filter((f) => f !== foodName) : [...prev, foodName]
    );
  };

  const handleSubmit = () => {
    if (!selectedChild) {
      toast.error(isAr ? 'يرجى اختيار طفل أولاً' : isFr ? 'Veuillez sélectionner un enfant' : 'Please select a child first');
      return;
    }
    if (selectedFoods.length === 0) return;
    addMeal.mutate({
      childId: selectedChild.id,
      foodName: selectedFoods[0] || 'Mixed meal',
      ingredients: selectedFoods,
      notes: mealType,
    });
  };

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
            {isFr ? "Sélectionnez les ingrédients du repas de votre enfant" : isAr ? 'اختر مكونات وجبة طفلك' : "Select ingredients from your child's meal"}
          </p>
          {/* Meal Type Selector */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {MEAL_TYPES.map((mt) => (
              <button
                key={mt.key}
                onClick={() => setMealType(mt.key as typeof mealType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  mealType === mt.key
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'bg-white/20 text-white'
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
                {isFr ? "Nous analyserons les allergènes potentiels" : isAr ? 'سنحلل مسببات الحساسية المحتملة' : "We'll analyze for potential allergens"}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={isFr ? 'Rechercher des aliments...' : isAr ? 'البحث عن الأطعمة...' : 'Search foods...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-2xl bg-white border-gray-200"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-white shadow-sm">
              {FOOD_CATEGORIES.slice(0, 3).map((cat) => (
                <TabsTrigger key={cat.key} value={cat.key} className="text-xs rounded-xl">
                  {cat.emoji} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid w-full grid-cols-3 mt-2 rounded-2xl bg-white shadow-sm">
              {FOOD_CATEGORIES.slice(3).map((cat) => (
                <TabsTrigger key={cat.key} value={cat.key} className="text-xs rounded-xl">
                  {cat.emoji} {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {FOOD_CATEGORIES.map((cat) => (
              <TabsContent key={cat.key} value={cat.key} className="space-y-4 mt-3">
                <div className="grid grid-cols-3 gap-2">
                  {filteredFoods.map((food) => {
                    const isSelected = selectedFoods.includes(food.name);
                    return (
                      <button
                        key={food.name}
                        onClick={() => toggleFood(food.name)}
                        className={`p-3 rounded-2xl text-center transition-all border-2 bg-white ${
                          isSelected
                            ? 'border-blue-400 bg-blue-50 shadow-md'
                            : 'border-gray-100 hover:border-blue-200'
                        }`}
                      >
                        <div className="text-2xl mb-1">{food.emoji}</div>
                        <p className="text-xs font-medium text-gray-700 leading-tight">{food.name}</p>
                        {isSelected && <CheckCircle size={12} className="text-blue-500 mx-auto mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

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
                    <button
                      onClick={() => toggleFood(food)}
                      className="text-blue-400 hover:text-blue-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <button
            disabled={selectedFoods.length === 0 || addMeal.isPending}
            onClick={handleSubmit}
            className="w-full h-14 text-white text-base font-bold rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%)',
              boxShadow: '0 8px 24px rgba(79,195,247,0.45)',
            }}
          >
            {addMeal.isPending ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            {addMeal.isPending
              ? (isAr ? 'جاري التسجيل...' : isFr ? 'Enregistrement...' : 'Saving...')
              : (isAr ? 'تسجيل الوجبة' : isFr ? 'Enregistrer le repas' : 'Save Meal')}
          </button>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
            <span className="text-amber-500 text-sm">⚠️</span>
            <p className="text-xs text-amber-700">
              {isFr ? 'Cette application est une aide, pas un remplacement d\'un avis médical.' : isAr ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية.' : 'This app is a guide, not a replacement for medical advice.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
