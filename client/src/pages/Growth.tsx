import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const GROWTH_DATA = [
  { date: '2024-01-15', weight: 3.5, height: 50, headCirc: 35 },
  { date: '2024-02-15', weight: 4.2, height: 52, headCirc: 36 },
  { date: '2024-03-15', weight: 5.1, height: 54, headCirc: 37 },
  { date: '2024-04-15', weight: 6.0, height: 56, headCirc: 38 },
  { date: '2024-05-15', weight: 6.8, height: 58, headCirc: 39 },
];

export default function Growth() {
  const { t, language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCirc: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
    setFormData({ date: new Date().toISOString().split('T')[0], weight: '', height: '', headCirc: '' });
    setShowForm(false);
  };

  const latestRecord = GROWTH_DATA[GROWTH_DATA.length - 1];
  const previousRecord = GROWTH_DATA[GROWTH_DATA.length - 2];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">{t('growthTracker')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'fr' ? "Suivez le développement de votre enfant" : language === 'ar' ? 'تابع نمو طفلك' : "Monitor your child's development"}
          </p>
        </div>

        {/* Latest Measurements */}
        {latestRecord && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 p-5 space-y-4 border-0 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">{t('latestMeasurements')}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-primary">{latestRecord.weight}</p>
                <p className="text-xs text-muted-foreground">kg</p>
                <p className="text-[10px] text-muted-foreground">{language === 'fr' ? 'Poids' : language === 'ar' ? 'الوزن' : 'Weight'}</p>
                {previousRecord && (
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp size={10} />
                    +{(latestRecord.weight - previousRecord.weight).toFixed(1)}
                  </p>
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-secondary">{latestRecord.height}</p>
                <p className="text-xs text-muted-foreground">cm</p>
                <p className="text-[10px] text-muted-foreground">{language === 'fr' ? 'Taille' : language === 'ar' ? 'الطول' : 'Height'}</p>
                {previousRecord && (
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp size={10} />
                    +{(latestRecord.height - previousRecord.height).toFixed(1)}
                  </p>
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-orange-600">{latestRecord.headCirc}</p>
                <p className="text-xs text-muted-foreground">cm</p>
                <p className="text-[10px] text-muted-foreground">{language === 'fr' ? 'Crâne' : language === 'ar' ? 'الرأس' : 'Head'}</p>
                {previousRecord && (
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp size={10} />
                    +{(latestRecord.headCirc - previousRecord.headCirc).toFixed(1)}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Growth Chart Placeholder */}
        <Card className="p-5 space-y-3 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">{t('growthChart')}</h2>
          <div className="h-40 bg-muted/20 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-sm text-center px-4">
              {language === 'fr' ? 'Visualisation des courbes de croissance à venir' : language === 'ar' ? 'سيتوفر عرض منحنيات النمو قريباً' : 'Growth chart visualization coming soon'}
            </p>
          </div>
        </Card>

        {/* Previous Records */}
        <Card className="p-5 space-y-3 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            {language === 'fr' ? 'Historique des mesures' : language === 'ar' ? 'سجل القياسات' : 'Previous Records'}
          </h2>
          <div className="space-y-2">
            {GROWTH_DATA.slice().reverse().map((record, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{record.date}</p>
                  <p className="text-xs text-muted-foreground">{record.weight} kg • {record.height} cm</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-primary">{record.headCirc} cm</p>
                  <p className="text-[10px] text-muted-foreground">{language === 'fr' ? 'Périm. crânien' : language === 'ar' ? 'محيط الرأس' : 'Head circ.'}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Measurement Form */}
        {showForm && (
          <Card className="p-5 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">{t('addMeasurement')}</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-sm font-medium">{t('date')}</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight" className="text-sm font-medium">{t('weight')}</Label>
                <Input id="weight" type="number" step="0.1" placeholder="6.8" value={formData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="height" className="text-sm font-medium">{t('height')}</Label>
                <Input id="height" type="number" step="0.1" placeholder="58" value={formData.height} onChange={(e) => handleInputChange('height', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="headCirc" className="text-sm font-medium">{t('headCircumference')}</Label>
                <Input id="headCirc" type="number" step="0.1" placeholder="39" value={formData.headCirc} onChange={(e) => handleInputChange('headCirc', e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1 rounded-xl">{t('save')}</Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 rounded-xl">{t('cancel')}</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Add Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="w-full h-12 text-base font-semibold gap-2 rounded-xl">
            <Plus size={18} />
            {t('addMeasurement')}
          </Button>
        )}
      </div>
    </div>
  );
}
