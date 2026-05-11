import { useState, useMemo, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { useAppContext } from '@/contexts/AppContext';
import { useLocation } from 'wouter';
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Sparkles, TrendingUp, AlertTriangle, CheckCircle, Loader2,
  ChevronLeft, ChevronRight, Brain, Link2, ShieldAlert,
  ChevronDown, ChevronUp, BarChart2, Activity, Grid3X3, Crown, Lock
} from 'lucide-react';
import { Link } from 'wouter';
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

// ── Period selector ───────────────────────────────────────────────────────────
type Period = 7 | 14 | 30;

function PeriodSelector({ value, onChange, isAr, isFr }: { value: Period; onChange: (v: Period) => void; isAr: boolean; isFr: boolean }) {
  const options: { v: Period; label: string }[] = [
    { v: 7,  label: isAr ? '7 أيام'  : isFr ? '7 j'   : '7d'  },
    { v: 14, label: isAr ? '14 يوم'  : isFr ? '14 j'  : '14d' },
    { v: 30, label: isAr ? '30 يوم'  : isFr ? '30 j'  : '30d' },
  ];
  return (
    <div className="flex gap-1 p-1 rounded-2xl" style={{ background: '#F1F5F9' }}>
      {options.map(o => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          style={value === o.v
            ? { background: 'white', color: C.purple, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
            : { color: '#9CA3AF' }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Risk badge ────────────────────────────────────────────────────────────────
function RiskBadge({ level, isAr, isFr }: { level: 'low' | 'medium' | 'high'; isAr: boolean; isFr: boolean }) {
  const cfg = {
    high:   { bg: '#FFEBEE', border: '#FFCDD2', color: C.danger,  label: isAr ? 'عالٍ'  : isFr ? 'Élevé'  : 'High'   },
    medium: { bg: '#FFF8E1', border: '#FFE082', color: C.warning, label: isAr ? 'متوسط' : isFr ? 'Moyen'  : 'Medium' },
    low:    { bg: '#E8F5E9', border: '#C8E6C9', color: C.success, label: isAr ? 'منخفض' : isFr ? 'Faible' : 'Low'    },
  }[level];
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold"
      style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, color: cfg.color }}>
      <ShieldAlert size={12} />
      {isAr ? 'مستوى الخطر: ' : isFr ? 'Risque : ' : 'Risk: '}{cfg.label}
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

// ── Heatmap cell colour ───────────────────────────────────────────────────────
function heatColor(count: number, max: number): string {
  if (max === 0 || count === 0) return '#F1F5F9';
  const ratio = count / max;
  if (ratio >= 0.75) return '#EF5350';
  if (ratio >= 0.5)  return '#FFA726';
  if (ratio >= 0.25) return '#FFD54F';
  return '#E8F5E9';
}

// ── Custom tooltip for AreaChart ──────────────────────────────────────────────
function CustomAreaTooltip({ active, payload, label, isAr, isFr }: {
  active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string; isAr: boolean; isFr: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-2xl text-xs" style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1px solid #F1F5F9' }}>
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name === 'symptoms' ? (isAr ? 'أعراض' : isFr ? 'Symptômes' : 'Symptoms') :
           p.name === 'avgSeverity' ? (isAr ? 'شدة متوسطة' : isFr ? 'Sévérité moy.' : 'Avg severity') :
           (isAr ? 'وجبات' : isFr ? 'Repas' : 'Meals')} : <strong>{p.value}</strong>
        </p>
      ))}
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

  const [period, setPeriod] = useState<Period>(30);
  const [showAdvice, setShowAdvice] = useState(false);
  const [activeChart, setActiveChart] = useState<'timeline' | 'frequency' | 'heatmap'>('timeline');

  // ── Chat IA ──────────────────────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Base queries ─────────────────────────────────────────────────────────────
  const { data: meals = [] }    = trpc.meals.list.useQuery({ childId }, { enabled: childId > 0 });
  const { data: symptoms = [] } = trpc.symptoms.list.useQuery({ childId }, { enabled: childId > 0 });
  const { data: correlations = [] } = trpc.insights.detectCorrelations.useQuery({ childId }, { enabled: childId > 0, retry: false });

  // ── Chart queries ─────────────────────────────────────────────────────────────
  const { data: timeSeries = [], isLoading: tsLoading, isError: tsError, refetch: tsRefetch } = trpc.insights.getSymptomTimeSeries.useQuery(
    { childId, days: period },
    { enabled: childId > 0, retry: false }
  );
  const { data: frequency = [], isLoading: freqLoading, isError: freqError, refetch: freqRefetch } = trpc.insights.getSymptomFrequency.useQuery(
    { childId, days: period },
    { enabled: childId > 0, retry: false }
  );
  const { data: heatmap, isLoading: heatLoading, isError: heatError, refetch: heatRefetch } = trpc.insights.getMealSymptomHeatmap.useQuery(
    { childId, days: period },
    { enabled: childId > 0, retry: false }
  );

  // ── Subscription status ────────────────────────────────────────────────
  const { data: subStatus } = trpc.subscriptions.getStatus.useQuery();
  const isPremium = subStatus?.isPremium ?? false;
  // ── A  // ── AI mutation ────────────────────────────────────────────────
  const aiMutation = trpc.insights.analyzeWithAI.useMutation({
    onError: (err) => toast.error(err.message || t('Erreur IA', 'خطأ في الذكاء الاصطناعي', 'AI error')),
  });
  const aiResult = aiMutation.data;

  // ── Chat IA mutation ────────────────────────────────────────────────
  const chatMutation = trpc.insights.chat.useMutation({
    onSuccess: (data) => {
      setChatMessages(prev => [...prev, { role: 'assistant' as const, text: String(data.answer) }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    },
    onError: (err) => {
      setChatMessages(prev => [...prev, { role: 'assistant', text: t('Désolé, une erreur est survenue. Veuillez réessayer.', 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 'Sorry, an error occurred. Please try again.') }]);
    },
  });

  const handleChatSend = () => {
    const q = chatInput.trim();
    if (!isPremium) { toast.error(t('Fonctionnalité Premium — Abonnez-vous dans Paramètres', 'ميزة مميزة — اشترك من الإعدادات', 'Premium feature — Subscribe in Settings')); return; }
    if (!q || !childId || chatMutation.isPending) return;
    setChatMessages(prev => [...prev, { role: 'user', text: q }]);
    setChatInput('');
    chatMutation.mutate({ childId, question: q, language: language as 'ar' | 'fr' | 'en' });
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // ── Stat cards ────────────────────────────────────────────────────────────────
  const STAT_CARDS = [
    { value: meals.length,        label: t('Repas enregistrés', 'وجبات مسجلة', 'Meals logged'),           gradient: `linear-gradient(135deg, ${C.primary}, #0288D1)`,  shadow: 'rgba(79,195,247,0.4)',  emoji: '🍽️' },
    { value: symptoms.length,     label: t('Symptômes signalés', 'أعراض مبلغ عنها', 'Symptoms'),          gradient: `linear-gradient(135deg, ${C.secondary}, #E91E8C)`, shadow: 'rgba(244,143,177,0.4)', emoji: '🔔' },
    { value: correlations.length, label: t('Corrélations détectées', 'ارتباطات مكتشفة', 'Correlations'),  gradient: 'linear-gradient(135deg, #FFD54F, #FF8F00)',          shadow: 'rgba(255,213,79,0.4)', emoji: '🔗' },
    {
      value: symptoms.length > 0
        ? (Math.round(symptoms.reduce((acc, s) => acc + s.severity, 0) / symptoms.length * 10) / 10)
        : 0,
      label: t('Sévérité moyenne', 'متوسط الشدة', 'Avg severity'),
      gradient: `linear-gradient(135deg, #EF9A9A, ${C.danger})`,
      shadow: 'rgba(239,83,80,0.4)',
      emoji: '📊',
    },
  ];

  // ── Formatted time series labels ──────────────────────────────────────────────
  const formattedTimeSeries = useMemo(() => {
    const locale = isAr ? 'ar-DZ' : isFr ? 'fr-FR' : 'en-US';
    return timeSeries.map(d => ({
      ...d,
      label: new Date(d.date + 'T12:00:00Z').toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
    }));
  }, [timeSeries, language]);

  // ── Heatmap max value ─────────────────────────────────────────────────────────
  const heatMax = useMemo(() => {
    if (!heatmap) return 0;
    return Math.max(...heatmap.matrix.flatMap(row => row.values.map(v => v.count)));
  }, [heatmap]);

  // ── Chart tab config ──────────────────────────────────────────────────────────
  const chartTabs = [
    { key: 'timeline'  as const, icon: Activity,  label: t('Évolution', 'التطور', 'Timeline') },
    { key: 'frequency' as const, icon: BarChart2,  label: t('Fréquence', 'التكرار', 'Frequency') },
    { key: 'heatmap'   as const, icon: Grid3X3,    label: t('Heatmap',   'خريطة',   'Heatmap') },
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
            <button
              onClick={() => {
                if (!isPremium) { toast.error(t("Fonctionnalité Premium — Abonnez-vous dans Paramètres", 'ميزة مميزة — اشترك من الإعدادات', 'Premium feature — Subscribe in Settings')); return; }
                if (!childId) { toast.error(t("Sélectionnez un enfant d'abord", 'اختر طفلاً أولاً', 'Select a child first')); return; }
                aiMutation.mutate({ childId });
              }}
              disabled={aiMutation.isPending || !childId}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl backdrop-blur-sm text-white text-sm font-bold border transition-all active:scale-95 disabled:opacity-50"
              style={{ background: isPremium ? 'rgba(255,255,255,0.2)' : 'rgba(255,213,79,0.35)', borderColor: isPremium ? 'rgba(255,255,255,0.3)' : 'rgba(255,213,79,0.6)' }}
            >
              {aiMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : isPremium ? <Brain size={14} /> : <Crown size={14} />}
              {isPremium ? t('Analyse IA', 'تحليل الذكاء الاصطناعي', 'AI Analysis') : t('Premium', 'مميز', 'Premium')}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <Sparkles size={26} color="white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-extrabold leading-tight">{t('Insights IA', 'رؤى الذكاء الاصطناعي', 'AI Insights')}</h1>
              <p className="text-white/75 text-xs mt-0.5">{t('Analyse des données de santé', 'تحليل بيانات الصحة', 'Health data analysis')}</p>
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

        {/* ══════════════════════════════════════════════════════════════════════
            CHARTS SECTION
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="p-5 rounded-3xl bg-white space-y-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>

          {/* Chart header: tabs + period selector */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1">
              {chartTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveChart(tab.key)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={activeChart === tab.key
                      ? { background: `linear-gradient(135deg, #CE93D8, ${C.purple})`, color: 'white', boxShadow: '0 3px 10px rgba(142,36,170,0.3)' }
                      : { color: '#9CA3AF' }}
                  >
                    <Icon size={12} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <PeriodSelector value={period} onChange={setPeriod} isAr={isAr} isFr={isFr} />
          </div>

          {/* ── 1. Timeline (AreaChart) ── */}
          {activeChart === 'timeline' && (
            <>
              <p className="text-xs font-extrabold text-gray-700">
                📈 {t(`Évolution des symptômes — ${period} derniers jours`, `تطور الأعراض — آخر ${period} يوماً`, `Symptom evolution — last ${period} days`)}
              </p>
              {tsError ? (
                <div className="flex flex-col items-center py-6 gap-2">
                  <p className="text-xs text-red-500 font-semibold">{t('Erreur de chargement', 'خطأ في التحميل', 'Loading error')}</p>
                  <button onClick={() => tsRefetch()} className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}>{t('Réessayer', 'إعادة المحاولة', 'Retry')}</button>
                </div>
              ) : tsLoading ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Loader2 size={18} className="animate-spin" style={{ color: C.purple }} />
                  <span className="text-xs text-gray-400">{t('Chargement…', 'جارٍ التحميل…', 'Loading…')}</span>
                </div>
              ) : timeSeries.every(d => d.symptoms === 0 && d.meals === 0) ? (
                <div className="flex flex-col items-center py-8 gap-2 text-gray-400">
                  <TrendingUp size={28} className="opacity-40" />
                  <p className="text-xs text-center">{t('Aucune donnée pour cette période', 'لا توجد بيانات لهذه الفترة', 'No data for this period')}</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={formattedTimeSeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradSymptoms" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={C.secondary} stopOpacity={0.6} />
                          <stop offset="95%" stopColor={C.secondary} stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="gradSeverity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={C.danger} stopOpacity={0.5} />
                          <stop offset="95%" stopColor={C.danger} stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="gradMeals" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={C.primary} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={C.primary} stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#9CA3AF' }} interval={period === 7 ? 0 : period === 14 ? 1 : 4} />
                      <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} allowDecimals={false} />
                      <Tooltip content={<CustomAreaTooltip isAr={isAr} isFr={isFr} />} />
                      <Area type="monotone" dataKey="meals"       stroke={C.primary}   strokeWidth={2} fill="url(#gradMeals)"    dot={false} name="meals" />
                      <Area type="monotone" dataKey="symptoms"    stroke={C.secondary} strokeWidth={2} fill="url(#gradSymptoms)" dot={false} name="symptoms" />
                      <Area type="monotone" dataKey="avgSeverity" stroke={C.danger}    strokeWidth={1.5} fill="url(#gradSeverity)" dot={false} strokeDasharray="4 2" name="avgSeverity" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-4 justify-center flex-wrap">
                    {[
                      { color: C.primary,   label: t('Repas', 'وجبات', 'Meals') },
                      { color: C.secondary, label: t('Symptômes', 'أعراض', 'Symptoms') },
                      { color: C.danger,    label: t('Sévérité moy.', 'متوسط الشدة', 'Avg severity'), dashed: true },
                    ].map((l, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="w-6 h-0.5 rounded" style={{ background: l.color, borderTop: l.dashed ? `2px dashed ${l.color}` : undefined }} />
                        <span className="text-[10px] text-gray-500">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── 2. Frequency (BarChart) ── */}
          {activeChart === 'frequency' && (
            <>
              <p className="text-xs font-extrabold text-gray-700">
                📊 {t(`Fréquence par type de symptôme — ${period}j`, `تكرار الأعراض حسب النوع — ${period} يوماً`, `Symptom frequency by type — ${period}d`)}
              </p>
              {freqError ? (
                <div className="flex flex-col items-center py-6 gap-2">
                  <p className="text-xs text-red-500 font-semibold">{t('Erreur de chargement', 'خطأ في التحميل', 'Loading error')}</p>
                  <button onClick={() => freqRefetch()} className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}>{t('Réessayer', 'إعادة المحاولة', 'Retry')}</button>
                </div>
              ) : freqLoading ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Loader2 size={18} className="animate-spin" style={{ color: C.purple }} />
                </div>
              ) : frequency.length === 0 ? (
                <div className="flex flex-col items-center py-8 gap-2 text-gray-400">
                  <BarChart2 size={28} className="opacity-40" />
                  <p className="text-xs text-center">{t('Aucun symptôme enregistré', 'لا توجد أعراض مسجلة', 'No symptoms recorded')}</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={Math.max(160, frequency.length * 36)}>
                    <BarChart data={frequency} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 9, fill: '#9CA3AF' }} allowDecimals={false} />
                      <YAxis type="category" dataKey="type" tick={{ fontSize: 9, fill: '#6B7280' }} width={80} />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                        formatter={(value: number, name: string) => [
                          value,
                          name === 'count'
                            ? t('Occurrences', 'مرات', 'Occurrences')
                            : t('Sévérité moy.', 'متوسط الشدة', 'Avg severity'),
                        ]}
                      />
                      <Bar dataKey="count"       name="count"       fill={C.secondary} radius={[0, 6, 6, 0]} />
                      <Bar dataKey="avgSeverity" name="avgSeverity" fill={C.danger}    radius={[0, 6, 6, 0]} opacity={0.7} />
                      <Legend
                        formatter={(v) => v === 'count'
                          ? t('Occurrences', 'مرات', 'Occurrences')
                          : t('Sévérité moy.', 'متوسط الشدة', 'Avg severity')}
                        wrapperStyle={{ fontSize: 10 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </>
          )}

          {/* ── 3. Heatmap ── */}
          {activeChart === 'heatmap' && (
            <>
              <p className="text-xs font-extrabold text-gray-700">
                🗺️ {t(`Aliment × Symptôme — ${period}j`, `الطعام × الأعراض — ${period} يوماً`, `Food × Symptom — ${period}d`)}
              </p>
              <p className="text-[10px] text-gray-400">
                {t('Intensité des co-occurrences dans les 4h suivant un repas', 'شدة التزامن خلال 4 ساعات بعد الوجبة', 'Co-occurrence intensity within 4h after a meal')}
              </p>
              {heatError ? (
                <div className="flex flex-col items-center py-6 gap-2">
                  <p className="text-xs text-red-500 font-semibold">{t('Erreur de chargement', 'خطأ في التحميل', 'Loading error')}</p>
                  <button onClick={() => heatRefetch()} className="px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}>{t('Réessayer', 'إعادة المحاولة', 'Retry')}</button>
                </div>
              ) : heatLoading ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Loader2 size={18} className="animate-spin" style={{ color: C.purple }} />
                </div>
              ) : !heatmap || heatmap.foods.length === 0 ? (
                <div className="flex flex-col items-center py-8 gap-2 text-gray-400">
                  <Grid3X3 size={28} className="opacity-40" />
                  <p className="text-xs text-center">{t('Pas assez de données pour la heatmap', 'بيانات غير كافية للخريطة', 'Not enough data for heatmap')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[9px]" style={{ borderCollapse: 'separate', borderSpacing: 2 }}>
                    <thead>
                      <tr>
                        <th className="text-left text-gray-400 font-semibold pb-1 pr-2" style={{ minWidth: 60 }}>
                          {t('Aliment ↓ / Symptôme →', 'طعام ↓ / عرض →', 'Food ↓ / Symptom →')}
                        </th>
                        {heatmap.symptoms.map((s, i) => (
                          <th key={i} className="text-center font-semibold text-gray-600 pb-1 px-1" style={{ minWidth: 44 }}>
                            {s.length > 8 ? s.slice(0, 7) + '…' : s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {heatmap.matrix.map((row, ri) => (
                        <tr key={ri}>
                          <td className="text-gray-600 font-semibold pr-2 py-0.5" style={{ maxWidth: 60 }}>
                            {row.food.length > 9 ? row.food.slice(0, 8) + '…' : row.food}
                          </td>
                          {row.values.map((cell, ci) => (
                            <td key={ci} className="text-center py-0.5 px-0.5">
                              <div
                                className="w-full rounded-lg flex items-center justify-center font-bold"
                                style={{
                                  background: heatColor(cell.count, heatMax),
                                  height: 28,
                                  color: cell.count > 0 ? '#374151' : '#D1D5DB',
                                  fontSize: 10,
                                }}
                              >
                                {cell.count > 0 ? cell.count : '·'}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Legend */}
                  <div className="flex items-center gap-2 mt-3 justify-end flex-wrap">
                    {[
                      { color: '#E8F5E9', label: t('Faible', 'منخفض', 'Low') },
                      { color: '#FFD54F', label: t('Modéré', 'متوسط', 'Moderate') },
                      { color: '#FFA726', label: t('Élevé', 'عالٍ', 'High') },
                      { color: '#EF5350', label: t('Critique', 'حرج', 'Critical') },
                    ].map((l, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded" style={{ background: l.color, border: '1px solid #E5E7EB' }} />
                        <span className="text-[9px] text-gray-500">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Correlations ── */}
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
              {t('Sélectionnez un enfant', 'اختر طفلاً', 'Select a child')}
            </p>
          ) : correlations.length === 0 ? (
            <div className="flex flex-col items-center py-5 gap-2">
              <CheckCircle size={28} style={{ color: C.success }} />
              <p className="text-xs text-gray-500 text-center">
                {t(`Aucune corrélation (seuil : 3 occurrences)`, `لا ارتباط (الحد: 3 مرات)`, `No correlation yet (threshold: 3×)`)}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {correlations.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{
                    background: c.avgSeverity >= 7 ? '#FFEBEE' : c.avgSeverity >= 4 ? '#FFF8E1' : '#E8F5E9',
                    border: `1px solid ${c.avgSeverity >= 7 ? '#FFCDD2' : c.avgSeverity >= 4 ? '#FFE082' : '#C8E6C9'}`,
                  }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                    style={{ background: c.avgSeverity >= 7 ? C.danger : c.avgSeverity >= 4 ? C.warning : C.success }}>
                    {c.count}×
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      🍽️ <span style={{ color: '#0288D1' }}>{c.food}</span>{' → '}🔴 <span style={{ color: C.danger }}>{c.symptom}</span>
                    </p>
                    <p className="text-[10px] text-gray-500">{t(`Sév. moy. ${c.avgSeverity}/10`, `متوسط الشدة ${c.avgSeverity}/10`, `Avg severity ${c.avgSeverity}/10`)}</p>
                  </div>
                  <AlertTriangle size={14} style={{ color: c.avgSeverity >= 7 ? C.danger : C.warning, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── AI Loading ── */}
        {aiMutation.isPending && (
          <div className="p-6 rounded-3xl bg-white flex flex-col items-center gap-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}>
              <Loader2 size={28} color="white" className="animate-spin" />
            </div>
            <p className="text-sm font-semibold text-gray-500">{t('Analyse IA en cours…', 'جارٍ التحليل…', 'AI analysis in progress…')}</p>
            <p className="text-xs text-gray-400 text-center">{t('10 à 20 secondes', '10 إلى 20 ثانية', '10–20 seconds')}</p>
          </div>
        )}

        {/* ── AI Result ── */}
        {aiResult && !aiMutation.isPending && (
          <div className="p-5 rounded-3xl bg-white space-y-4" style={{ boxShadow: '0 4px 20px rgba(142,36,170,0.12)', border: '2px solid #E1BEE7' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}>
                <Brain size={16} color="white" />
              </div>
              <p className="text-sm font-extrabold text-gray-800">{t('Rapport IA personnalisé', 'تقرير الذكاء الاصطناعي', 'Personalized AI Report')}</p>
            </div>

            <RiskBadge level={aiResult.riskLevel} isAr={isAr} isFr={isFr} />

            {aiResult.summary && (
              <div className="px-3 py-2.5 rounded-2xl" style={{ background: '#F3E5F5', border: '1px solid #E1BEE7' }}>
                <p className="text-xs text-purple-800 leading-relaxed font-medium">{aiResult.summary}</p>
              </div>
            )}

            {aiResult.suspectFood && aiResult.suspectFood !== 'Aucun' && aiResult.suspectFood !== 'None' && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-1">🚨 {t('Aliment le plus suspect', 'الطعام الأكثر اشتباهاً', 'Most suspect food')}</p>
                <div className="px-3 py-2 rounded-2xl" style={{ background: '#FFEBEE', border: '1px solid #FFCDD2' }}>
                  <p className="text-sm font-extrabold" style={{ color: C.danger }}>{aiResult.suspectFood}</p>
                  <p className="text-[10px] text-gray-500 mb-1">{t('Niveau de confiance', 'مستوى الثقة', 'Confidence level')}</p>
                  <ConfidenceBar value={Math.round(aiResult.suspectFoodConfidence)} />
                </div>
              </div>
            )}

            {aiResult.mainSymptoms && aiResult.mainSymptoms.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-700 mb-2">🔴 {t('Principaux symptômes', 'الأعراض الرئيسية', 'Main symptoms')}</p>
                <div className="flex flex-wrap gap-2">
                  {aiResult.mainSymptoms.map((s: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: '#FFF8E1', color: '#E65100', border: '1px solid #FFE082' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {(aiResult.adviceAr || aiResult.adviceFr || aiResult.adviceEn) && (
              <div>
                <button onClick={() => setShowAdvice(!showAdvice)} className="flex items-center gap-1 text-xs font-bold" style={{ color: C.purple }}>
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

        {/* ── No child ── */}
        {!childId && (
          <div className="p-6 rounded-3xl bg-white flex flex-col items-center gap-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
            <Sparkles size={32} style={{ color: C.purple, opacity: 0.5 }} />
            <p className="text-sm text-gray-400 text-center">{t('Sélectionnez un enfant pour voir les insights', 'اختر طفلاً لرؤية التحليلات', 'Select a child to see insights')}</p>
          </div>
        )}

        {/* ── General Tips ── */}
        <div className="space-y-3">
          <p className="text-sm font-extrabold text-gray-800">{t('Conseils généraux', 'نصائح عامة', 'General Tips')}</p>
          {[
            { icon: CheckCircle, gradient: 'linear-gradient(135deg, #A5D6A7, #388E3C)', shadow: 'rgba(165,214,167,0.4)', title: t('Alimentation équilibrée', 'غذاء متوازن', 'Balanced Diet'), desc: t('Assurez un mélange de fruits, légumes et protéines chaque jour.', 'احرص على تنوع الفواكه والخضروات والبروتينات يومياً.', 'Ensure a mix of fruits, vegetables, and proteins daily.') },
            { icon: TrendingUp,  gradient: 'linear-gradient(135deg, #90CAF9, #1565C0)', shadow: 'rgba(144,202,249,0.4)', title: t('Suivi régulier', 'المتابعة المنتظمة', 'Regular Monitoring'), desc: t('Enregistrez les repas et symptômes quotidiennement pour de meilleures analyses.', 'سجل الوجبات والأعراض يومياً لتحليلات أفضل.', 'Log meals and symptoms daily for better analysis.') },
            { icon: AlertTriangle, gradient: 'linear-gradient(135deg, #FFCC80, #E65100)', shadow: 'rgba(255,204,128,0.4)', title: t('Consultez un médecin', 'استشر طبيباً', 'Consult a Doctor'), desc: t('En cas de symptômes persistants, consultez toujours un pédiatre.', 'في حالة الأعراض المستمرة، استشر دائماً طبيب الأطفال.', 'For persistent symptoms, always consult a pediatrician.') },
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

        {/* ── Chat IA ── */}
        <div className="p-5 rounded-3xl bg-white space-y-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${C.primary}, #0288D1)`, boxShadow: `0 4px 12px rgba(79,195,247,0.4)` }}>
              <Brain size={18} color="white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-800">
                {isAr ? 'اسأل الذكاء الاصطناعي' : isFr ? 'Poser une question à l\'IA' : 'Ask the AI'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isAr ? 'اسأل عن بيانات طفلك بلغتك الخاصة' : isFr ? 'Posez des questions sur les données de votre enfant' : 'Ask questions about your child\'s data'}
              </p>
            </div>
          </div>

          {/* Messages */}
          {chatMessages.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={msg.role === 'user'
                      ? { background: `linear-gradient(135deg, ${C.primary}, #0288D1)`, color: 'white', borderBottomRightRadius: '6px' }
                      : { background: '#F8FAFC', color: '#374151', border: '1px solid #E2E8F0', borderBottomLeftRadius: '6px' }}
                    dir={isAr ? 'rtl' : 'ltr'}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl text-sm" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Suggested questions */}
          {chatMessages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {[
                isAr ? 'ما هي الأطعمة التي تسبب أكثر الأعراض؟' : isFr ? 'Quels aliments causent le plus de symptômes ?' : 'Which foods cause the most symptoms?',
                isAr ? 'هل هناك نمط متكرر في الأعراض؟' : isFr ? 'Y a-t-il un schéma récurrent dans les symptômes ?' : 'Is there a recurring symptom pattern?',
                isAr ? 'ما هي الأعراض الأكثر شيوعاً؟' : isFr ? 'Quels sont les symptômes les plus fréquents ?' : 'What are the most common symptoms?',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setChatInput(q); }}
                  className="text-xs px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
                  style={{ background: '#F0F9FF', border: `1px solid ${C.primary}`, color: '#0288D1' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder={isAr ? 'اكتب سؤالك هنا...' : isFr ? 'Écrivez votre question ici...' : 'Type your question here...'}
              disabled={chatMutation.isPending || !childId}
              className="flex-1 text-sm px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-300 transition-colors disabled:opacity-50"
              dir={isAr ? 'rtl' : 'ltr'}
            />
            <button
              onClick={handleChatSend}
              disabled={!chatInput.trim() || chatMutation.isPending || !childId}
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${C.primary}, #0288D1)`, boxShadow: `0 4px 12px rgba(79,195,247,0.4)` }}
            >
              {chatMutation.isPending
                ? <Loader2 size={16} color="white" className="animate-spin" />
                : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              }
            </button>
          </div>
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
