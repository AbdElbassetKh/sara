const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Meals() {
  const { t, language } = useLanguage();
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('fruits');

  const FOOD_CATEGORIES = [
    { key: 'fruits', name: language === 'fr' ? 'Fruits' : language === 'ar' ? 'فواكه' : 'Fruits', emoji: '🍎' },
    { key: 'vegetables', name: language === 'fr' ? 'Légumes' : language === 'ar' ? 'خضروات' : 'Vegetables', emoji: '🥦' },
    { key: 'dairy', name: language === 'fr' ? 'Laitiers' : language === 'ar' ? 'ألبان' : 'Dairy', emoji: '🥛' },
    { key: 'grains', name: language === 'fr' ? 'Céréales' : language === 'ar' ? 'حبوب' : 'Grains', emoji: '🌾' },
    { key: 'protein', name: language === 'fr' ? 'Protéines' : language === 'ar' ? 'بروتين' : 'Protein', emoji: '🍗' },
    { key: 'other', name: language === 'fr' ? 'Autre' : language === 'ar' ? 'أخرى' : 'Other', emoji: '🍽️' },
  ];

  const FOODS = [
    { name: language === 'fr' ? 'Pomme' : language === 'ar' ? 'تفاح' : 'Apple', category: 'fruits', emoji: '🍎' },
    { name: language === 'fr' ? 'Banane' : language === 'ar' ? 'موز' : 'Banana', category: 'fruits', emoji: '🍌' },
    { name: language === 'fr' ? 'Fraise' : language === 'ar' ? 'فراولة' : 'Strawberry', category: 'fruits', emoji: '🍓' },
    { name: language === 'fr' ? 'Brocoli' : language === 'ar' ? 'بروكلي' : 'Broccoli', category: 'vegetables', emoji: '🥦' },
    { name: language === 'fr' ? 'Carotte' : language === 'ar' ? 'جزر' : 'Carrot', category: 'vegetables', emoji: '🥕' },
    { name: language === 'fr' ? 'Lait' : language === 'ar' ? 'حليب' : 'Milk', category: 'dairy', emoji: '🥛' },
    { name: language === 'fr' ? 'Fromage' : language === 'ar' ? 'جبن' : 'Cheese', category: 'dairy', emoji: '🧀' },
    { name: language === 'fr' ? 'Pain' : language === 'ar' ? 'خبز' : 'Bread', category: 'grains', emoji: '🍞' },
    { name: language === 'fr' ? 'Riz' : language === 'ar' ? 'أرز' : 'Rice', category: 'grains', emoji: '🍚' },
    { name: language === 'fr' ? 'Poulet' : language === 'ar' ? 'دجاج' : 'Chicken', category: 'protein', emoji: '🍗' },
    { name: language === 'fr' ? 'Poisson' : language === 'ar' ? 'سمك' : 'Fish', category: 'protein', emoji: '🐟' },
    { name: language === 'fr' ? 'Œuf' : language === 'ar' ? 'بيض' : 'Egg', category: 'protein', emoji: '🥚' },
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

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="page-header-gradient px-4 pt-10 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-white">{t('mealJournal')}</h1>
            <p className="text-sm text-white/80 mt-1">
              {language === 'fr' ? "Sélectionnez les ingrédients du repas de votre enfant" : language === 'ar' ? 'اختر مكونات وجبة طفلك' : "Select ingredients from your child's meal"}
            </p>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-700">
              {language === 'fr' ? 'Analyse IA active' : language === 'ar' ? 'تحليل الذكاء الاصطناعي نشط' : 'AI Analysis Active'}
            </p>
            <p className="text-xs text-blue-500 mt-0.5">
              {language === 'fr' ? "Nous analyserons les allergènes potentiels" : language === 'ar' ? 'سنحلل مسببات الحساسية المحتملة' : "We'll analyze for potential allergens"}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={language === 'fr' ? 'Rechercher des aliments...' : language === 'ar' ? 'البحث عن الأطعمة...' : 'Search foods...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-3">
            {FOOD_CATEGORIES.slice(0, 3).map((cat) => (
              <TabsTrigger key={cat.key} value={cat.key} className="text-xs">
                {cat.emoji} {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid w-full grid-cols-3 mt-2">
            {FOOD_CATEGORIES.slice(3).map((cat) => (
              <TabsTrigger key={cat.key} value={cat.key} className="text-xs">
                {cat.emoji} {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {FOOD_CATEGORIES.map((cat) => (
            <TabsContent key={cat.key} value={cat.key} className="space-y-4 mt-3">
              <div className="grid grid-cols-2 gap-3">
                {filteredFoods.map((food) => (
                  <Card
                    key={food.name}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      selectedFoods.includes(food.name)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleFood(food.name)}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-3xl">{food.emoji}</div>
                      <p className="text-sm font-medium text-foreground">{food.name}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Selected Foods */}
        {selectedFoods.length > 0 && (
          <Card className="p-4 space-y-3 shadow-sm">
            <Label className="text-sm font-medium text-foreground">
              {language === 'fr' ? `Aliments sélectionnés (${selectedFoods.length})` : language === 'ar' ? `الأطعمة المختارة (${selectedFoods.length})` : `Selected Foods (${selectedFoods.length})`}
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedFoods.map((food) => (
                <div
                  key={food}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {food}
                  <button
                    onClick={() => toggleFood(food)}
                    className="text-primary/60 hover:text-primary"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          disabled={selectedFoods.length === 0}
          className="w-full h-12 text-base font-semibold gap-2 rounded-xl"
        >
          <Plus size={18} />
          {t('addMeal')}
        </Button>
      </div>
    </div>
  );
}
