import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Star, Heart, ChevronLeft, MessageSquare, ThumbsUp } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';

const LOGO_URL = '/manus-storage/allenest-logo_9219c293.png';

export default function RateApp() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: hasFeedback } = trpc.premium.hasFeedback.useQuery();

  const submitMutation = trpc.premium.submitFeedback.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(
        language === 'fr' ? 'Merci pour votre avis ! 💙' :
        language === 'ar' ? 'شكراً على رأيك! 💙' :
        'Thank you for your feedback! 💙'
      );
    },
    onError: () => {
      toast.error(language === 'fr' ? 'Erreur lors de l\'envoi' : language === 'ar' ? 'خطأ في الإرسال' : 'Error submitting');
    }
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error(
        language === 'fr' ? 'Veuillez sélectionner une note' :
        language === 'ar' ? 'يرجى اختيار تقييم' :
        'Please select a rating'
      );
      return;
    }
    submitMutation.mutate({ rating, comment });
  };

  const ratingLabels = {
    1: language === 'fr' ? 'Très mauvais' : language === 'ar' ? 'سيء جداً' : 'Very poor',
    2: language === 'fr' ? 'Mauvais' : language === 'ar' ? 'سيء' : 'Poor',
    3: language === 'fr' ? 'Correct' : language === 'ar' ? 'مقبول' : 'Fair',
    4: language === 'fr' ? 'Bien' : language === 'ar' ? 'جيد' : 'Good',
    5: language === 'fr' ? 'Excellent !' : language === 'ar' ? 'ممتاز!' : 'Excellent!',
  };

  const activeRating = hoveredRating || rating;

  return (
    <div className="min-h-screen bg-background pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setLocation('/settings')} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Star className="w-6 h-6 text-yellow-500" />
        <h1 className="text-lg font-bold text-foreground">
          {language === 'fr' ? 'Évaluer l\'application' : language === 'ar' ? 'تقييم التطبيق' : 'Rate the App'}
        </h1>
      </div>

      <div className="px-4 pt-8 space-y-6">
        {submitted || hasFeedback ? (
          /* Thank you screen */
          <div className="text-center space-y-6 py-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'fr' ? 'Merci beaucoup !' : language === 'ar' ? 'شكراً جزيلاً!' : 'Thank you so much!'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'fr'
                  ? 'Votre avis nous aide à améliorer AlleNest pour toutes les familles.'
                  : language === 'ar'
                  ? 'رأيك يساعدنا على تحسين AlleNest لجميع العائلات.'
                  : 'Your feedback helps us improve AlleNest for all families.'}
              </p>
            </div>
            <img src={LOGO_URL} alt="AlleNest" className="w-20 h-20 rounded-2xl mx-auto object-cover shadow-lg" />
            <Button onClick={() => setLocation('/settings')} className="w-full max-w-xs mx-auto">
              {language === 'fr' ? 'Retour aux paramètres' : language === 'ar' ? 'العودة إلى الإعدادات' : 'Back to Settings'}
            </Button>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="text-center space-y-3">
              <img src={LOGO_URL} alt="AlleNest" className="w-20 h-20 rounded-2xl mx-auto object-cover shadow-lg" />
              <h2 className="text-2xl font-bold text-foreground">
                {language === 'fr' ? 'Vous aimez AlleNest ?' : language === 'ar' ? 'هل تحب AlleNest؟' : 'Enjoying AlleNest?'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {language === 'fr'
                  ? 'Dites-nous ce que vous pensez ! Votre avis compte vraiment pour nous.'
                  : language === 'ar'
                  ? 'أخبرنا برأيك! رأيك يهمنا حقاً.'
                  : 'Tell us what you think! Your opinion really matters to us.'}
              </p>
            </div>

            {/* Star Rating */}
            <Card className="p-6 space-y-4">
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-12 h-12 transition-colors ${
                        star <= activeRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {activeRating > 0 && (
                <p className="text-center font-semibold text-foreground text-lg animate-in fade-in">
                  {ratingLabels[activeRating as keyof typeof ratingLabels]}
                </p>
              )}
            </Card>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                {language === 'fr' ? 'Votre commentaire (optionnel)' :
                 language === 'ar' ? 'تعليقك (اختياري)' :
                 'Your comment (optional)'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  language === 'fr' ? 'Partagez votre expérience, suggestions d\'amélioration...' :
                  language === 'ar' ? 'شارك تجربتك، اقتراحات التحسين...' :
                  'Share your experience, improvement suggestions...'
                }
                className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows={4}
              />
            </div>

            {/* Quick feedback tags */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {language === 'fr' ? 'Sélection rapide :' : language === 'ar' ? 'اختيار سريع:' : 'Quick select:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  language === 'fr' ? 'Interface intuitive' : language === 'ar' ? 'واجهة سهلة' : 'Intuitive UI',
                  language === 'fr' ? 'IA très utile' : language === 'ar' ? 'الذكاء الاصطناعي مفيد' : 'Helpful AI',
                  language === 'fr' ? 'Facile à utiliser' : language === 'ar' ? 'سهل الاستخدام' : 'Easy to use',
                  language === 'fr' ? 'Besoin de plus de fonctionnalités' : language === 'ar' ? 'أحتاج المزيد من الميزات' : 'Need more features',
                  language === 'fr' ? 'Très recommandé' : language === 'ar' ? 'موصى به جداً' : 'Highly recommended',
                ].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setComment(prev => prev ? `${prev}, ${tag}` : tag)}
                    className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleSubmit}
              disabled={rating === 0 || submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  {language === 'fr' ? 'Envoi...' : language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5" />
                  {language === 'fr' ? 'Envoyer mon avis' : language === 'ar' ? 'إرسال رأيي' : 'Submit my review'}
                </div>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
