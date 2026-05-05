import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, AlertCircle, Stethoscope, TrendingUp, Syringe } from 'lucide-react';

const TIMELINE_EVENTS = [
  {
    id: 1,
    type: 'meal',
    title: 'Apple and banana eaten',
    time: 'Today 2:30 PM',
    icon: Apple,
    color: 'text-green-600',
    details: 'No allergens detected',
  },
  {
    id: 2,
    type: 'symptom',
    title: 'Mild rash observed',
    time: 'Today 1:15 PM',
    icon: AlertCircle,
    color: 'text-red-600',
    details: 'Severity: 3/10, on left arm',
  },
  {
    id: 3,
    type: 'doctor',
    title: 'Visited Dr. Smith',
    time: 'Yesterday 10:00 AM',
    icon: Stethoscope,
    color: 'text-blue-600',
    details: 'General checkup, all good',
  },
  {
    id: 4,
    type: 'growth',
    title: 'Growth measurement recorded',
    time: '2 days ago',
    icon: TrendingUp,
    color: 'text-orange-600',
    details: 'Weight: 6.8 kg, Height: 58 cm',
  },
  {
    id: 5,
    type: 'vaccine',
    title: 'Polio 2 vaccination completed',
    time: '1 week ago',
    icon: Syringe,
    color: 'text-pink-600',
    details: 'No adverse reactions',
  },
  {
    id: 6,
    type: 'meal',
    title: 'Chicken and rice eaten',
    time: '1 week ago',
    icon: Apple,
    color: 'text-green-600',
    details: 'No allergens detected',
  },
];

export default function Timeline() {
  const categories = ['all', 'meal', 'symptom', 'doctor', 'growth', 'vaccine'];

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      all: 'All Events',
      meal: '🍎 Meals',
      symptom: '🔴 Symptoms',
      doctor: '👨‍⚕️ Doctor',
      growth: '📈 Growth',
      vaccine: '💉 Vaccines',
    };
    return labels[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
          <p className="text-muted">Complete history of health events</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            {categories.slice(0, 3).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {getCategoryLabel(cat).split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid w-full grid-cols-3 mt-2">
            {categories.slice(3).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {getCategoryLabel(cat).split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-4">
              <div className="space-y-3">
                {TIMELINE_EVENTS.filter((event) => category === 'all' || event.type === category).map(
                  (event, idx, filtered) => {
                    const Icon = event.icon;
                    const isLast = idx === filtered.length - 1;

                    return (
                      <div key={event.id} className="relative">
                        {/* Timeline line */}
                        {!isLast && (
                          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
                        )}

                        {/* Event */}
                        <Card className="p-4 flex gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center relative z-10">
                              <Icon size={20} className={event.color} />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                            <p className="text-sm text-muted">{event.time}</p>
                            <p className="text-xs text-muted/70 mt-1">{event.details}</p>
                          </div>
                        </Card>
                      </div>
                    );
                  }
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Empty State */}
        {TIMELINE_EVENTS.length === 0 && (
          <Card className="p-8 text-center space-y-3">
            <p className="text-muted">No events recorded yet</p>
            <p className="text-xs text-muted/70">Start tracking meals, symptoms, and doctor visits</p>
          </Card>
        )}
      </div>
    </div>
  );
}
