const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Article = {
  id: number;
  title: string;
  category: 'allergie' | 'nutrition' | 'croissance';
  content: string;
  excerpt: string;
};

export default function Advice() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Articles traduits selon la langue active
  const ARTICLES_TRANSLATED: Article[] = language === 'fr'
    ? [
        { id: 1, title: 'Comprendre les allergies alimentaires chez les nourrissons', category: 'allergie', content: 'Les allergies alimentaires sont fréquentes chez les nourrissons. Apprenez à identifier les symptômes et à les gérer en toute sécurité. Les allergènes les plus courants sont le lait, les œufs, les arachides, le blé, le poisson et le soja. Une introduction progressive des aliments et une surveillance attentive sont essentielles.', excerpt: 'Guide complet sur les allergies alimentaires du nourrisson...' },
        { id: 2, title: 'Guide nutritionnel pour les enfants en pleine croissance', category: 'nutrition', content: 'Une nutrition adéquate est essentielle au développement sain de l\'enfant. Découvrez les nutriments clés nécessaires à chaque étape de croissance, de la naissance à l\'adolescence.', excerpt: 'Nutriments essentiels pour le développement de l\'enfant...' },
        { id: 3, title: 'Étapes de croissance : à quoi s\'attendre', category: 'croissance', content: 'Suivez la croissance de votre enfant avec notre guide complet des étapes de développement. Chaque enfant grandit à son propre rythme, mais certains repères sont importants à surveiller.', excerpt: 'Comprendre les schémas de croissance chez les enfants...' },
        { id: 4, title: 'Gérer les réactions allergiques à la maison', category: 'allergie', content: 'Étapes rapides pour gérer les réactions allergiques en toute sécurité à la maison. Apprenez à reconnaître les signes d\'alerte et à agir rapidement en cas d\'urgence.', excerpt: 'Gestion à domicile des réactions allergiques...' },
        { id: 5, title: 'Introduction des aliments solides en toute sécurité', category: 'nutrition', content: 'Apprenez les meilleures pratiques pour introduire les aliments solides à votre nourrisson. L\'introduction progressive et la surveillance des réactions sont essentielles pour une alimentation saine.', excerpt: 'Introduction sécurisée des aliments solides...' },
        { id: 6, title: 'Calendrier vaccinal et bénéfices', category: 'croissance', content: 'Comprenez l\'importance des vaccinations dans le parcours de santé de votre enfant. Un calendrier vaccinal respecté protège votre enfant contre de nombreuses maladies graves.', excerpt: 'Guide complet de vaccination...' },
      ]
    : language === 'ar'
    ? [
        { id: 1, title: 'فهم حساسية الطعام عند الرضع', category: 'allergie', content: 'حساسية الطعام شائعة عند الرضع. تعلم كيفية التعرف على الأعراض وإدارتها بأمان. أكثر مسببات الحساسية شيوعاً هي الحليب والبيض والفول السوداني والقمح والسمك والصويا.', excerpt: 'دليل شامل لحساسية الطعام عند الرضع...' },
        { id: 2, title: 'دليل التغذية للأطفال في مرحلة النمو', category: 'nutrition', content: 'التغذية السليمة ضرورية للنمو الصحي للطفل. اكتشف العناصر الغذائية الأساسية اللازمة في كل مرحلة من مراحل النمو.', excerpt: 'العناصر الغذائية الأساسية لنمو الطفل...' },
        { id: 3, title: 'مراحل النمو: ماذا تتوقع', category: 'croissance', content: 'تابع نمو طفلك مع دليلنا الشامل لمراحل التطور. كل طفل ينمو بوتيرته الخاصة، لكن هناك معالم مهمة يجب مراقبتها.', excerpt: 'فهم أنماط النمو عند الأطفال...' },
        { id: 4, title: 'إدارة ردود الفعل التحسسية في المنزل', category: 'allergie', content: 'خطوات سريعة لإدارة ردود الفعل التحسسية بأمان في المنزل. تعلم كيفية التعرف على علامات الخطر والتصرف بسرعة في حالات الطوارئ.', excerpt: 'إدارة ردود الفعل التحسسية في المنزل...' },
        { id: 5, title: 'تقديم الأطعمة الصلبة بأمان', category: 'nutrition', content: 'تعلم أفضل الممارسات لتقديم الأطعمة الصلبة لرضيعك. التقديم التدريجي ومراقبة ردود الفعل ضروريان لتغذية صحية.', excerpt: 'تقديم آمن للأطعمة الصلبة...' },
        { id: 6, title: 'جدول التطعيم وفوائده', category: 'croissance', content: 'افهم أهمية التطعيمات في رحلة صحة طفلك. الالتزام بجدول التطعيم يحمي طفلك من أمراض خطيرة عديدة.', excerpt: 'دليل التطعيم الشامل...' },
      ]
    : [
        { id: 1, title: 'Understanding Food Allergies in Infants', category: 'allergie', content: 'Food allergies are common in infants. Learn how to identify symptoms and manage them safely. The most common allergens are milk, eggs, peanuts, wheat, fish, and soy. Gradual food introduction and careful monitoring are essential.', excerpt: 'A comprehensive guide to infant food allergies...' },
        { id: 2, title: 'Nutrition Guide for Growing Children', category: 'nutrition', content: 'Proper nutrition is essential for healthy child development. Discover the key nutrients needed at every stage of growth, from birth to adolescence.', excerpt: 'Essential nutrients for child development...' },
        { id: 3, title: 'Growth Milestones: What to Expect', category: 'croissance', content: 'Track your child\'s growth with our comprehensive milestone guide. Every child grows at their own pace, but certain benchmarks are important to monitor.', excerpt: 'Understanding growth patterns in children...' },
        { id: 4, title: 'Managing Allergic Reactions at Home', category: 'allergie', content: 'Quick steps to manage allergic reactions safely at home. Learn to recognize warning signs and act quickly in case of emergency.', excerpt: 'Home management of allergic reactions...' },
        { id: 5, title: 'Introducing Solid Foods Safely', category: 'nutrition', content: 'Learn the best practices for introducing solid foods to your infant. Gradual introduction and monitoring reactions are key to healthy eating.', excerpt: 'Safe introduction of solid foods...' },
        { id: 6, title: 'Vaccination Schedule and Benefits', category: 'croissance', content: 'Understand the importance of vaccinations in your child\'s health journey. Following the vaccination schedule protects your child from many serious diseases.', excerpt: 'Complete vaccination guide...' },
      ];

  const categories: Array<'allergie' | 'nutrition' | 'croissance'> = ['allergie', 'nutrition', 'croissance'];

  const filteredArticles = ARTICLES_TRANSLATED.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryLabel = (cat: string) => {
    if (cat === 'allergie') return `🔴 ${t('categoryAllergie')}`;
    if (cat === 'nutrition') return `🥗 ${t('categoryNutrition')}`;
    return `📈 ${t('categoryCroissance')}`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="space-y-1 pt-2">
          <h1 className="text-2xl font-bold text-foreground">{t('healthAdvice')}</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchArticles')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Categories */}
        <Tabs defaultValue="allergie">
          <TabsList className="grid w-full grid-cols-3">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {getCategoryLabel(cat)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-3 mt-3">
              {filteredArticles
                .filter((article) => article.category === category)
                .map((article) => (
                  <Card
                    key={article.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow border-border"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground text-sm leading-snug">{article.title}</h3>
                      <p className="text-xs text-muted-foreground">{article.excerpt}</p>
                      <div className="text-xs text-primary font-medium">{t('readMore')} →</div>
                    </div>
                  </Card>
                ))}
              {filteredArticles.filter((a) => a.category === category).length === 0 && (
                <Card className="p-8 text-center space-y-3">
                  <BookOpen size={28} className="mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">{t('noArticlesFound')}</p>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setSelectedArticle(null)}>
          <Card
            className="w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-3">
                <h2 className="text-xl font-bold text-foreground flex-1 leading-snug">{selectedArticle.title}</h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none flex-shrink-0"
                >
                  ×
                </button>
              </div>
              <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {getCategoryLabel(selectedArticle.category)}
              </span>
              <p className="text-sm text-foreground leading-relaxed">{selectedArticle.content}</p>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold mt-2 hover:bg-primary/90 transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
