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
  Syringe, ChevronLeft, ChevronRight, Brain, Link2, ShieldAlert,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  primary:   '#4FC3F7',
  secondary: '#F8BBD0',
  danger:    '#EF5350',
  warning:   '#FFA726',
  success:   '#66BB6A',
  purple:    '#8E24AA',
};

// ── Risk badge helper ─────────────────────────────────────────────────────────
function RiskBadge({ level, isAr, isFr }: { level: 'low' | 'medium' | 'high'; isAr: boolean; isFr: boolean }) {
  const cfg = {
    high:   { bg: '#FFEBEE', border: '#FFCDD2', color: C.danger,  label: isAr ? 'عالٍ'    : isFr ? 'Élevé'  : 'High'   },
    medium: { bg: '#FFF8E1', border: '#FFE082', color: C.warning, label: isAr ? 'متوسط'   : isFr ? 'Moyen'  : 'Medium' },
    low:    { bg: '#E8F5E9', border: '#C8E6C9', color: C.success, label: isAr ? 'منخفض'   : isFr ? 'Faible' : 'Low'    },
  }[level];

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold"
      style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, color: cfg.color }}
    >
      <ShieldAlert size={12} />
      {isAr ? 'مستوى الخطر: ' : isFr ? 'Risque : ' : 'Risk: '}
      {cfg.label}
    </div>
  );
}

