import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import {
  Apple, AlertCircle, TrendingUp, Stethoscope, Activity,
  Syringe, Sun, Crown, Bell, ChevronRight, Heart, Shield,
  Baby, Plus
} from 'lucide-react';

const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');

  const { data: unreadCount } = trpc.notifications.unreadCount.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const QUICK_ACTIONS = [
    { icon: Apple,       label: t('actionTrackMeal'),   bg: 'bg-sky-100',    iconColor: 'text-sky-600',    path: '/meals' },
    { icon: Activity,    label: language==='fr'?'Symptômes':language==='ar'?'الأعراض':'Symptoms', bg: 'bg-pink-100', iconColor: 'text-pink-600', path: '/symptoms' },
    { icon: TrendingUp,  label: t('actionAiInsights'),  bg: 'bg-purple-100', iconColor: 'text-purple-600', path: '/insights' },
    { icon: AlertCircle, label: t('actionEmergency'),   bg: 'bg-red-100',    iconColor: 'text-red-600',    path: '/emergency' },
    { icon: Stethoscope, label: t('actionDoctor'),      bg: 'bg-indigo-100', iconColor: 'text-indigo-600', path: '/doctor' },
    { icon: Syringe,     label: t('actionVaccines'),    bg: 'bg-teal-100',   iconColor: 'text-teal-600',   path: '/vaccines' },
    { icon: Activity,    label: language==='fr'?'Croissance':language==='ar'?'النمو':'Growth', bg: 'bg-orange-100', iconColor: 'text-orange-600', path: '/growth' },
    { icon: Sun,         label: language==='fr'?'Bilan du jour':language==='ar'?'بيلان اليوم':'Daily Check-in', bg: 'bg-yellow-100', iconColor: 'text-yellow-600', path: '/daily-checkin' },
  ];

  const STATS = [
    { label: language==='fr'?'Repas ce mois':language==='ar'?'وجبات هذا الشهر':'Meals this month', value: '24', icon: Apple, color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: language==='fr'?'Jours sans symptôme':language==='ar'?'أيام بدون أعراض':'Days symptom-free', value: '5', icon: Shield, color: 'text-green-500', bg: 'bg-green-50' },
    { label: language==='fr'?'Alertes actives':language==='ar'?'تنبيهات نشطة':'Active alerts', value: '2', icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
    { label: language==='fr'?'Vaccins à jour':language==='ar'?'اللقاحات محدثة':'Vaccines up to date', value: '8', icon: Syringe, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* ── Header ── */}
      <div className="page-header-gradient px-4 pt-10 pb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="AlleNest" className="w-11 h-11 rounded-full object-cover shadow-md border-2 border-white/60" />
              <div>
                <p className="text-white/80 text-xs font-medium">AlleNest · Child Safety AI</p>
                <h1 className="text-white text-lg font-bold leading-tight">
                  {greeting}, {user?.name?.split(' ')[0] || 'Parent'} 👋
                </h1>
              </div>
            </div>
            <button
              onClick={() => setLocation('/notifications')}
              className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount && unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center shadow">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </button>
          </div>
          {/* Signature */}
          <p className="text-white/70 text-xs italic mt-2 font-medium">
            {language === 'ar' ? '✨ لأن كل بكاء طفلك له سبب' : language === 'fr' ? '✨ Parce que chaque pleur de votre enfant a une cause' : '✨ Because every cry of your child has a cause'}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-3 space-y-5">

        {/* ── Alert Banner ── */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-red-700">
              {language === 'fr' ? 'Allergène détecté' : language === 'ar' ? 'تم اكتشاف مسبب حساسية' : 'Allergen Detected'}
            </p>
            <p className="text-xs text-red-500 mt-0.5">
              {language === 'fr' ? 'Lait détecté dans le dernier repas enregistré' : language === 'ar' ? 'تم اكتشاف الحليب في آخر وجبة مسجلة' : 'Milk detected in last logged meal'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="stat-card flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-extrabold text-foreground leading-tight">{s.value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight truncate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <div className="section-header">
            <h2 className="section-title">
              {language === 'fr' ? 'Actions rapides' : language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.path}
                onClick={() => setLocation(action.path)}
                className="quick-action-card"
              >
                <div className={`quick-action-icon ${action.bg}`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Premium Banner ── */}
        <div
          className="card-blue p-4 flex items-center gap-4 cursor-pointer"
          onClick={() => setLocation('/premium')}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">
              {language === 'fr' ? 'Passer à Premium' : language === 'ar' ? 'الترقية إلى المميز' : 'Upgrade to Premium'}
            </p>
            <p className="text-white/80 text-xs mt-0.5">
              {language === 'fr' ? 'Analyses IA avancées, rapports PDF illimités' : language === 'ar' ? 'تحليلات ذكاء اصطناعي متقدمة، تقارير PDF غير محدودة' : 'Advanced AI analysis, unlimited PDF reports'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 flex-shrink-0" />
        </div>

        {/* ── Recent Activity ── */}
        <div>
          <div className="section-header">
            <h2 className="section-title">
              {language === 'fr' ? 'Activité récente' : language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </h2>
            <button onClick={() => setLocation('/timeline')} className="section-link">
              {language === 'fr' ? 'Voir tout' : language === 'ar' ? 'عرض الكل' : 'See all'}
            </button>
          </div>
          <div className="space-y-2">
            {[
              { icon: Apple, color: 'bg-sky-100 text-sky-600', title: language==='fr'?'Repas enregistré':language==='ar'?'وجبة مسجلة':'Meal logged', sub: language==='fr'?'Lait, Blé, Œufs':language==='ar'?'حليب، قمح، بيض':'Milk, Wheat, Eggs', time: '10:30', dot: 'bg-sky-400' },
              { icon: Activity, color: 'bg-pink-100 text-pink-600', title: language==='fr'?'Symptôme signalé':language==='ar'?'عرض مُبلَّغ عنه':'Symptom reported', sub: language==='fr'?'Éruption cutanée – Modéré':language==='ar'?'طفح جلدي – متوسط':'Skin rash – Moderate', time: '08:15', dot: 'bg-pink-400' },
              { icon: Shield, color: 'bg-green-100 text-green-600', title: language==='fr'?'Aucun symptôme':language==='ar'?'لا أعراض':'No symptoms', sub: language==='fr'?'Journée calme 🎉':language==='ar'?'يوم هادئ 🎉':'Calm day 🎉', time: language==='fr'?'Hier':language==='ar'?'أمس':'Yesterday', dot: 'bg-green-400' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 flex items-center gap-3 border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Add Child Button ── */}
        <button
          onClick={() => setLocation('/child-profile-setup')}
          className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary font-semibold text-sm transition-all hover:border-primary/50 hover:bg-primary/10"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          {language === 'fr' ? 'Ajouter un enfant' : language === 'ar' ? 'إضافة طفل' : 'Add a child'}
        </button>

      </div>
    </div>
  );
}
