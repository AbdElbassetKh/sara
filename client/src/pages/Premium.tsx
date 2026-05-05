import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  Crown, Check, Star, Zap, Shield, BarChart2, FileText, Bell,
  ChevronLeft, Sparkles, Lock
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';

const LOGO_URL = '/manus-storage/allenest-logo_9219c293.png';

export default function Premium() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: subscription, refetch } = trpc.premium.getSubscription.useQuery();
  const activateMutation = trpc.premium.activatePremium.useMutation({
    onSuccess: (data) => {
      toast.success(
        language === 'fr' ? `Abonnement ${data.plan === 'monthly' ? 'mensuel' : 'annuel'} activé ! 🎉` :
        language === 'ar' ? `تم تفعيل الاشتراك ${data.plan === 'monthly' ? 'الشهري' : 'السنوي'}! 🎉` :
        `${data.plan === 'monthly' ? 'Monthly' : 'Yearly'} subscription activated! 🎉`
      );
      refetch();
      setIsProcessing(false);
    },
    onError: () => {
      toast.error(language === 'fr' ? 'Erreur lors de l\'activation' : language === 'ar' ? 'خطأ في التفعيل' : 'Activation error');
      setIsProcessing(false);
    }
  });

  const handleActivate = () => {
    setIsProcessing(true);
    activateMutation.mutate({ plan: selectedPlan, paymentMethod: 'card' });
  };

  const isPremium = subscription?.isPremium;

  const features = {
    free: [
      language === 'fr' ? '1 profil enfant' : language === 'ar' ? 'ملف طفل واحد' : '1 child profile',
      language === 'fr' ? '1 analyse IA / jour' : language === 'ar' ? 'تحليل ذكاء اصطناعي واحد / يوم' : '1 AI analysis / day',
      language === 'fr' ? 'Suivi des repas' : language === 'ar' ? 'تتبع الوجبات' : 'Meal tracking',
      language === 'fr' ? 'Suivi des symptômes' : language === 'ar' ? 'تتبع الأعراض' : 'Symptom tracking',
      language === 'fr' ? 'Carnet de vaccination' : language === 'ar' ? 'سجل التطعيمات' : 'Vaccine journal',
    ],
    premium: [
      language === 'fr' ? 'Profils enfants illimités' : language === 'ar' ? 'ملفات أطفال غير محدودة' : 'Unlimited child profiles',
      language === 'fr' ? 'Analyses IA illimitées' : language === 'ar' ? 'تحليلات ذكاء اصطناعي غير محدودة' : 'Unlimited AI analyses',
      language === 'fr' ? 'Export PDF des rapports' : language === 'ar' ? 'تصدير تقارير PDF' : 'PDF report export',
      language === 'fr' ? 'Corrélations avancées' : language === 'ar' ? 'ارتباطات متقدمة' : 'Advanced correlations',
      language === 'fr' ? 'Notifications prioritaires' : language === 'ar' ? 'إشعارات ذات أولوية' : 'Priority notifications',
      language === 'fr' ? 'Stockage documents illimité' : language === 'ar' ? 'تخزين مستندات غير محدود' : 'Unlimited document storage',
      language === 'fr' ? 'Support prioritaire' : language === 'ar' ? 'دعم ذو أولوية' : 'Priority support',
      language === 'fr' ? 'Accès aux nouvelles fonctionnalités' : language === 'ar' ? 'الوصول إلى الميزات الجديدة' : 'Early access to new features',
    ]
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setLocation('/')} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <img src={LOGO_URL} alt="AlleNest" className="h-8 w-8 rounded-full object-cover" />
        <h1 className="text-lg font-bold text-foreground">
          {language === 'fr' ? 'AlleNest Premium' : language === 'ar' ? 'AlleNest المميز' : 'AlleNest Premium'}
        </h1>
        <Crown className="w-5 h-5 text-yellow-500 ml-auto" />
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          {isPremium ? (
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'fr' ? '🎉 Vous êtes Premium !' : language === 'ar' ? '🎉 أنت مشترك مميز!' : '🎉 You are Premium!'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {subscription?.premiumUntil
                  ? (language === 'fr' ? `Valide jusqu'au ${new Date(subscription.premiumUntil).toLocaleDateString('fr-FR')}` :
                     language === 'ar' ? `صالح حتى ${new Date(subscription.premiumUntil).toLocaleDateString('ar-DZ')}` :
                     `Valid until ${new Date(subscription.premiumUntil).toLocaleDateString()}`)
                  : ''}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'fr' ? 'Passez à Premium' : language === 'ar' ? 'انتقل إلى المميز' : 'Upgrade to Premium'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {language === 'fr' ? 'Débloquez toutes les fonctionnalités pour mieux protéger votre enfant' :
                 language === 'ar' ? 'افتح جميع الميزات لحماية طفلك بشكل أفضل' :
                 'Unlock all features to better protect your child'}
              </p>
            </div>
          )}
        </div>

        {/* Current Plan Badge */}
        <div className={`rounded-2xl p-4 text-center ${isPremium ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-muted/50'}`}>
          <div className="flex items-center justify-center gap-2">
            {isPremium ? <Crown className="w-5 h-5 text-yellow-500" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
            <span className="font-semibold text-foreground">
              {isPremium
                ? (language === 'fr' ? `Plan ${subscription?.plan === 'monthly' ? 'Mensuel' : 'Annuel'}` :
                   language === 'ar' ? `خطة ${subscription?.plan === 'monthly' ? 'شهرية' : 'سنوية'}` :
                   `${subscription?.plan === 'monthly' ? 'Monthly' : 'Yearly'} Plan`)
                : (language === 'fr' ? 'Plan Gratuit' : language === 'ar' ? 'الخطة المجانية' : 'Free Plan')}
            </span>
          </div>
          {!isPremium && (
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'fr' ? `${subscription?.aiAnalysesUsedToday ?? 0}/1 analyse IA utilisée aujourd'hui` :
               language === 'ar' ? `${subscription?.aiAnalysesUsedToday ?? 0}/1 تحليل ذكاء اصطناعي مستخدم اليوم` :
               `${subscription?.aiAnalysesUsedToday ?? 0}/1 AI analysis used today`}
            </p>
          )}
        </div>

        {!isPremium && (
          <>
            {/* Plan Toggle */}
            <div className="flex bg-muted rounded-2xl p-1">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedPlan === 'monthly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                {language === 'fr' ? 'Mensuel' : language === 'ar' ? 'شهري' : 'Monthly'}
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  selectedPlan === 'yearly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                {language === 'fr' ? 'Annuel' : language === 'ar' ? 'سنوي' : 'Yearly'}
                <span className="absolute -top-2 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  -33%
                </span>
              </button>
            </div>

            {/* Pricing Card */}
            <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg">
              <div className="text-center space-y-2">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-foreground">
                    {selectedPlan === 'monthly' ? '500' : '4 000'}
                  </span>
                  <span className="text-lg font-semibold text-muted-foreground">DZD</span>
                  <span className="text-sm text-muted-foreground">
                    / {selectedPlan === 'monthly'
                      ? (language === 'fr' ? 'mois' : language === 'ar' ? 'شهر' : 'month')
                      : (language === 'fr' ? 'an' : language === 'ar' ? 'سنة' : 'year')}
                  </span>
                </div>
                {selectedPlan === 'yearly' && (
                  <p className="text-sm text-green-600 font-medium">
                    {language === 'fr' ? 'Économisez 2 000 DZD/an' : language === 'ar' ? 'وفر 2000 دج/سنة' : 'Save 2,000 DZD/year'}
                  </p>
                )}
                <Button
                  className="w-full mt-4 h-12 text-base font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  onClick={handleActivate}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      {language === 'fr' ? 'Traitement...' : language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {language === 'fr' ? 'Passer à Premium' : language === 'ar' ? 'الترقية إلى المميز' : 'Upgrade to Premium'}
                    </div>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {language === 'fr' ? 'Annulation possible à tout moment' :
                   language === 'ar' ? 'يمكن الإلغاء في أي وقت' :
                   'Cancel anytime'}
                </p>
              </div>
            </Card>
          </>
        )}

        {/* Features Comparison */}
        <div className="space-y-4">
          <h3 className="font-bold text-foreground text-lg">
            {language === 'fr' ? 'Ce qui est inclus' : language === 'ar' ? 'ما هو مدرج' : "What's included"}
          </h3>

          {/* Free Features */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="font-semibold text-foreground">
                {language === 'fr' ? 'Plan Gratuit' : language === 'ar' ? 'الخطة المجانية' : 'Free Plan'}
              </span>
            </div>
            <div className="space-y-2">
              {features.free.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Premium Features */}
          <Card className="p-4 space-y-3 border-2 border-yellow-300 bg-gradient-to-br from-yellow-50/50 to-orange-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">
                {language === 'fr' ? 'Plan Premium' : language === 'ar' ? 'الخطة المميزة' : 'Premium Plan'}
              </span>
              <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                {language === 'fr' ? 'Tout du gratuit +' : language === 'ar' ? 'كل المجاني +' : 'All free +'}
              </span>
            </div>
            <div className="space-y-2">
              {features.premium.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-sm text-foreground font-medium">{f}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Why Premium */}
        <div className="space-y-3">
          <h3 className="font-bold text-foreground text-lg">
            {language === 'fr' ? 'Pourquoi Premium ?' : language === 'ar' ? 'لماذا المميز؟' : 'Why Premium?'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50',
                title: language === 'fr' ? 'IA Avancée' : language === 'ar' ? 'ذكاء اصطناعي متقدم' : 'Advanced AI',
                desc: language === 'fr' ? 'Analyses illimitées' : language === 'ar' ? 'تحليلات غير محدودة' : 'Unlimited analyses' },
              { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50',
                title: language === 'fr' ? 'Sécurité' : language === 'ar' ? 'الأمان' : 'Security',
                desc: language === 'fr' ? 'Données chiffrées' : language === 'ar' ? 'بيانات مشفرة' : 'Encrypted data' },
              { icon: BarChart2, color: 'text-green-500', bg: 'bg-green-50',
                title: language === 'fr' ? 'Rapports' : language === 'ar' ? 'التقارير' : 'Reports',
                desc: language === 'fr' ? 'Export PDF' : language === 'ar' ? 'تصدير PDF' : 'PDF export' },
              { icon: Bell, color: 'text-purple-500', bg: 'bg-purple-50',
                title: language === 'fr' ? 'Alertes' : language === 'ar' ? 'التنبيهات' : 'Alerts',
                desc: language === 'fr' ? 'Notifications smart' : language === 'ar' ? 'إشعارات ذكية' : 'Smart notifications' },
            ].map((item, i) => (
              <Card key={i} className="p-3 space-y-2">
                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <PaymentHistorySection language={language} />

        {/* Legal notice */}
        <p className="text-xs text-muted-foreground text-center pb-4">
          {language === 'fr'
            ? 'En souscrivant, vous acceptez nos Conditions d\'utilisation et notre Politique de confidentialité. Paiement sécurisé.'
            : language === 'ar'
            ? 'بالاشتراك، أنت توافق على شروط الخدمة وسياسة الخصوصية. دفع آمن.'
            : 'By subscribing, you agree to our Terms of Service and Privacy Policy. Secure payment.'}
        </p>
      </div>
    </div>
  );
}

function PaymentHistorySection({ language }: { language: string }) {
  const { data: history } = trpc.premium.getPaymentHistory.useQuery();

  if (!history || history.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-foreground text-lg">
        {language === 'fr' ? 'Historique des paiements' : language === 'ar' ? 'سجل المدفوعات' : 'Payment History'}
      </h3>
      <div className="space-y-2">
        {history.map((p) => (
          <Card key={p.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {p.plan === 'monthly'
                  ? (language === 'fr' ? 'Mensuel' : language === 'ar' ? 'شهري' : 'Monthly')
                  : (language === 'fr' ? 'Annuel' : language === 'ar' ? 'سنوي' : 'Yearly')}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{p.amount} DZD</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {p.status === 'completed'
                  ? (language === 'fr' ? 'Payé' : language === 'ar' ? 'مدفوع' : 'Paid')
                  : p.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
