import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Search } from 'lucide-react';

const FOOD_CATEGORIES = [
  { name: 'Fruits', emoji: '🍎' },
  { name: 'Vegetables', emoji: '🥦' },
  { name: 'Dairy', emoji: '🥛' },
  { name: 'Grains', emoji: '🌾' },
  { name: 'Protein', emoji: '🍗' },
  { name: 'Other', emoji: '🍽️' },
];

const FOODS = [
  { name: 'Apple', category: 'Fruits', emoji: '🍎' },
  { name: 'Banana', category: 'Fruits', emoji: '🍌' },
  { name: 'Strawberry', category: 'Fruits', emoji: '🍓' },
  { name: 'Broccoli', category: 'Vegetables', emoji: '🥦' },
  { name: 'Carrot', category: 'Vegetables', emoji: '🥕' },
  { name: 'Milk', category: 'Dairy', emoji: '🥛' },
  { name: 'Cheese', category: 'Dairy', emoji: '🧀' },
  { name: 'Bread', category: 'Grains', emoji: '🍞' },
  { name: 'Rice', category: 'Grains', emoji: '🍚' },
  { name: 'Chicken', category: 'Protein', emoji: '🍗' },
  { name: 'Fish', category: 'Protein', emoji: '🐟' },
  { name: 'Egg', category: 'Protein', emoji: '🥚' },
];

export default function Meals() {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Fruits');

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
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Track Meal</h1>
          <p className="text-muted">Select ingredients from your child's meal</p>
        </div>

        {/* Alert */}
        <div className="alert-banner">
          <AlertCircle size={20} className="text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">AI Analysis Active</p>
            <p className="text-xs text-muted">We'll analyze for potential allergens</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-3">
            {FOOD_CATEGORIES.slice(0, 3).map((cat) => (
              <TabsTrigger key={cat.name} value={cat.name} className="text-xs">
                {cat.emoji} {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid w-full grid-cols-3 mt-2">
            {FOOD_CATEGORIES.slice(3).map((cat) => (
              <TabsTrigger key={cat.name} value={cat.name} className="text-xs">
                {cat.emoji} {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {FOOD_CATEGORIES.map((cat) => (
            <TabsContent key={cat.name} value={cat.name} className="space-y-4">
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
          <Card className="p-4 space-y-3">
            <Label className="text-sm font-medium">Selected Foods ({selectedFoods.length})</Label>
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
          className="w-full h-12 text-base font-medium gap-2"
        >
          <Plus size={18} />
          Add Meal
        </Button>
      </div>
    </div>
  );
}
