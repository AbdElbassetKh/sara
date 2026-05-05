import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, Shield, FileText, Users, ExternalLink } from 'lucide-react';
import { useLocation, useParams } from 'wouter';
import { Card } from '@/components/ui/card';

const LOGO_URL = '/manus-storage/allenest-logo_9219c293.png';

type LegalPage = 'privacy' | 'terms' | 'partners';

export default function Legal({ page }: { page?: LegalPage }) {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();

  const pageType: LegalPage = page ?? 'privacy';

  const titles = {
    privacy: {
      fr: 'Politique de confidentialité',
      ar: 'سياسة الخصوصية',
      en: 'Privacy Policy',
    },
    terms: {
      fr: "Conditions d'utilisation",
      ar: 'شروط الخدمة',
      en: 'Terms of Service',
    },
    partners: {
      fr: 'Nos Partenaires',
      ar: 'شركاؤنا',
      en: 'Our Partners',
    },
  };

  const icons = { privacy: Shield, terms: FileText, partners: Users };
  const Icon = icons[pageType];

  return (
    <div className="min-h-screen bg-background pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setLocation('/settings')} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Icon className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">
          {titles[pageType][language as 'fr' | 'ar' | 'en'] ?? titles[pageType].en}
        </h1>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
          <img src={LOGO_URL} alt="AlleNest" className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <p className="font-bold text-foreground">AlleNest</p>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? 'Dernière mise à jour : 1 mai 2026' :
               language === 'ar' ? 'آخر تحديث: 1 مايو 2026' :
               'Last updated: May 1, 2026'}
            </p>
          </div>
        </div>

        {pageType === 'privacy' && <PrivacyContent language={language} />}
        {pageType === 'terms' && <TermsContent language={language} />}
        {pageType === 'partners' && <PartnersContent language={language} />}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-foreground text-base">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function PrivacyContent({ language }: { language: string }) {
  if (language === 'fr') return (
    <div className="space-y-6">
      <Section title="1. Collecte des données">
        <p>AlleNest collecte uniquement les données nécessaires au bon fonctionnement de l'application : informations du profil enfant (nom, date de naissance, allergies), journaux de santé (repas, symptômes, croissance), et données d'utilisation anonymisées.</p>
      </Section>
      <Section title="2. Utilisation des données">
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Fournir les fonctionnalités de suivi de santé</li>
          <li>Générer des analyses IA personnalisées</li>
          <li>Envoyer des rappels et notifications</li>
          <li>Améliorer l'application (données anonymisées)</li>
        </ul>
      </Section>
      <Section title="3. Protection des données">
        <p>Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Nous ne vendons jamais vos données à des tiers. Vos données médicales restent strictement confidentielles.</p>
      </Section>
      <Section title="4. Vos droits">
        <p>Conformément au RGPD, vous avez le droit d'accéder, modifier, exporter ou supprimer vos données à tout moment depuis les Paramètres de l'application.</p>
      </Section>
      <Section title="5. Cookies et suivi">
        <p>AlleNest utilise uniquement des cookies essentiels pour l'authentification. Aucun cookie publicitaire ou de suivi tiers n'est utilisé.</p>
      </Section>
      <Section title="6. Contact">
        <p>Pour toute question relative à la confidentialité : <span className="text-primary">privacy@allenest.app</span></p>
      </Section>
    </div>
  );

  if (language === 'ar') return (
    <div className="space-y-6">
      <Section title="١. جمع البيانات">
        <p>يجمع AlleNest فقط البيانات الضرورية لعمل التطبيق: معلومات ملف الطفل (الاسم، تاريخ الميلاد، الحساسيات)، سجلات الصحة (الوجبات، الأعراض، النمو)، وبيانات الاستخدام المجهولة.</p>
      </Section>
      <Section title="٢. استخدام البيانات">
        <p>تُستخدم بياناتك حصريًا من أجل:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>توفير ميزات تتبع الصحة</li>
          <li>توليد تحليلات ذكاء اصطناعي مخصصة</li>
          <li>إرسال التذكيرات والإشعارات</li>
          <li>تحسين التطبيق (بيانات مجهولة)</li>
        </ul>
      </Section>
      <Section title="٣. حماية البيانات">
        <p>جميع البيانات مشفرة أثناء النقل (TLS 1.3) وفي حالة السكون (AES-256). لا نبيع بياناتك أبدًا لأطراف ثالثة. تبقى بياناتك الطبية سرية تمامًا.</p>
      </Section>
      <Section title="٤. حقوقك">
        <p>وفقًا للوائح حماية البيانات، يحق لك الوصول إلى بياناتك أو تعديلها أو تصديرها أو حذفها في أي وقت من إعدادات التطبيق.</p>
      </Section>
      <Section title="٥. التواصل">
        <p>لأي استفسار متعلق بالخصوصية: <span className="text-primary">privacy@allenest.app</span></p>
      </Section>
    </div>
  );

  return (
    <div className="space-y-6">
      <Section title="1. Data Collection">
        <p>AlleNest collects only the data necessary for the app to function: child profile information (name, date of birth, allergies), health logs (meals, symptoms, growth), and anonymized usage data.</p>
      </Section>
      <Section title="2. Data Use">
        <p>Your data is used exclusively to provide health tracking features, generate personalized AI analyses, send reminders and notifications, and improve the app (anonymized data).</p>
      </Section>
      <Section title="3. Data Protection">
        <p>All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never sell your data to third parties. Your medical data remains strictly confidential.</p>
      </Section>
      <Section title="4. Your Rights">
        <p>You have the right to access, modify, export, or delete your data at any time from the app Settings.</p>
      </Section>
      <Section title="5. Contact">
        <p>For any privacy-related questions: <span className="text-primary">privacy@allenest.app</span></p>
      </Section>
    </div>
  );
}

