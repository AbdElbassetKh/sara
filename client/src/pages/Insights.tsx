import { Card } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const INSIGHTS = [
  {
    id: 1,
    type: 'warning',
    icon: AlertTriangle,
    title: 'Potential Allergen Pattern',
    description: 'Rash symptoms appear 2-3 hours after dairy products. Consider limiting milk intake.',
    severity: 'high',
    color: 'text-red-600',
  },
  {
    id: 2,
    type: 'insight',
    icon: Lightbulb,
    title: 'Nutrition Recommendation',
    description: 'Your child is getting adequate protein. Consider adding more iron-rich foods like spinach.',
    severity: 'medium',
    color: 'text-blue-600',
  },
  {
    id: 3,
    type: 'positive',
    icon: CheckCircle,
    title: 'Growth on Track',
    description: 'Growth measurements are within normal percentiles for age. Great job!',
    severity: 'low',
    color: 'text-green-600',
  },
  {
    id: 4,
    type: 'insight',
    icon: TrendingUp,
    title: 'Symptom Trend',
    description: 'Symptom frequency has decreased by 40% in the last 2 weeks.',
    severity: 'low',
    color: 'text-green-600',
  },
  {
    id: 5,
    type: 'warning',
    icon: AlertTriangle,
    title: 'Vaccination Reminder',
    description: 'Polio 3 vaccination is due next week. Schedule an appointment with your pediatrician.',
    severity: 'medium',
    color: 'text-orange-600',
  },
];

export default function Insights() {
  const getBackgroundColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
          <p className="text-muted">Personalized health recommendations powered by AI</p>
        </div>

        {/* Info Banner */}
        <Card className="card-gradient p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">
            🤖 Our AI analyzes your child's health data to provide personalized insights and recommendations.
          </p>
        </Card>

        {/* Insights List */}
        <div className="space-y-3">
          {INSIGHTS.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card
                key={insight.id}
                className={`p-4 border-2 ${getBackgroundColor(insight.severity)}`}
              >
                <div className="flex gap-3">
                  <Icon size={20} className={`${insight.color} flex-shrink-0 mt-1`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{insight.title}</h3>
                    <p className="text-sm text-muted mt-1">{insight.description}</p>
                    <div className="mt-2">
                      <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-white/50">
                        {insight.severity === 'high'
                          ? '🔴 High Priority'
                          : insight.severity === 'medium'
                          ? '🟡 Medium'
                          : '🟢 Low'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">💡 Health Tips</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-2xl">🥗</span>
              <div>
                <p className="font-medium text-foreground">Balanced Diet</p>
                <p className="text-sm text-muted">Ensure a mix of fruits, vegetables, and proteins daily.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">💧</span>
              <div>
                <p className="font-medium text-foreground">Stay Hydrated</p>
                <p className="text-sm text-muted">Offer water regularly throughout the day.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">😴</span>
              <div>
                <p className="font-medium text-foreground">Adequate Sleep</p>
                <p className="text-sm text-muted">Ensure 10-12 hours of quality sleep for optimal health.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