// ── Confidence bar ────────────────────────────────────────────────────────────
function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 70 ? C.danger : value >= 40 ? C.warning : C.success;
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-2 rounded-full" style={{ background: '#F1F5F9' }}>
        <div className="h-2 rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[11px] font-bold" style={{ color }}>{value}%</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Insights() {
  const { language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();
  const childId = selectedChild?.id ?? 0;

  const isAr = language === 'ar';
  const isFr = language === 'fr';
  const t = (fr: string, ar: string, en: string) => isAr ? ar : isFr ? fr : en;

  const [showAdvice, setShowAdvice] = useState(false);

  // ── Queries ─────────────────────────────────────────────────────────────────
  const { data: meals = [] } = trpc.meals.list.useQuery(
    { childId },
    { enabled: childId > 0 }
  );
  const { data: symptoms = [] } = trpc.symptoms.list.useQuery(
    { childId },
    { enabled: childId > 0 }
  );
  const { data: correlations = [], isLoading: corrLoading } = trpc.insights.detectCorrelations.useQuery(
    { childId },
    { enabled: childId > 0, retry: false }
  );

  // ── AI mutation ─────────────────────────────────────────────────────────────
  const aiMutation = trpc.insights.analyzeWithAI.useMutation({
    onError: (err) => toast.error(err.message || t("Erreur IA", 'خطأ في الذكاء الاصطناعي', 'AI error')),
  });
  const aiResult = aiMutation.data;

  // ── Chart data (last 7 days) ─────────────────────────────────────────────
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
        meals:    meals.filter(m => new Date(m.eatenAt).toISOString().split('T')[0] === dateStr).length,
        symptoms: symptoms.filter(s => new Date(s.occurredAt).toISOString().split('T')[0] === dateStr).length,
      });
    }
    return days;
  }, [meals, symptoms, language]);

  // ── Stat cards ───────────────────────────────────────────────────────────────
  const STAT_CARDS = [
    { value: meals.length,    label: t('Repas enregistrés', 'وجبات مسجلة', 'Meals logged'),       gradient: `linear-gradient(135deg, ${C.primary}, #0288D1)`,  shadow: 'rgba(79,195,247,0.4)',  emoji: '🍽️' },
    { value: symptoms.length, label: t('Symptômes signalés', 'أعراض مبلغ عنها', 'Symptoms'),      gradient: `linear-gradient(135deg, ${C.secondary}, #E91E8C)`, shadow: 'rgba(244,143,177,0.4)', emoji: '🔔' },
    { value: correlations.length, label: t('Corrélations détectées', 'ارتباطات مكتشفة', 'Correlations'), gradient: `linear-gradient(135deg, #FFD54F, #FF8F00)`, shadow: 'rgba(255,213,79,0.4)', emoji: '🔗' },
    { value: meals.filter(m => m.aiAnalysis?.riskLevel === 'high').length, label: t('Repas à risque élevé', 'وجبات عالية الخطر', 'High-risk meals'), gradient: `linear-gradient(135deg, #EF9A9A, ${C.danger})`, shadow: 'rgba(239,83,80,0.4)', emoji: '⚠️' },
  ];

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* ── Header ── */}
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
            {/* ── AI Analyze button ── */}
            <button
              onClick={() => {
                if (!childId) { toast.error(t("Sélectionnez un enfant d'abord", 'اختر طفلاً أولاً', 'Select a child first')); return; }
                aiMutation.mutate({ childId });
              }}
              disabled={aiMutation.isPending || !childId}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-sm text-white text-sm font-bold border border-white/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {aiMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />}
              {t('Analyse IA', 'تحليل الذكاء الاصطناعي', 'AI Analysis')}
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

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 gap-3">
          {STAT_CARDS.map((card, i) => (
            <div key={i} className="p-4 rounded-3xl text-white" style={{ background: card.gradient, boxShadow: `0 6px 20px ${card.shadow}` }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 24 }}>{card.emoji}</span>
                <span className="text-3xl font-black">{card.value}</span>
              </div>
              <p className="text-white/85 text-[11px] font-semibold leading-tight">{card.label}</p>
            </div>
          ))}
        </div>

        {/* ── Correlations section ── */}
        <div className="p-5 rounded-3xl bg-white" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFD54F, #FF8F00)' }}>
              <Link2 size={16} color="white" />
            </div>
            <p className="text-sm font-extrabold text-gray-800">
              {t('Corrélations aliment → symptôme', 'ارتباطات الطعام بالأعراض', 'Food → Symptom Correlations')}
            </p>
          </div>

          {!childId ? (
            <p className="text-xs text-gray-400 text-center py-4">
              {t('Sélectionnez un enfant pour voir les corrélations', 'اختر طفلاً لرؤية الارتباطات', 'Select a child to see correlations')}
            </p>
          ) : corrLoading ? (
            <div className="flex items-center justify-center py-4 gap-2">
              <Loader2 size={16} className="animate-spin text-gray-400" />
              <span className="text-xs text-gray-400">{t('Calcul en cours…', 'جارٍ الحساب…', 'Computing…')}</span>
            </div>
          ) : correlations.length === 0 ? (
            <div className="flex flex-col items-center py-5 gap-2">
              <CheckCircle size={28} style={{ color: C.success }} />
              <p className="text-xs text-gray-500 text-center">
                {t(
                  `Aucune corrélation détectée (seuil : ${3} occurrences)`,
                  `لم يتم اكتشاف أي ارتباط (الحد الأدنى: ${3} مرات)`,
                  `No correlation detected yet (threshold: ${3} occurrences)`
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {correlations.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{
                    background: c.avgSeverity >= 7 ? '#FFEBEE' : c.avgSeverity >= 4 ? '#FFF8E1' : '#E8F5E9',
                    border: `1px solid ${c.avgSeverity >= 7 ? '#FFCDD2' : c.avgSeverity >= 4 ? '#FFE082' : '#C8E6C9'}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                    style={{ background: c.avgSeverity >= 7 ? C.danger : c.avgSeverity >= 4 ? C.warning : C.success }}
                  >
                    {c.count}×
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      🍽️ <span style={{ color: '#0288D1' }}>{c.food}</span>
                      {' → '}
                      🔴 <span style={{ color: C.danger }}>{c.symptom}</span>
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {t(`Sévérité moy. ${c.avgSeverity}/10`, `متوسط الشدة ${c.avgSeverity}/10`, `Avg severity ${c.avgSeverity}/10`)}
                    </p>
                  </div>
                  <AlertTriangle size={14} style={{ color: c.avgSeverity >= 7 ? C.danger : C.warning, flexShrink: 0 }} />
                </div>
              ))}
              <p className="text-[10px] text-gray-400 text-center pt-1">
                {t(
                  `Détecté quand le même aliment précède le même symptôme ≥ ${3}× dans les 4h`,
                  `يُكتشف عندما يسبق نفس الطعام نفس العرض ≥ ${3}× خلال 4 ساعات`,
                  `Detected when the same food precedes the same symptom ≥ ${3}× within 4h`
                )}
              </p>
            </div>
          )}
        </div>

        {/* ── Chart ── */}
        <div className="p-5 rounded-3xl bg-white" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
          <p className="text-sm font-extrabold text-gray-800 mb-4">
            📊 {t('Repas vs Symptômes (7 jours)', 'الوجبات مقابل الأعراض (7 أيام)', 'Meals vs Symptoms (7 days)')}
          </p>
          {meals.length === 0 && symptoms.length === 0 ? (
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
                <Bar dataKey="meals"    name={t('Repas', 'وجبات', 'Meals')}    fill={C.primary}    radius={[6, 6, 0, 0]} />
                <Bar dataKey="symptoms" name={t('Symptômes', 'أعراض', 'Symptoms')} fill={C.secondary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── AI Loading ── */}
        {aiMutation.isPending && (
          <div className="p-6 rounded-3xl bg-white flex flex-col items-center gap-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}>
              <Loader2 size={28} color="white" className="animate-spin" />
            </div>
            <p className="text-sm font-semibold text-gray-500">{t('Analyse IA en cours…', 'جارٍ التحليل بالذكاء الاصطناعي…', 'AI analysis in progress…')}</p>
            <p className="text-xs text-gray-400 text-center">{t('Cela peut prendre 10 à 20 secondes', 'قد يستغرق ذلك 10 إلى 20 ثانية', 'This may take 10–20 seconds')}</p>
          </div>
        )}

        {/* ── AI Result ── */}
        {aiResult && !aiMutation.isPending && (
          <div className="p-5 rounded-3xl bg-white space-y-4" style={{ boxShadow: '0 4px 20px rgba(142,36,170,0.12)', border: `2px solid #E1BEE7` }}>

            {/* Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}>
                <Brain size={16} color="white" />
              </div>
              <p className="text-sm font-extrabold text-gray-800">
                {t('Rapport IA personnalisé', 'تقرير الذكاء الاصطناعي المخصص', 'Personalized AI Report')}
              </p>
            </div>

            {/* Risk badge */}
            <RiskBadge level={aiResult.riskLevel} isAr={isAr} isFr={isFr} />

            {/* Summary */}
            {aiResult.summary && (
              <div className="px-3 py-2.5 rounded-2xl" style={{ background: '#F3E5F5', border: '1px solid #E1BEE7' }}>
                <p className="text-xs text-purple-800 leading-relaxed font-medium">{aiResult.summary}</p>
              </div>
            )}

            {/* Suspect food */}
            {aiResult.suspectFood && aiResult.suspectFood !== 'Aucun' && aiResult.suspectFood !== 'None' && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-1">
                  🚨 {t('Aliment le plus suspect', 'الطعام الأكثر اشتباهاً', 'Most suspect food')}
                </p>
                <div className="px-3 py-2 rounded-2xl" style={{ background: '#FFEBEE', border: '1px solid #FFCDD2' }}>
                  <p className="text-sm font-extrabold" style={{ color: C.danger }}>{aiResult.suspectFood}</p>
                  <p className="text-[10px] text-gray-500 mb-1">{t('Niveau de confiance', 'مستوى الثقة', 'Confidence level')}</p>
                  <ConfidenceBar value={Math.round(aiResult.suspectFoodConfidence)} />
                </div>
              </div>
            )}

            {/* Main symptoms */}
            {aiResult.mainSymptoms && aiResult.mainSymptoms.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">
                  🔴 {t('Principaux symptômes observés', 'الأعراض الرئيسية المُلاحظة', 'Main symptoms observed')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiResult.mainSymptoms.map((s: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: '#FFF8E1', color: '#E65100', border: '1px solid #FFE082' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Personalized advice */}
            {(aiResult.adviceAr || aiResult.adviceFr || aiResult.adviceEn) && (
              <div>
                <button
                  onClick={() => setShowAdvice(!showAdvice)}
                  className="flex items-center gap-1 text-xs font-bold"
                  style={{ color: C.purple }}
                >
                  {showAdvice ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {t('Conseils personnalisés', 'نصائح مخصصة', 'Personalized advice')}
                </button>
                {showAdvice && (
                  <div className="mt-2 px-3 py-3 rounded-2xl text-xs leading-relaxed" style={{ background: '#F3E5F5', border: '1px solid #E1BEE7', color: '#4A148C' }}>
                    {isAr ? aiResult.adviceAr : isFr ? aiResult.adviceFr : aiResult.adviceEn}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── No child selected ── */}
        {!childId && (
          <div className="p-6 rounded-3xl bg-white flex flex-col items-center gap-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
            <Sparkles size={32} style={{ color: C.purple, opacity: 0.5 }} />
            <p className="text-sm text-gray-400 text-center">
              {t("Sélectionnez un enfant pour voir les insights", 'اختر طفلاً لرؤية التحليلات', 'Select a child to see insights')}
            </p>
          </div>
        )}

        {/* ── General Tips ── */}
        <div className="space-y-3">
          <p className="text-sm font-extrabold text-gray-800">{t('Conseils généraux', 'نصائح عامة', 'General Tips')}</p>
          {[
            {
              icon: CheckCircle, gradient: `linear-gradient(135deg, #A5D6A7, #388E3C)`, shadow: 'rgba(165,214,167,0.4)',
              title: t('Alimentation équilibrée', 'غذاء متوازن', 'Balanced Diet'),
              desc: t('Assurez un mélange de fruits, légumes et protéines chaque jour.', 'احرص على تنوع الفواكه والخضروات والبروتينات يومياً.', 'Ensure a mix of fruits, vegetables, and proteins daily.'),
            },
            {
              icon: TrendingUp, gradient: `linear-gradient(135deg, #90CAF9, #1565C0)`, shadow: 'rgba(144,202,249,0.4)',
              title: t('Suivi régulier', 'المتابعة المنتظمة', 'Regular Monitoring'),
              desc: t('Enregistrez les repas et symptômes quotidiennement pour de meilleures analyses.', 'سجل الوجبات والأعراض يومياً لتحليلات أفضل.', 'Log meals and symptoms daily for better analysis.'),
            },
            {
              icon: AlertTriangle, gradient: `linear-gradient(135deg, #FFCC80, #E65100)`, shadow: 'rgba(255,204,128,0.4)',
              title: t('Consultez un médecin', 'استشر طبيباً', 'Consult a Doctor'),
              desc: t('En cas de symptômes persistants, consultez toujours un pédiatre.', 'في حالة الأعراض المستمرة، استشر دائماً طبيب الأطفال.', 'For persistent symptoms, always consult a pediatrician.'),
            },
          ].map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="flex items-start gap-4 p-4 rounded-3xl bg-white" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
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

        {/* ── Disclaimer ── */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl" style={{ background: '#FFFDE7', border: '1px solid #FFF176' }}>
          <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            {isAr ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية المتخصصة.' : isFr ? "Cette application est une aide, pas un remplacement d'un avis médical." : 'This app is a health aid, not a replacement for professional medical advice.'}
          </p>
        </div>

      </div>
    </div>
  );
}