function TermsContent({ language }: { language: string }) {
  if (language === 'fr') return (
    <div className="space-y-6">
      <Section title="1. Acceptation des conditions">
        <p>En utilisant AlleNest, vous acceptez les présentes Conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.</p>
      </Section>
      <Section title="2. Description du service">
        <p>AlleNest est une application de suivi de santé pédiatrique destinée aux parents. Elle ne remplace en aucun cas un avis médical professionnel. Consultez toujours un médecin pour tout problème de santé.</p>
      </Section>
      <Section title="3. Compte utilisateur">
        <p>Vous êtes responsable de la sécurité de votre compte et de toutes les activités qui s'y déroulent. Vous devez avoir au moins 18 ans pour créer un compte.</p>
      </Section>
      <Section title="4. Abonnement Premium">
        <p>L'abonnement Premium est facturé mensuellement (500 DZD) ou annuellement (4 000 DZD). L'annulation prend effet à la fin de la période en cours. Aucun remboursement partiel n'est accordé.</p>
      </Section>
      <Section title="5. Limitation de responsabilité">
        <p>AlleNest ne peut être tenu responsable des décisions médicales prises sur la base des informations fournies par l'application. Les analyses IA sont indicatives et ne constituent pas un diagnostic médical.</p>
      </Section>
      <Section title="6. Propriété intellectuelle">
        <p>Tous les droits sur l'application AlleNest, son contenu et ses marques sont la propriété exclusive de l'équipe AlleNest.</p>
      </Section>
      <Section title="7. Contact">
        <p>Pour toute question : <span className="text-primary">legal@allenest.app</span></p>
      </Section>
    </div>
  );

  if (language === 'ar') return (
    <div className="space-y-6">
      <Section title="١. قبول الشروط">
        <p>باستخدام AlleNest، فإنك توافق على شروط الخدمة هذه. إذا لم توافق على هذه الشروط، يرجى عدم استخدام التطبيق.</p>
      </Section>
      <Section title="٢. وصف الخدمة">
        <p>AlleNest هو تطبيق لتتبع صحة الأطفال مخصص للوالدين. لا يحل بأي حال محل الاستشارة الطبية المهنية. استشر الطبيب دائمًا لأي مشكلة صحية.</p>
      </Section>
      <Section title="٣. الاشتراك المميز">
        <p>يُفوتر الاشتراك المميز شهريًا (500 دج) أو سنويًا (4000 دج). يسري الإلغاء في نهاية الفترة الحالية. لا يُمنح أي استرداد جزئي.</p>
      </Section>
      <Section title="٤. حدود المسؤولية">
        <p>لا يتحمل AlleNest المسؤولية عن القرارات الطبية المتخذة بناءً على المعلومات التي يوفرها التطبيق. تحليلات الذكاء الاصطناعي إرشادية ولا تشكل تشخيصًا طبيًا.</p>
      </Section>
      <Section title="٥. التواصل">
        <p>لأي استفسار: <span className="text-primary">legal@allenest.app</span></p>
      </Section>
    </div>
  );

  return (
    <div className="space-y-6">
      <Section title="1. Acceptance of Terms">
        <p>By using AlleNest, you agree to these Terms of Service. If you do not agree, please do not use the application.</p>
      </Section>
      <Section title="2. Service Description">
        <p>AlleNest is a pediatric health tracking app for parents. It does not replace professional medical advice. Always consult a doctor for any health issue.</p>
      </Section>
      <Section title="3. Premium Subscription">
        <p>Premium subscription is billed monthly (500 DZD) or yearly (4,000 DZD). Cancellation takes effect at the end of the current period. No partial refunds are granted.</p>
      </Section>
      <Section title="4. Limitation of Liability">
        <p>AlleNest is not liable for medical decisions made based on app information. AI analyses are indicative and do not constitute a medical diagnosis.</p>
      </Section>
      <Section title="5. Contact">
        <p>For any questions: <span className="text-primary">legal@allenest.app</span></p>
      </Section>
    </div>
  );
}

