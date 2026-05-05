const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { useAppContext } from '@/contexts/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Loader2,
  RefreshCw, Syringe, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

export default function Insights() {
  const { language } = useLanguage();
  const { selectedChild } = useAppContext();
  const selectedChildId = selectedChild?.id ?? null;
  const [showFullReport, setShowFullReport] = useState(false);

  const t = (fr: string, ar: string, en: string) =>
    language === 'fr' ? fr : language === 'ar' ? ar : en;

  // Fetch real data from DB
  const { data: meals = [] } = trpc.meals.list.useQuery(
    { childId: selectedChildId ?? 0 },
    { enabled: !!selectedChildId }
  );
  const { data: symptoms = [] } = trpc.symptoms.list.useQuery(
    { childId: selectedChildId ?? 0 },
    { enabled: !!selectedChildId }
  );

  // AI analysis mutation
  const analysisMutation = trpc.meals.analyzeInsights.useMutation({
    onError: () => toast.error(t('Erreur lors de l\'analyse IA', 'خطأ في تحليل الذكاء الاصطناعي', 'AI analysis error')),
  });

  // Build chart data: last 7 days meals count vs symptoms count
  const chartData = useMemo(() => {
    const days: { date: string; label: string; meals: number; symptoms: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short' });

      const mealsCount = meals.filter(m => {
        const mDate = new Date(m.eatenAt).toISOString().split('T')[0];
        return mDate === dateStr;
      }).length;

      const symptomsCount = symptoms.filter(s => {
        const sDate = new Date(s.occurredAt).toISOString().split('T')[0];
        return sDate === dateStr;
      }).length;

      days.push({ date: dateStr, label, meals: mealsCount, symptoms: symptomsCount });
    }
    return days;
  }, [meals, symptoms, language]);

  // Compute stats
  const totalMeals = meals.length;
  const totalSymptoms = symptoms.length;
  const highRiskMeals = meals.filter(m => m.aiAnalysis?.riskLevel === 'high').length;
  const allergenMeals = meals.filter(m => (m.aiAnalysis?.allergens?.length ?? 0) > 0).length;

  const handleRunAnalysis = () => {
    if (!selectedChildId) {
      toast.error(t('Sélectionnez un enfant d\'abord', 'اختر طفلاً أولاً', 'Select a child first'));
      return;
    }
    analysisMutation.mutate({ childId: selectedChildId });
  };

  const aiResult = analysisMutation.data;

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto p-4 space-y-5">
      </div>
      {/* Header gradient */}
      <div className="page-header-pink px-4 pt-10 pb-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              {t('Insights IA', 'رؤى الذكاء الاصطناعي', 'AI Insights')}
            </h1>
            <p className="text-sm text-white/80 mt-0.5">
              {t('Analyse des 30 derniers jours', 'تحليل آخر 30 يوماً', 'Last 30 days analysis')}
            </p>
          </div>
          <button
            onClick={handleRunAnalysis}
            disabled={analysisMutation.isPending || !selectedChildId}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-semibold border border-white/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {analysisMutation.isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <RefreshCw className="w-4 h-4" />}
            {t('Analyser', 'تحليل', 'Analyze')}
          </button>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 -mt-2 space-y-5">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{totalMeals}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t('Repas enregistrés', 'وجبات مسجلة', 'Meals logged')}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">{totalSymptoms}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t('Symptômes signalés', 'أعراض مبلغ عنها', 'Symptoms reported')}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{highRiskMeals}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t('Repas à risque élevé', 'وجبات عالية الخطر', 'High-risk meals')}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-500">{allergenMeals}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t('Allergènes détectés', 'مسببات حساسية', 'Allergens detected')}</p>
          </Card>
        </div>

        {/* Chart: Meals vs Symptoms last 7 days */}
        <Card className="p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            📊 {t('Repas vs Symptômes (7 jours)', 'الوجبات مقابل الأعراض (7 أيام)', 'Meals vs Symptoms (7 days)')}
          </h2>
          {totalMeals === 0 && totalSymptoms === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <TrendingUp className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-xs text-center">
                {t('Enregistrez des repas et symptômes pour voir le graphique', 'سجل وجبات وأعراضاً لرؤية الرسم البياني', 'Log meals and symptoms to see the chart')}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'meals'
                      ? t('Repas', 'وجبات', 'Meals')
                      : t('Symptômes', 'أعراض', 'Symptoms')
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === 'meals'
                      ? t('Repas', 'وجبات', 'Meals')
                      : t('Symptômes', 'أعراض', 'Symptoms')
                  }
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Bar dataKey="meals" fill="#4FC3F7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="symptoms" fill="#F8BBD0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Disclaimer médical – avant les résultats IA */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            {language === 'ar'
              ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية المتخصصة. استشر دائماً طبيباً لأي مشكلة صحية.'
              : language === 'fr'
              ? "Cette application est une aide, pas un remplacement d'un avis médical. Consultez toujours un médecin pour tout problème de santé."
              : 'This app is a health aid tool, not a replacement for professional medical advice. Always consult a doctor for any health concern.'}
          </p>
        </div>

        {/* AI Analysis Result */}
        {analysisMutation.isPending && (
          <Card className="p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {t('Analyse IA en cours…', 'جارٍ التحليل بالذكاء الاصطناعي…', 'AI analysis in progress…')}
            </p>
          </Card>
        )}

        {aiResult && (
          <Card className="p-4 border-2 border-primary/20 bg-primary/3 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                {t('Rapport IA personnalisé', 'تقرير الذكاء الاصطناعي المخصص', 'Personalized AI Report')}
              </h2>
            </div>

            {/* Risk Level */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              aiResult.riskLevel === 'high' ? 'bg-red-50 text-red-700' :
              aiResult.riskLevel === 'medium' ? 'bg-orange-50 text-orange-700' :
              'bg-green-50 text-green-700'
            }`}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-semibold">
                {t('Niveau de risque', 'مستوى الخطر', 'Risk level')} :{' '}
                {aiResult.riskLevel === 'high'
                  ? t('Élevé', 'عالٍ', 'High')
                  : aiResult.riskLevel === 'medium'
                  ? t('Moyen', 'متوسط', 'Medium')
                  : t('Faible', 'منخفض', 'Low')}
              </span>
            </div>

            {/* Trigger Foods */}
            {aiResult.triggerFoods && aiResult.triggerFoods.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-1.5">
                  🚨 {t('Aliments déclencheurs probables', 'الأطعمة المحتملة المسببة', 'Probable trigger foods')} :
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {aiResult.triggerFoods.map((food: string, i: number) => (
                    <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {aiResult.recommendations && (
              <div>
                <button
                  onClick={() => setShowFullReport(!showFullReport)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  {showFullReport ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {t('Recommandations détaillées', 'التوصيات التفصيلية', 'Detailed recommendations')}
                </button>
                {showFullReport && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                    {aiResult.recommendations}
                  </p>
                )}
              </div>
            )}

            {/* Vaccine Reminders */}
            {aiResult.vaccineReminders && aiResult.vaccineReminders.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-1.5">
                  💉 {t('Rappels vaccins', 'تذكيرات التطعيم', 'Vaccine reminders')} :
                </p>
                {aiResult.vaccineReminders.map((r: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Syringe className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Static Insights (always shown as baseline) */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            {t('Conseils généraux', 'نصائح عامة', 'General Tips')}
          </h2>
          {[
            {
              icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200',
              title: t('Alimentation équilibrée', 'غذاء متوازن', 'Balanced Diet'),
              desc: t('Assurez un mélange de fruits, légumes et protéines chaque jour.', 'احرص على تنوع الفواكه والخضروات والبروتينات يومياً.', 'Ensure a mix of fruits, vegetables, and proteins daily.'),
            },
            {
              icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200',
              title: t('Suivi régulier', 'المتابعة المنتظمة', 'Regular Monitoring'),
              desc: t('Enregistrez les repas et symptômes quotidiennement pour de meilleures analyses.', 'سجل الوجبات والأعراض يومياً لتحليلات أفضل.', 'Log meals and symptoms daily for better analysis.'),
            },
            {
              icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200',
              title: t('Consultez un médecin', 'استشر طبيباً', 'Consult a Doctor'),
              desc: t('En cas de symptômes persistants, consultez toujours un pédiatre.', 'في حالة الأعراض المستمرة، استشر دائماً طبيب الأطفال.', 'For persistent symptoms, always consult a pediatrician.'),
            },
          ].map((tip, i) => {
            const Icon = tip.icon;
            return (
              <Card key={i} className={`p-4 border ${tip.bg}`}>
                <div className="flex gap-3">
                  <Icon className={`w-4 h-4 ${tip.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tip.desc}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>


      </div>
    </div>
  );
}
