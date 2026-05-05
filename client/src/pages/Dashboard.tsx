import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import {
  Apple, AlertCircle, TrendingUp, Stethoscope, Activity,
  Syringe, Sun, Crown, Bell, ChevronRight, Shield,
  Plus, Calendar, Camera
} from 'lucide-react';

const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';

function NextAppointmentWidget() {
  const { language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();
  const childId = selectedChild?.id ?? 0;

  const { data: nextAppt } = trpc.appointments.getNext.useQuery(
    { childId },
    { enabled: childId > 0, retry: false }
  );

  if (!nextAppt) return null;

  const apptDate = new Date(nextAppt.appointmentDate);
  const diffDays = Math.ceil((apptDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const dateStr = apptDate.toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = apptDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <button
      className="w-full flex items-center gap-4 p-4 rounded-3xl text-white transition-all active:scale-[0.98]"
      onClick={() => setLocation('/appointments')}
      style={{
        background: 'linear-gradient(135deg, #26C6DA 0%, #00ACC1 100%)',
        boxShadow: '0 8px 24px rgba(38,198,218,0.35)',
      }}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <Calendar className="w-7 h-7 text-white" />
      </div>
      <div className="flex-1 min-w-0 text-start">
        <p className="text-white/80 text-xs font-medium">
          {language === 'fr' ? 'Prochain rendez-vous' : language === 'ar' ? 'الموعد القادم' : 'Next Appointment'}
          {diffDays === 0 ? ` — ${language === 'fr' ? "Aujourd'hui" : language === 'ar' ? 'اليوم' : 'Today'}` :
           diffDays === 1 ? ` — ${language === 'fr' ? 'Demain' : language === 'ar' ? 'غداً' : 'Tomorrow'}` :
           ` — ${language === 'fr' ? `Dans ${diffDays}j` : language === 'ar' ? `بعد ${diffDays} أيام` : `In ${diffDays}d`}`}
        </p>
        <p className="text-white font-bold text-sm truncate">{nextAppt.doctorName}</p>
        <p className="text-white/80 text-xs">{dateStr} · {timeStr}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-white/80 flex-shrink-0" />
    </button>
  );
}

function ChildAvatar({ size = 52 }: { size?: number }) {
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();

  if (!selectedChild) return null;

  const isGirl = selectedChild.gender === 'girl';
  const gradient = isGirl
    ? 'linear-gradient(135deg, #F8BBD0 0%, #F48FB1 100%)'
    : 'linear-gradient(135deg, #B3E5FC 0%, #4FC3F7 100%)';

  return (
    <button
      onClick={() => setLocation('/child-select')}
      className="relative flex-shrink-0"
      title={selectedChild.name}
    >
      {selectedChild.photoUrl ? (
        <img
          src={selectedChild.photoUrl}
          alt={selectedChild.name}
          className="rounded-full object-cover border-3 border-white/60 shadow-md"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center border-3 border-white/60 shadow-md"
          style={{ width: size, height: size, background: gradient, fontSize: size * 0.45 }}
        >
          {isGirl ? '👧' : '👦'}
        </div>
      )}
      <div
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow"
        style={{ border: '1.5px solid #E0E0E0' }}
      >
        <Camera size={10} color="#0288D1" />
      </div>
    </button>
  );
}

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');

  const { data: unreadCount } = trpc.notifications.unreadCount.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const QUICK_ACTIONS = [
    {
      icon: Apple, label: t('actionTrackMeal'), path: '/meals',
      gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
      shadow: 'rgba(79,195,247,0.45)',
    },
    {
      icon: Activity, label: isAr ? 'الأعراض' : isFr ? 'Symptômes' : 'Symptoms', path: '/symptoms',
      gradient: 'linear-gradient(135deg, #F48FB1, #E91E8C)',
      shadow: 'rgba(244,143,177,0.45)',
    },
    {
      icon: TrendingUp, label: t('actionAiInsights'), path: '/insights',
      gradient: 'linear-gradient(135deg, #CE93D8, #8E24AA)',
      shadow: 'rgba(206,147,216,0.45)',
    },
    {
      icon: AlertCircle, label: t('actionEmergency'), path: '/emergency',
      gradient: 'linear-gradient(135deg, #EF9A9A, #E53935)',
      shadow: 'rgba(239,83,80,0.45)',
    },
    {
      icon: Stethoscope, label: t('actionDoctor'), path: '/doctor',
      gradient: 'linear-gradient(135deg, #9FA8DA, #3949AB)',
      shadow: 'rgba(159,168,218,0.45)',
    },
    {
      icon: Syringe, label: t('actionVaccines'), path: '/vaccines',
      gradient: 'linear-gradient(135deg, #80DEEA, #00838F)',
      shadow: 'rgba(128,222,234,0.45)',
    },
    {
      icon: Activity, label: isAr ? 'النمو' : isFr ? 'Croissance' : 'Growth', path: '/growth',
      gradient: 'linear-gradient(135deg, #FFCC80, #EF6C00)',
      shadow: 'rgba(255,204,128,0.45)',
    },
    {
      icon: Sun, label: isAr ? 'بيلان اليوم' : isFr ? 'Bilan du jour' : 'Daily Check-in', path: '/daily-checkin',
      gradient: 'linear-gradient(135deg, #FFF176, #F9A825)',
      shadow: 'rgba(255,241,118,0.45)',
    },
    {
      icon: Calendar, label: isAr ? 'المواعيد' : isFr ? 'Rendez-vous' : 'Appointments', path: '/appointments',
      gradient: 'linear-gradient(135deg, #80CBC4, #00695C)',
      shadow: 'rgba(128,203,196,0.45)',
    },
  ];

  const STATS = [
    { label: isAr ? 'وجبات هذا الشهر' : isFr ? 'Repas ce mois' : 'Meals this month', value: '24', icon: Apple, gradient: 'linear-gradient(135deg, #B3E5FC, #4FC3F7)', shadow: 'rgba(79,195,247,0.3)' },
    { label: isAr ? 'أيام بدون أعراض' : isFr ? 'Jours sans symptôme' : 'Symptom-free days', value: '5', icon: Shield, gradient: 'linear-gradient(135deg, #C8E6C9, #43A047)', shadow: 'rgba(102,187,106,0.3)' },
    { label: isAr ? 'تنبيهات نشطة' : isFr ? 'Alertes actives' : 'Active alerts', value: '2', icon: Bell, gradient: 'linear-gradient(135deg, #FFCDD2, #E53935)', shadow: 'rgba(239,83,80,0.3)' },
    { label: isAr ? 'لقاحات محدثة' : isFr ? 'Vaccins à jour' : 'Vaccines up to date', value: '8', icon: Syringe, gradient: 'linear-gradient(135deg, #E1BEE7, #8E24AA)', shadow: 'rgba(171,71,188,0.3)' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}>

      {/* ── Header ── */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-8"
        style={{
          background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 50%, #81D4FA 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 8px 32px rgba(79,195,247,0.35)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-10 pointer-events-none" style={{ background: 'white', transform: 'translate(-30%, 40%)' }} />

        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="AlleNest" className="w-11 h-11 rounded-full object-cover shadow-md border-2 border-white/60" />
              <div>
                <p className="text-white/75 text-xs font-semibold tracking-wide">AlleNest</p>
                <h1 className="text-white text-lg font-extrabold leading-tight">
                  {greeting}, {user?.name?.split(' ')[0] || 'Parent'} 👋
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Child avatar */}
              <ChildAvatar size={46} />
              {/* Notifications */}
              <button
                onClick={() => setLocation('/notifications')}
                className="relative w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"
              >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount && unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center px-1 shadow">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {/* Selected child name */}
          {selectedChild && (
            <div className="mt-3 flex items-center gap-2">
              <div className="bg-white/20 rounded-full px-3 py-1 flex items-center gap-1.5">
                <span className="text-white/90 text-xs font-semibold">
                  {isAr ? `طفلك: ${selectedChild.name}` : isFr ? `Votre enfant : ${selectedChild.name}` : `Your child: ${selectedChild.name}`}
                </span>
              </div>
            </div>
          )}

          {/* Signature */}
          <p className="text-white/70 text-xs italic mt-2 font-medium">
            {isAr ? '✨ لأن كل بكاء طفلك له سبب' : isFr ? '✨ Parce que chaque pleur de votre enfant a une cause' : '✨ Because every cry of your child has a cause'}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-5">

        {/* ── Alert Banner ── */}
        <div
          className="flex items-start gap-3 p-4 rounded-3xl cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', border: '1.5px solid #FFCDD2', boxShadow: '0 4px 16px rgba(239,83,80,0.12)' }}
          onClick={() => setLocation('/symptoms')}
        >
          <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center flex-shrink-0 shadow-sm" style={{ boxShadow: '0 4px 12px rgba(239,83,80,0.4)' }}>
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-red-700">
              {isAr ? 'تم اكتشاف مسبب حساسية' : isFr ? 'Allergène détecté' : 'Allergen Detected'}
            </p>
            <p className="text-xs text-red-500 mt-0.5">
              {isAr ? 'تم اكتشاف الحليب في آخر وجبة مسجلة' : isFr ? 'Lait détecté dans le dernier repas enregistré' : 'Milk detected in last logged meal'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 p-4 rounded-3xl bg-white"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.gradient, boxShadow: `0 4px 12px ${s.shadow}` }}
              >
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-extrabold text-gray-800 leading-tight">{s.value}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-gray-800">
              {isAr ? 'إجراءات سريعة' : isFr ? 'Actions rapides' : 'Quick Actions'}
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.path}
                onClick={() => setLocation(action.path)}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-3xl bg-white transition-all active:scale-95"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: action.gradient, boxShadow: `0 4px 12px ${action.shadow}` }}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-gray-600 text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Prochain RDV Widget ── */}
        <NextAppointmentWidget />

        {/* ── Premium Banner ── */}
        <button
          className="w-full flex items-center gap-4 p-4 rounded-3xl text-white transition-all active:scale-[0.98]"
          onClick={() => setLocation('/premium')}
          style={{
            background: 'linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%)',
            boxShadow: '0 8px 24px rgba(79,195,247,0.4)',
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-start">
            <p className="text-white font-extrabold text-sm">
              {isAr ? 'الترقية إلى المميز' : isFr ? 'Passer à Premium' : 'Upgrade to Premium'}
            </p>
            <p className="text-white/80 text-xs mt-0.5">
              {isAr ? 'تحليلات ذكاء اصطناعي متقدمة، تقارير PDF غير محدودة' : isFr ? 'Analyses IA avancées, rapports PDF illimités' : 'Advanced AI analysis, unlimited PDF reports'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 flex-shrink-0" />
        </button>

        {/* ── Recent Activity ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold text-gray-800">
              {isAr ? 'النشاط الأخير' : isFr ? 'Activité récente' : 'Recent Activity'}
            </h2>
            <button onClick={() => setLocation('/timeline')} className="text-xs font-semibold text-sky-500">
              {isAr ? 'عرض الكل' : isFr ? 'Voir tout' : 'See all'}
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              {
                icon: Apple,
                gradient: 'linear-gradient(135deg, #B3E5FC, #4FC3F7)',
                title: isAr ? 'وجبة مسجلة' : isFr ? 'Repas enregistré' : 'Meal logged',
                sub: isAr ? 'حليب، قمح، بيض' : isFr ? 'Lait, Blé, Œufs' : 'Milk, Wheat, Eggs',
                time: '10:30',
              },
              {
                icon: Activity,
                gradient: 'linear-gradient(135deg, #F8BBD0, #F48FB1)',
                title: isAr ? 'عرض مُبلَّغ عنه' : isFr ? 'Symptôme signalé' : 'Symptom reported',
                sub: isAr ? 'طفح جلدي – متوسط' : isFr ? 'Éruption cutanée – Modéré' : 'Skin rash – Moderate',
                time: '08:15',
              },
              {
                icon: Shield,
                gradient: 'linear-gradient(135deg, #C8E6C9, #66BB6A)',
                title: isAr ? 'لا أعراض' : isFr ? 'Aucun symptôme' : 'No symptoms',
                sub: isAr ? 'يوم هادئ 🎉' : isFr ? 'Journée calme 🎉' : 'Calm day 🎉',
                time: isAr ? 'أمس' : isFr ? 'Hier' : 'Yesterday',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 rounded-3xl bg-white"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: item.gradient }}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 truncate">{item.sub}</p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Add Child Button ── */}
        <button
          onClick={() => setLocation('/setup')}
          className="w-full flex items-center gap-3 p-4 rounded-3xl transition-all active:scale-[0.98]"
          style={{ border: '2px dashed #B3E5FC', background: '#F0FAFF' }}
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #B3E5FC, #4FC3F7)' }}
          >
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-bold text-sky-600">
            {isAr ? 'إضافة طفل' : isFr ? 'Ajouter un enfant' : 'Add a child'}
          </span>
        </button>

        {/* ── Disclaimer médical ── */}
        <div
          className="flex items-start gap-2 px-4 py-3 rounded-2xl"
          style={{ background: '#FFFDE7', border: '1px solid #FFF176' }}
        >
          <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            {isAr
              ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية المتخصصة. استشر دائماً طبيباً لأي مشكلة صحية.'
              : isFr
              ? "Cette application est une aide, pas un remplacement d'un avis médical. Consultez toujours un médecin pour tout problème de santé."
              : 'This app is a health aid tool, not a replacement for professional medical advice. Always consult a doctor for any health concern.'}
          </p>
        </div>

      </div>
    </div>
  );
}
