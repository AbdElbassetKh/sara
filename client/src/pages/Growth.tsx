const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState } from 'react';
import DatePicker from '@/components/DatePicker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Plus, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Growth() {
  const { t, language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCirc: '',
  });

  const childId = selectedChild?.id ?? 0;

  const { data: records = [], isLoading, refetch } = trpc.growth.list.useQuery(
    { childId },
    { enabled: childId > 0 }
  );

  const createMutation = trpc.growth.create.useMutation({
    onSuccess: () => {
      refetch();
      setFormData({ date: new Date().toISOString().split('T')[0], weight: '', height: '', headCirc: '' });
      setShowForm(false);
      toast.success(language === 'ar' ? 'تم حفظ القياسات' : language === 'fr' ? 'Mesures enregistrées' : 'Measurements saved');
    },
    onError: () => {
      toast.error(language === 'ar' ? 'حدث خطأ' : language === 'fr' ? "Erreur lors de l'enregistrement" : 'Error saving measurements');
    },
  });

  const deleteMutation = trpc.growth.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success(language === 'ar' ? 'تم الحذف' : language === 'fr' ? 'Supprimé' : 'Deleted');
    },
  });

  const handleSubmit = () => {
    if (!childId) {
      toast.error(language === 'ar' ? 'اختر طفلاً أولاً' : language === 'fr' ? 'Sélectionnez un enfant' : 'Select a child first');
      return;
    }
    if (!formData.weight && !formData.height && !formData.headCirc) {
      toast.error(language === 'ar' ? 'أدخل قياساً واحداً على الأقل' : language === 'fr' ? 'Entrez au moins une mesure' : 'Enter at least one measurement');
      return;
    }
    createMutation.mutate({
      childId,
      recordDate: formData.date,
      weightKg: formData.weight || undefined,
      heightCm: formData.height || undefined,
      headCircCm: formData.headCirc || undefined,
    });
  };

  // Sort ascending for chart
  const chartData = [...records]
    .sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime())
    .map((r) => ({
      date: new Date(r.recordDate).toLocaleDateString(
        language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US',
        { month: 'short', day: 'numeric' }
      ),
      weight: r.weightKg ? parseFloat(r.weightKg) : null,
      height: r.heightCm ? parseFloat(r.heightCm) : null,
      headCirc: r.headCircCm ? parseFloat(r.headCircCm) : null,
    }));

  const latestRecord = records[0];
  const previousRecord = records[1];

  const diff = (curr: string | null | undefined, prev: string | null | undefined) => {
    if (!curr || !prev) return null;
    const d = parseFloat(curr) - parseFloat(prev);
    return d >= 0 ? `+${d.toFixed(1)}` : d.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="page-header-green px-4 pt-10 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-white">{t('growthTracker')}</h1>
            <p className="text-sm text-white/80 mt-1">
              {language === 'fr'
                ? 'Suivez le développement de votre enfant'
                : language === 'ar'
                ? 'تابع نمو طفلك'
                : "Monitor your child's development"}
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        )}

        {/* Latest Measurements */}
        {!isLoading && latestRecord && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 p-5 space-y-4 border-0 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">{t('latestMeasurements')}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-primary">{latestRecord.weightKg ?? '—'}</p>
                <p className="text-xs text-muted-foreground">kg</p>
                <p className="text-[10px] text-muted-foreground">{language === 'fr' ? 'Poids' : language === 'ar' ? 'الوزن' : 'Weight'}</p>
                {previousRecord && diff(latestRecord.weightKg, previousRecord.weightKg) && (
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp size={10} />
                    {diff(latestRecord.weightKg, previousRecord.weightKg)}
                  </p>
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-secondary">{latestRecord.heightCm ?? '—'}</p>
                <p className="text-xs text-muted-foreground">cm</p>
                <p className="text-[10px] text-muted-foreground">{language === 'fr' ? 'Taille' : language === 'ar' ? 'الطول' : 'Height'}</p>
                {previousRecord && diff(latestRecord.heightCm, previousRecord.heightCm) && (
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp size={10} />
                    {diff(latestRecord.heightCm, previousRecord.heightCm)}
                  </p>
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-orange-600">{latestRecord.headCircCm ?? '—'}</p>
                <p className="text-xs text-muted-foreground">cm</p>
                <p className="text-[10px] text-muted-foreground">{language === 'fr' ? 'Crâne' : language === 'ar' ? 'الرأس' : 'Head'}</p>
                {previousRecord && diff(latestRecord.headCircCm, previousRecord.headCircCm) && (
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp size={10} />
                    {diff(latestRecord.headCircCm, previousRecord.headCircCm)}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && records.length === 0 && (
          <Card className="p-6 text-center border-0 shadow-sm">
            <TrendingUp className="mx-auto mb-2 text-primary/40" size={32} />
            <p className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Aucune mesure enregistrée' : language === 'ar' ? 'لا توجد قياسات مسجلة' : 'No measurements recorded yet'}
            </p>
          </Card>
        )}

        {/* Growth Chart */}
        {chartData.length >= 2 && (
          <Card className="p-4 border-0 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {language === 'fr' ? 'Courbe de croissance' : language === 'ar' ? 'منحنى النمو' : 'Growth curve'}
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {chartData.some(d => d.weight !== null) && (
                  <Line type="monotone" dataKey="weight" stroke="#4FC3F7" strokeWidth={2} dot={{ r: 3 }} name={`${language === 'fr' ? 'Poids' : language === 'ar' ? 'الوزن' : 'Weight'} (kg)`} connectNulls />
                )}
                {chartData.some(d => d.height !== null) && (
                  <Line type="monotone" dataKey="height" stroke="#F8BBD0" strokeWidth={2} dot={{ r: 3 }} name={`${language === 'fr' ? 'Taille' : language === 'ar' ? 'الطول' : 'Height'} (cm)`} connectNulls />
                )}
                {chartData.some(d => d.headCirc !== null) && (
                  <Line type="monotone" dataKey="headCirc" stroke="#CE93D8" strokeWidth={2} dot={{ r: 3 }} name={`${language === 'fr' ? 'Crâne' : language === 'ar' ? 'الرأس' : 'Head'} (cm)`} connectNulls />
                )}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Add Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full h-12 text-base font-semibold gap-2 rounded-xl"
          >
            <Plus size={18} />
            {t('addMeasurement')}
          </Button>
        )}

        {/* Add Form */}
        {showForm && (
          <Card className="p-5 space-y-4 border-0 shadow-sm">
            <h3 className="font-semibold text-foreground">{t('addMeasurement')}</h3>
            <div className="space-y-1">
              <Label className="text-sm">{t('date')}</Label>
              <DatePicker
                label={t('date')}
                value={formData.date}
                onChange={(v) => setFormData(p => ({ ...p, date: v }))}
                maxYear={new Date().getFullYear()}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{language === 'fr' ? 'Poids (kg)' : language === 'ar' ? 'الوزن (kg)' : 'Weight (kg)'}</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.weight}
                  onChange={(e) => setFormData(p => ({ ...p, weight: e.target.value }))}
                  className="text-center"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{language === 'fr' ? 'Taille (cm)' : language === 'ar' ? 'الطول (cm)' : 'Height (cm)'}</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.height}
                  onChange={(e) => setFormData(p => ({ ...p, height: e.target.value }))}
                  className="text-center"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{language === 'fr' ? 'Crâne (cm)' : language === 'ar' ? 'الرأس (cm)' : 'Head (cm)'}</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.headCirc}
                  onChange={(e) => setFormData(p => ({ ...p, headCirc: e.target.value }))}
                  className="text-center"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                {t('cancel')}
              </Button>
              <Button
                className="flex-1 bg-primary text-white"
                onClick={handleSubmit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : t('save')}
              </Button>
            </div>
          </Card>
        )}

        {/* History */}
        {records.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">
              {language === 'fr' ? 'Historique des mesures' : language === 'ar' ? 'سجل القياسات' : 'Measurement history'}
            </h2>
            {records.map((record) => (
              <Card key={record.id} className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(record.recordDate).toLocaleDateString(
                        language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </p>
                    <div className="flex gap-4 text-sm">
                      {record.weightKg && <span className="text-primary font-medium">{record.weightKg} kg</span>}
                      {record.heightCm && <span className="text-secondary font-medium">{record.heightCm} cm</span>}
                      {record.headCircCm && <span className="text-orange-600 font-medium">{record.headCircCm} cm ⊙</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => deleteMutation.mutate({ id: record.id })}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