function PartnersContent({ language }: { language: string }) {
  const partners = [
    {
      name: 'WHO / OMS',
      logo: '🌍',
      category: language === 'fr' ? 'Santé mondiale' : language === 'ar' ? 'الصحة العالمية' : 'Global Health',
      desc: language === 'fr' ? 'Directives nutritionnelles et de vaccination mondiales' :
            language === 'ar' ? 'إرشادات التغذية والتطعيم العالمية' :
            'Global nutrition and vaccination guidelines',
      url: 'https://www.who.int',
    },
    {
      name: 'UNICEF',
      logo: '🤝',
      category: language === 'fr' ? 'Protection enfance' : language === 'ar' ? 'حماية الطفل' : 'Child Protection',
      desc: language === 'fr' ? 'Ressources sur la santé et le développement de l\'enfant' :
            language === 'ar' ? 'موارد صحة وتطوير الطفل' :
            'Child health and development resources',
      url: 'https://www.unicef.org',
    },
    {
      name: 'OpenAI',
      logo: '🤖',
      category: language === 'fr' ? 'Intelligence Artificielle' : language === 'ar' ? 'الذكاء الاصطناعي' : 'Artificial Intelligence',
      desc: language === 'fr' ? 'Moteur IA pour l\'analyse des allergènes et les recommandations' :
            language === 'ar' ? 'محرك الذكاء الاصطناعي لتحليل مسببات الحساسية والتوصيات' :
            'AI engine for allergen analysis and recommendations',
      url: 'https://openai.com',
    },
    {
      name: 'Société Algérienne de Pédiatrie',
      logo: '👶',
      category: language === 'fr' ? 'Partenaire médical' : language === 'ar' ? 'شريك طبي' : 'Medical Partner',
      desc: language === 'fr' ? 'Validation du calendrier vaccinal et des protocoles pédiatriques' :
            language === 'ar' ? 'التحقق من جدول التطعيمات والبروتوكولات طب الأطفال' :
            'Validation of vaccination schedule and pediatric protocols',
      url: '#',
    },
    {
      name: 'Manus AI',
      logo: '⚡',
      category: language === 'fr' ? 'Plateforme technique' : language === 'ar' ? 'المنصة التقنية' : 'Technical Platform',
      desc: language === 'fr' ? 'Infrastructure cloud et services IA de l\'application' :
            language === 'ar' ? 'البنية التحتية السحابية وخدمات الذكاء الاصطناعي للتطبيق' :
            'Cloud infrastructure and AI services for the app',
      url: 'https://manus.im',
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {language === 'fr'
          ? 'AlleNest collabore avec des organisations de confiance pour vous offrir les meilleures ressources de santé pédiatrique.'
          : language === 'ar'
          ? 'يتعاون AlleNest مع منظمات موثوقة لتزويدك بأفضل موارد صحة الأطفال.'
          : 'AlleNest collaborates with trusted organizations to provide you with the best pediatric health resources.'}
      </p>

      <div className="space-y-3">
        {partners.map((partner, i) => (
          <Card key={i} className="p-4 flex items-start gap-4">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {partner.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground">{partner.name}</h4>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {partner.category}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{partner.desc}</p>
            </div>
            {partner.url !== '#' && (
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <p className="text-sm text-foreground font-medium">
          {language === 'fr' ? '📩 Devenir partenaire' : language === 'ar' ? '📩 كن شريكاً' : '📩 Become a Partner'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'fr'
            ? 'Vous êtes une organisation médicale ou une startup santé ? Contactez-nous : '
            : language === 'ar'
            ? 'هل أنت منظمة طبية أو شركة ناشئة في مجال الصحة؟ تواصل معنا: '
            : 'Are you a medical organization or health startup? Contact us: '}
          <span className="text-primary">partners@allenest.app</span>
        </p>
      </Card>
    </div>
  );
}
