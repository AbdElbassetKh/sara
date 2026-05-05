const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Symptoms() {
  const { t, language } = useLanguage();
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const COMMON_SYMPTOMS = [
    { key: 'rash', emoji: '🔴' },
    { key: 'itching', emoji: '🤔' },
    { key: 'swelling', emoji: '💧' },
    { key: 'cough', emoji: '😷' },
    { key: 'vomiting', emoji: '🤢' },
    { key: 'diarrhea', emoji: '💩' },
    { key: 'fever', emoji: '🌡️' },
    { key: 'lethargy', emoji: '😴' },
  ];

  const handleSubmit = () => {
    if (!selectedSymptom) return;
    console.log({ symptom: selectedSymptom, severity, notes });
    setSelectedSymptom(null);
    setSeverity(5);
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="page-header-pink px-4 pt-10 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-white">{t('symptomTracker')}</h1>
            <p className="text-sm text-white/80 mt-1">
              {language === 'fr' ? "Enregistrez les symptômes de votre enfant" : language === 'ar' ? 'سجل أعراض طفلك' : "Record any symptoms your child is experiencing"}
            </p>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-700">
              {language === 'fr' ? 'Corrélation automatique' : language === 'ar' ? 'ارتباط تلقائي' : 'Track Correlations'}
            </p>
            <p className="text-xs text-amber-500 mt-0.5">
              {language === 'fr' ? "Nous corrèlerons les symptômes avec les repas" : language === 'ar' ? 'سنربط الأعراض بالوجبات للحصول على تحليلات' : "We'll correlate symptoms with meals for insights"}
            </p>
          </div>
        </div>

        {/* Symptom Selection */}
        <Card className="p-5 space-y-4 shadow-sm">
          <Label className="text-sm font-semibold text-foreground">{t('addSymptom')}</Label>
          <div className="grid grid-cols-2 gap-3">
            {COMMON_SYMPTOMS.map((symptom) => (
              <Card
                key={symptom.key}
                className={`p-4 cursor-pointer transition-all border-2 text-center ${
                  selectedSymptom === symptom.key
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedSymptom(symptom.key)}
              >
                <div className="text-3xl mb-2">{symptom.emoji}</div>
                <p className="text-sm font-medium text-foreground">{t(symptom.key as any)}</p>
              </Card>
            ))}
          </div>
        </Card>

        {/* Severity Slider */}
        {selectedSymptom && (
          <Card className="p-5 space-y-4 shadow-sm">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground">{t('severity')}</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[severity]}
                  onValueChange={(value) => setSeverity(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{
                    backgroundColor: severity <= 3 ? '#10b981' : severity <= 6 ? '#f59e0b' : '#ef4444',
                  }}
                >
                  {severity}
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('mild')}</span>
                <span>{t('moderate')}</span>
                <span>{t('severe')}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Notes */}
        {selectedSymptom && (
          <Card className="p-5 space-y-3 shadow-sm">
            <Label htmlFor="notes" className="text-sm font-semibold text-foreground">
              {t('notes')}
            </Label>
            <Input
              id="notes"
              placeholder={t('notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Card>
        )}

        {/* Submit Button */}
        <Button
          disabled={!selectedSymptom}
          onClick={handleSubmit}
          className="w-full h-12 text-base font-semibold gap-2 rounded-xl"
        >
          <Plus size={18} />
          {t('addSymptom')}
        </Button>
      </div>
    </div>
  );
}
