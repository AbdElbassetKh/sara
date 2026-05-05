import { Card } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Insights() {
  const { t, language } = useLanguage();

  const INSIGHTS = [
    {
      id: 1,
      type: 'warning',
      icon: AlertTriangle,
      title: language === 'fr' ? 'Schéma allergène potentiel' : language === 'ar' ? 'نمط مسبب حساسية محتمل' : 'Potential Allergen Pattern',
      description: language === 'fr'
        ? 'Des symptômes de rash apparaissent 2-3h après les produits laitiers. Envisagez de limiter le lait.'
        : language === 'ar'
        ? 'تظهر أعراض الطفح الجلدي بعد 2-3 ساعات من منتجات الألبان. فكر في تقليل الحليب.'
        : 'Rash symptoms appear 2-3 hours after dairy products. Consider limiting milk intake.',
      severity: 'high',
      color: 'text-red-600',
    },
    {
      id: 2,
      type: 'insight',
      icon: Lightbulb,
      title: language === 'fr' ? 'Recommandation nutritionnelle' : language === 'ar' ? 'توصية غذائية' : 'Nutrition Recommendation',
      description: language === 'fr'
        ? 'Votre enfant reçoit suffisamment de protéines. Ajoutez des aliments riches en fer comme les épinards.'
        : language === 'ar'
        ? 'طفلك يحصل على بروتين كافٍ. فكر في إضافة أطعمة غنية بالحديد مثل السبانخ.'
        : 'Your child is getting adequate protein. Consider adding more iron-rich foods like spinach.',
      severity: 'medium',
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'positive',
      icon: CheckCircle,
      title: language === 'fr' ? 'Croissance dans les normes' : language === 'ar' ? 'النمو ضمن المعدل الطبيعي' : 'Growth on Track',
      description: language === 'fr'
        ? 'Les mesures de croissance sont dans les percentiles normaux pour l\'âge. Bravo !'
        : language === 'ar'
        ? 'قياسات النمو ضمن النسب المئوية الطبيعية للعمر. عمل رائع!'
        : 'Growth measurements are within normal percentiles for age. Great job!',
      severity: 'low',
      color: 'text-green-600',
    },
    {
      id: 4,
      type: 'insight',
      icon: TrendingUp,
      title: language === 'fr' ? 'Tendance des symptômes' : language === 'ar' ? 'اتجاه الأعراض' : 'Symptom Trend',
      description: language === 'fr'
        ? 'La fréquence des symptômes a diminué de 40% ces 2 dernières semaines.'
        : language === 'ar'
        ? 'انخفض تكرار الأعراض بنسبة 40% في الأسبوعين الماضيين.'
        : 'Symptom frequency has decreased by 40% in the last 2 weeks.',
      severity: 'low',
      color: 'text-green-600',
    },
    {
      id: 5,
      type: 'warning',
      icon: AlertTriangle,
      title: language === 'fr' ? 'Rappel de vaccination' : language === 'ar' ? 'تذكير بالتطعيم' : 'Vaccination Reminder',
      description: language === 'fr'
        ? 'Le vaccin Polio 3 est prévu la semaine prochaine. Prenez rendez-vous avec votre pédiatre.'
        : language === 'ar'
        ? 'موعد لقاح شلل الأطفال 3 الأسبوع القادم. احجز موعداً مع طبيب الأطفال.'
        : 'Polio 3 vaccination is due next week. Schedule an appointment with your pediatrician.',
      severity: 'medium',
      color: 'text-orange-600',
    },
  ];

  const TIPS = [
    {
      emoji: '🥗',
      title: language === 'fr' ? 'Alimentation équilibrée' : language === 'ar' ? 'غذاء متوازن' : 'Balanced Diet',
      desc: language === 'fr' ? 'Assurez un mélange de fruits, légumes et protéines chaque jour.' : language === 'ar' ? 'احرص على تنوع الفواكه والخضروات والبروتينات يومياً.' : 'Ensure a mix of fruits, vegetables, and proteins daily.',
    },
    {
      emoji: '💧',
      title: language === 'fr' ? 'Rester hydraté' : language === 'ar' ? 'الترطيب الكافي' : 'Stay Hydrated',
      desc: language === 'fr' ? 'Proposez de l\'eau régulièrement tout au long de la journée.' : language === 'ar' ? 'قدم الماء بانتظام على مدار اليوم.' : 'Offer water regularly throughout the day.',
    },
    {
      emoji: '😴',
      title: language === 'fr' ? 'Sommeil suffisant' : language === 'ar' ? 'نوم كافٍ' : 'Adequate Sleep',
      desc: language === 'fr' ? 'Assurez 10-12 heures de sommeil de qualité pour une santé optimale.' : language === 'ar' ? 'احرص على 10-12 ساعة من النوم الجيد للصحة المثلى.' : 'Ensure 10-12 hours of quality sleep for optimal health.',
    },
  ];

  const getBackgroundColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-orange-50 border-orange-200';
      default: return 'bg-green-50 border-green-200';
    }
  };

  const getSeverityLabel = (severity: string) => {
    if (severity === 'high') return `🔴 ${t('high')}`;
    if (severity === 'medium') return `🟡 ${t('medium')}`;
    return `🟢 ${t('low')}`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">{t('aiInsights')}</h1>
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-blue-50 p-4 border-0 shadow-sm">
          <p className="text-sm font-medium text-foreground">
            🤖{' '}
            {language === 'fr'
              ? "Notre IA analyse les données de santé de votre enfant pour vous fournir des recommandations personnalisées."
              : language === 'ar'
              ? 'يحلل ذكاؤنا الاصطناعي بيانات صحة طفلك لتقديم توصيات شخصية.'
              : "Our AI analyzes your child's health data to provide personalized insights and recommendations."}
          </p>
        </Card>

        {/* Insights List */}
        <div className="space-y-3">
          {INSIGHTS.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card key={insight.id} className={`p-4 border-2 ${getBackgroundColor(insight.severity)} shadow-sm`}>
                <div className="flex gap-3">
                  <Icon size={18} className={`${insight.color} flex-shrink-0 mt-1`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{insight.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 mt-2">
                      {getSeverityLabel(insight.severity)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="p-5 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            💡 {language === 'fr' ? 'Conseils santé' : language === 'ar' ? 'نصائح صحية' : 'Health Tips'}
          </h2>
          <div className="space-y-4">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-2xl">{tip.emoji}</span>
                <div>
                  <p className="font-medium text-foreground text-sm">{tip.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
