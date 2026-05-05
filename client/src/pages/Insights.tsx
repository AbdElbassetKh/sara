import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { useAppContext } from '@/contexts/AppContext';
import { useLocation } from 'wouter';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Sparkles, TrendingUp, AlertTriangle, CheckCircle, Loader2,
  RefreshCw, Syringe, ChevronDown, ChevronUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function Insights() {
  const { language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();
  const selectedChildId = selectedChild?.id ?? null;
  const [showFullReport, setShowFullReport] = useState(false);

  const isAr = language === 'ar';
  const isFr = language === 'fr';
  const t = (fr: string, ar: string, en: string) => isAr ? ar : isFr ? fr : en;

  const { data: meals = [] } = trpc.meals.list.useQuery(
    { childId: selectedChildId ?? 0 },
    { enabled: !!selectedChildId }
  );
  const { data: symptoms = [] } = trpc.symptoms.list.useQuery(
    { childId: selectedChildId ?? 0 },
    { enabled: !!selectedChildId }
  );

  const analysisMutation = trpc.meals.analyzeInsights.useMutation({
    onError: () => toast.error(t("Erreur lors de l'analyse IA", 'خطأ في تحليل الذكاء الاصطناعي', 'AI analysis error')),
  });

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString(isAr ? 'ar-DZ' : isFr ? 'fr-FR' : 'en-US', { weekday: 'short' });
      days.push({
        date: dateStr,
        label,
        meals: meals.filter(m => new Date(m.eatenAt).toISOString().split('T')[0] === dateStr).length,
        symptoms: symptoms.filter(s => new Date(s.occurredAt).toISOString().split('T')[0] === dateStr).length,
      });
    }
    return days;
  }, [meals, symptoms, language]);

  const totalMeals = meals.length;
  const totalSymptoms = symptoms.length;
  const highRiskMeals = meals.filter(m => m.aiAnalysis?.riskLevel === 'high').length;
  const allergenMeals = meals.filter(m => (m.aiAnalysis?.allergens?.length ?? 0) > 0).length;
  const aiResult = analysisMutation.data;

  const STAT_CARDS = [
    { value: totalMeals, label: t('Repas enregistrés', 'وجبات مسجلة', 'Meals logged'), gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)', shadow: 'rgba(79,195,247,0.4)', emoji: '🍽️' },
    { value: totalSymptoms, label: t('Symptômes signalés', 'أعراض مبلغ عنها', 'Symptoms reported'), gradient: 'linear-gradient(135deg, #F48FB1, #E91E8C)', shadow: 'rgba(244,143,177,0.4)', emoji: '🔔' },
    { value: highRiskMeals, label: t('Repas à risque élevé', 'وجبات عالية الخطر', 'High-risk meals'), gradient: 'linear-gradient(135deg, #EF9A9A, #E53935)', shadow: 'rgba(239,83,80,0.4)', emoji: '⚠️' },
    { value: allergenMeals, label: t('Allergènes détectés', 'مسببات حساسية', 'Allergens detected'), gradient: 'linear-gradient(135deg, #FFD54F, #FF8F00)', shadow: 'rgba(255,213,79,0.4)', emoji: '🌿' },
  ];

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-7"
        style={{
          background: 'linear-gradient(135deg, #CE93D8 0%, #8E24AA 60%, #AB47BC 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 8px 32px rgba(142,36,170,0.35)',
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-10 pointer-events-none" style={{ background: 'white', transform: 'translate(-30%, 40%)' }} />

        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setLocation('/')} className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              {isAr ? <ChevronRight size={20} color="white" /> : <ChevronLeft size={20} color="white" />}
            </button>
            <button
              onClick={() => { if (!selectedChildId) { toast.error(t("Sélectionnez un enfant d'abord", 'اختر طفلاً أولاً', 'Select a child first')); return; } analysisMutation.mutate({ childId: selectedChildId }); }}
              disabled={analysisMutation.isPending || !selectedChildId}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-sm text-white text-sm font-bold border border-white/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {analysisMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {t('Analyser', 'تحليل', 'Analyze')}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <Sparkles size={26} color="white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-extrabold leading-tight">{t('Insights IA', 'رؤى الذكاء الاصطناعي', 'AI Insights')}</h1>
              <p className="text-white/75 text-xs mt-0.5">{t('Analyse des 30 derniers jours', 'تحليل آخر 30 يوماً', 'Last 30 days analysis')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {STAT_CARDS.map((card, i) => (
            <div
              key={i}
              className="p-4 rounded-3xl text-white"
              style={{ background: card.gradient, boxShadow: `0 6px 20px ${card.shadow}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 24 }}>{card.emoji}</span>
                <span className="text-3xl font-black">{card.value}</span>
              </div>
              <p className="text-white/85 text-[11px] font-semibold leading-tight">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div
          className="p-5 rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
        >
          <p className="text-sm font-extrabold text-gray-800 mb-4">
            📊 {t('Repas vs Symptômes (7 jours)', 'الوجبات مقابل الأعراض (7 أيام)', 'Meals vs Symptoms (7 days)')}
          </p>
          {totalMeals === 0 && totalSymptoms === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <TrendingUp size={32} className="mb-2 opacity-40" />
              <p className="text-xs text-center">
                {t('Enregistrez des repas et symptômes pour voir le graphique', 'سجل وجبات وأعراضاً لرؤية الرسم البياني', 'Log meals and symptoms to see the chart')}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="meals" fill="#4FC3F7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="symptoms" fill="#F48FB1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl" style={{ background: '#FFFDE7', border: '1px solid #FFF176' }}>
          <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            {isAr ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية المتخصصة.' : isFr ? "Cette application est une aide, pas un remplacement d'un avis médical." : 'This app is a health aid, not a replacement for professional medical advice.'}
          </p>
        </div>

        {/* AI Loading */}
        {analysisMutation.isPending && (
          <div
            className="p-6 rounded-3xl bg-white flex flex-col items-center gap-3"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}>
              <Loader2 size={28} color="white" className="animate-spin" />
            </div>
            <p className="text-sm font-semibold text-gray-500">{t('Analyse IA en cours…', 'جارٍ التحليل بالذكاء الاصطناعي…', 'AI analysis in progress…')}</p>
          </div>
        )}

        {/* AI Result */}
        {aiResult && (
          <div
            className="p-5 rounded-3xl bg-white space-y-4"
            style={{ boxShadow: '0 4px 20px rgba(142,36,170,0.12)', border: '2px solid #E1BEE7' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}>
                <Sparkles size={16} color="white" />
              </div>
              <p className="text-sm font-extrabold text-gray-800">{t('Rapport IA personnalisé', 'تقرير الذكاء الاصطناعي المخصص', 'Personalized AI Report')}</p>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2 rounded-2xl"
              style={{
                background: aiResult.riskLevel === 'high' ? '#FFEBEE' : aiResult.riskLevel === 'medium' ? '#FFF8E1' : '#E8F5E9',
                border: `1.5px solid ${aiResult.riskLevel === 'high' ? '#FFCDD2' : aiResult.riskLevel === 'medium' ? '#FFE082' : '#C8E6C9'}`,
              }}
            >
              <AlertTriangle size={16} style={{ color: aiResult.riskLevel === 'high' ? '#E53935' : aiResult.riskLevel === 'medium' ? '#FB8C00' : '#43A047' }} />
              <span className="text-xs font-bold" style={{ color: aiResult.riskLevel === 'high' ? '#C62828' : aiResult.riskLevel === 'medium' ? '#E65100' : '#2E7D32' }}>
                {t('Niveau de risque', 'مستوى الخطر', 'Risk level')} : {aiResult.riskLevel === 'high' ? t('Élevé', 'عالٍ', 'High') : aiResult.riskLevel === 'medium' ? t('Moyen', 'متوسط', 'Medium') : t('Faible', 'منخفض', 'Low')}
              </span>
            </div>

            {aiResult.triggerFoods && aiResult.triggerFoods.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">🚨 {t('Aliments déclencheurs probables', 'الأطعمة المحتملة المسببة', 'Probable trigger foods')}</p>
                <div className="flex flex-wrap gap-2">
                  {aiResult.triggerFoods.map((food: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: '#FFEBEE', color: '#C62828' }}>{food}</span>
                  ))}
                </div>
              </div>
            )}

            {aiResult.recommendations && (
              <div>
                <button onClick={() => setShowFullReport(!showFullReport)} className="flex items-center gap-1 text-xs font-bold" style={{ color: '#8E24AA' }}>
                  {showFullReport ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {t('Recommandations détaillées', 'التوصيات التفصيلية', 'Detailed recommendations')}
                </button>
                {showFullReport && <p className="text-xs text-gray-500 mt-2 leading-relaxed whitespace-pre-wrap">{aiResult.recommendations}</p>}
              </div>
            )}

            {aiResult.vaccineReminders && aiResult.vaccineReminders.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">💉 {t('Rappels vaccins', 'تذكيرات التطعيم', 'Vaccine reminders')}</p>
                {aiResult.vaccineReminders.map((r: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <Syringe size={12} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* General Tips */}
        <div className="space-y-3">
          <p className="text-sm font-extrabold text-gray-800">{t('Conseils généraux', 'نصائح عامة', 'General Tips')}</p>
          {[
            {
              icon: CheckCircle, gradient: 'linear-gradient(135deg, #A5D6A7, #388E3C)', shadow: 'rgba(165,214,167,0.4)',
              title: t('Alimentation équilibrée', 'غذاء متوازن', 'Balanced Diet'),
              desc: t('Assurez un mélange de fruits, légumes et protéines chaque jour.', 'احرص على تنوع الفواكه والخضروات والبروتينات يومياً.', 'Ensure a mix of fruits, vegetables, and proteins daily.'),
            },
            {
              icon: TrendingUp, gradient: 'linear-gradient(135deg, #90CAF9, #1565C0)', shadow: 'rgba(144,202,249,0.4)',
              title: t('Suivi régulier', 'المتابعة المنتظمة', 'Regular Monitoring'),
              desc: t('Enregistrez les repas et symptômes quotidiennement pour de meilleures analyses.', 'سجل الوجبات والأعراض يومياً لتحليلات أفضل.', 'Log meals and symptoms daily for better analysis.'),
            },
            {
              icon: AlertTriangle, gradient: 'linear-gradient(135deg, #FFCC80, #E65100)', shadow: 'rgba(255,204,128,0.4)',
              title: t('Consultez un médecin', 'استشر طبيباً', 'Consult a Doctor'),
              desc: t('En cas de symptômes persistants, consultez toujours un pédiatre.', 'في حالة الأعراض المستمرة، استشر دائماً طبيب الأطفال.', 'For persistent symptoms, always consult a pediatrician.'),
            },
          ].map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-3xl bg-white"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: tip.gradient, boxShadow: `0 4px 12px ${tip.shadow}` }}>
                  <Icon size={18} color="white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{tip.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
