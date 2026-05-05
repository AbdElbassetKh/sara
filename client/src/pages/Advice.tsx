import { useState } from 'react';
import { Search, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';

type Article = {
  id: number;
  title: string;
  category: 'allergie' | 'nutrition' | 'croissance';
  content: string;
  excerpt: string;
};

export default function Advice() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeTab, setActiveTab] = useState<'allergie' | 'nutrition' | 'croissance'>('allergie');

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const ARTICLES_TRANSLATED: Article[] = isAr
    ? [
        { id: 1, title: 'فهم حساسية الطعام عند الرضع', category: 'allergie', content: 'حساسية الطعام شائعة عند الرضع. تعلم كيفية التعرف على الأعراض وإدارتها بأمان. أكثر مسببات الحساسية شيوعاً هي الحليب والبيض والفول السوداني والقمح والسمك والصويا. التقديم التدريجي للأطعمة والمراقبة الدقيقة ضروريان.', excerpt: 'دليل شامل لحساسية الطعام عند الرضع...' },
        { id: 2, title: 'دليل التغذية للأطفال في مرحلة النمو', category: 'nutrition', content: 'التغذية السليمة ضرورية للنمو الصحي للطفل. اكتشف العناصر الغذائية الأساسية اللازمة في كل مرحلة من مراحل النمو، من الولادة حتى المراهقة.', excerpt: 'العناصر الغذائية الأساسية لنمو الطفل...' },
        { id: 3, title: 'مراحل النمو: ماذا تتوقع', category: 'croissance', content: 'تابع نمو طفلك مع دليلنا الشامل لمراحل التطور. كل طفل ينمو بوتيرته الخاصة، لكن هناك معالم مهمة يجب مراقبتها.', excerpt: 'فهم أنماط النمو عند الأطفال...' },
        { id: 4, title: 'إدارة ردود الفعل التحسسية في المنزل', category: 'allergie', content: 'خطوات سريعة لإدارة ردود الفعل التحسسية بأمان في المنزل. تعلم كيفية التعرف على علامات الخطر والتصرف بسرعة في حالات الطوارئ.', excerpt: 'إدارة ردود الفعل التحسسية في المنزل...' },
        { id: 5, title: 'تقديم الأطعمة الصلبة بأمان', category: 'nutrition', content: 'تعلم أفضل الممارسات لتقديم الأطعمة الصلبة لرضيعك. التقديم التدريجي ومراقبة ردود الفعل ضروريان لتغذية صحية.', excerpt: 'تقديم آمن للأطعمة الصلبة...' },
        { id: 6, title: 'جدول التطعيم وفوائده', category: 'croissance', content: 'افهم أهمية التطعيمات في رحلة صحة طفلك. الالتزام بجدول التطعيم يحمي طفلك من أمراض خطيرة عديدة.', excerpt: 'دليل التطعيم الشامل...' },
      ]
    : isFr
    ? [
        { id: 1, title: 'Comprendre les allergies alimentaires chez les nourrissons', category: 'allergie', content: "Les allergies alimentaires sont fréquentes chez les nourrissons. Apprenez à identifier les symptômes et à les gérer en toute sécurité. Les allergènes les plus courants sont le lait, les œufs, les arachides, le blé, le poisson et le soja.", excerpt: 'Guide complet sur les allergies alimentaires du nourrisson...' },
        { id: 2, title: 'Guide nutritionnel pour les enfants en pleine croissance', category: 'nutrition', content: "Une nutrition adéquate est essentielle au développement sain de l'enfant. Découvrez les nutriments clés nécessaires à chaque étape de croissance, de la naissance à l'adolescence.", excerpt: 'Nutriments essentiels pour le développement de l\'enfant...' },
        { id: 3, title: "Étapes de croissance : à quoi s'attendre", category: 'croissance', content: "Suivez la croissance de votre enfant avec notre guide complet des étapes de développement. Chaque enfant grandit à son propre rythme, mais certains repères sont importants à surveiller.", excerpt: 'Comprendre les schémas de croissance chez les enfants...' },
        { id: 4, title: 'Gérer les réactions allergiques à la maison', category: 'allergie', content: "Étapes rapides pour gérer les réactions allergiques en toute sécurité à la maison. Apprenez à reconnaître les signes d'alerte et à agir rapidement en cas d'urgence.", excerpt: 'Gestion à domicile des réactions allergiques...' },
        { id: 5, title: 'Introduction des aliments solides en toute sécurité', category: 'nutrition', content: "Apprenez les meilleures pratiques pour introduire les aliments solides à votre nourrisson. L'introduction progressive et la surveillance des réactions sont essentielles.", excerpt: 'Introduction sécurisée des aliments solides...' },
        { id: 6, title: 'Calendrier vaccinal et bénéfices', category: 'croissance', content: "Comprenez l'importance des vaccinations dans le parcours de santé de votre enfant. Un calendrier vaccinal respecté protège votre enfant contre de nombreuses maladies graves.", excerpt: 'Guide complet de vaccination...' },
      ]
    : [
        { id: 1, title: 'Understanding Food Allergies in Infants', category: 'allergie', content: 'Food allergies are common in infants. Learn how to identify symptoms and manage them safely. The most common allergens are milk, eggs, peanuts, wheat, fish, and soy.', excerpt: 'A comprehensive guide to infant food allergies...' },
        { id: 2, title: 'Nutrition Guide for Growing Children', category: 'nutrition', content: 'Proper nutrition is essential for healthy child development. Discover the key nutrients needed at every stage of growth, from birth to adolescence.', excerpt: 'Essential nutrients for child development...' },
        { id: 3, title: 'Growth Milestones: What to Expect', category: 'croissance', content: "Track your child's growth with our comprehensive milestone guide. Every child grows at their own pace, but certain benchmarks are important to monitor.", excerpt: 'Understanding growth patterns in children...' },
        { id: 4, title: 'Managing Allergic Reactions at Home', category: 'allergie', content: 'Quick steps to manage allergic reactions safely at home. Learn to recognize warning signs and act quickly in case of emergency.', excerpt: 'Home management of allergic reactions...' },
        { id: 5, title: 'Introducing Solid Foods Safely', category: 'nutrition', content: 'Learn the best practices for introducing solid foods to your infant. Gradual introduction and monitoring reactions are key to healthy eating.', excerpt: 'Safe introduction of solid foods...' },
        { id: 6, title: 'Vaccination Schedule and Benefits', category: 'croissance', content: "Understand the importance of vaccinations in your child's health journey. Following the vaccination schedule protects your child from many serious diseases.", excerpt: 'Complete vaccination guide...' },
      ];

  const CATEGORIES = [
    { key: 'allergie' as const, emoji: '🔴', label: t('categoryAllergie'), gradient: 'linear-gradient(135deg, #EF9A9A, #E53935)', shadow: 'rgba(239,83,80,0.4)', bg: '#FFEBEE', border: '#FFCDD2', text: '#C62828' },
    { key: 'nutrition' as const, emoji: '🥗', label: t('categoryNutrition'), gradient: 'linear-gradient(135deg, #A5D6A7, #388E3C)', shadow: 'rgba(165,214,167,0.4)', bg: '#E8F5E9', border: '#C8E6C9', text: '#2E7D32' },
    { key: 'croissance' as const, emoji: '📈', label: t('categoryCroissance'), gradient: 'linear-gradient(135deg, #90CAF9, #1565C0)', shadow: 'rgba(144,202,249,0.4)', bg: '#E3F2FD', border: '#BBDEFB', text: '#1565C0' },
  ];

  const filteredArticles = ARTICLES_TRANSLATED.filter(
    (a) =>
      a.category === activeTab &&
      (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCat = CATEGORIES.find((c) => c.key === activeTab)!;

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-7"
        style={{
          background: 'linear-gradient(135deg, #80DEEA 0%, #00838F 60%, #00ACC1 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 8px 32px rgba(0,131,143,0.35)',
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-10 pointer-events-none" style={{ background: 'white', transform: 'translate(-30%, 40%)' }} />

        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setLocation('/')} className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              {isAr ? <ChevronRight size={20} color="white" /> : <ChevronLeft size={20} color="white" />}
            </button>
            <div className="w-9 h-9" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <BookOpen size={26} color="white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-extrabold leading-tight">{t('healthAdvice')}</h1>
              <p className="text-white/75 text-xs mt-0.5">
                {isAr ? 'نصائح صحية موثوقة لطفلك' : isFr ? 'Conseils santé fiables pour votre enfant' : 'Trusted health tips for your child'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">

        {/* Search */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1.5px solid #F1F5F9' }}
        >
          <Search size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          <input
            placeholder={t('searchArticles')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            style={{ fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-3xl transition-all active:scale-95"
              style={{
                background: activeTab === cat.key ? cat.gradient : 'white',
                boxShadow: activeTab === cat.key ? `0 6px 20px ${cat.shadow}` : '0 2px 8px rgba(0,0,0,0.05)',
                border: `1.5px solid ${activeTab === cat.key ? 'transparent' : '#F1F5F9'}`,
              }}
            >
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
              <span
                className="text-[10px] font-bold leading-tight text-center"
                style={{ color: activeTab === cat.key ? 'white' : '#6B7280' }}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-3">
          {filteredArticles.length === 0 ? (
            <div
              className="p-10 rounded-3xl bg-white flex flex-col items-center gap-3"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}
            >
              <BookOpen size={32} style={{ color: '#D1D5DB' }} />
              <p className="text-sm text-gray-400 text-center">{t('noArticlesFound')}</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="w-full text-start p-4 rounded-3xl bg-white transition-all active:scale-[0.98]"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: activeCat.bg, border: `1.5px solid ${activeCat.border}` }}
                  >
                    {activeCat.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-gray-800 leading-snug">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{article.excerpt}</p>
                    <span
                      className="inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: activeCat.bg, color: activeCat.text, border: `1px solid ${activeCat.border}` }}
                    >
                      {t('readMore')} →
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl" style={{ background: '#FFFDE7', border: '1px solid #FFF176' }}>
          <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            {isAr ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية المتخصصة.' : isFr ? "Cette application est une aide, pas un remplacement d'un avis médical." : 'This app is a health aid, not a replacement for professional medical advice.'}
          </p>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 flex items-end z-50"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="w-full max-w-md mx-auto p-6 max-h-[80vh] overflow-y-auto"
            style={{
              background: 'white',
              borderTopLeftRadius: '32px',
              borderTopRightRadius: '32px',
              fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-base font-extrabold text-gray-800 flex-1 leading-snug">{selectedArticle.title}</h2>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
              >
                <X size={16} style={{ color: '#6B7280' }} />
              </button>
            </div>
            <span
              className="inline-block text-[10px] font-bold px-3 py-1 rounded-full mb-4"
              style={{ background: activeCat.bg, color: activeCat.text, border: `1px solid ${activeCat.border}` }}
            >
              {activeCat.emoji} {activeCat.label}
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">{selectedArticle.content}</p>
            <button
              onClick={() => setSelectedArticle(null)}
              className="w-full h-12 mt-6 text-white font-extrabold rounded-3xl"
              style={{ background: 'linear-gradient(135deg, #80DEEA, #00838F)', boxShadow: '0 6px 20px rgba(0,131,143,0.35)' }}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
