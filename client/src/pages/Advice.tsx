import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ARTICLES } from '@/const';
import { Search, BookOpen } from 'lucide-react';

export default function Advice() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<(typeof ARTICLES)[number] | null>(null);

  const categories = ['allergie', 'nutrition', 'croissance'];
  const filteredArticles = ARTICLES.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Health Advice</h1>
          <p className="text-muted">Expert articles on child health and nutrition</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <Tabs defaultValue="allergie">
          <TabsList className="grid w-full grid-cols-3">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat === 'allergie' ? '🔴 Allergie' : cat === 'nutrition' ? '🥗 Nutrition' : '📈 Croissance'}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-3">
              {filteredArticles
                .filter((article) => article.category === category)
                .map((article) => (
                  <Card
                    key={article.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{article.title}</h3>
                      <p className="text-sm text-muted">{article.excerpt}</p>
                      <div className="text-xs text-primary font-medium">Read more →</div>
                    </div>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <Card className="p-8 text-center space-y-3">
            <BookOpen size={32} className="mx-auto text-muted/50" />
            <p className="text-muted">No articles found</p>
          </Card>
        )}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <Card className="w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-foreground flex-1">{selectedArticle.title}</h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-muted hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-muted capitalize">Category: {selectedArticle.category}</p>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed">{selectedArticle.content}</p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium mt-4"
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
