import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Apple,
  AlertCircle,
  TrendingUp,
  Stethoscope,
  Activity,
  Syringe,
  Plus,
} from 'lucide-react';

const QUICK_ACTIONS = [
  { icon: Apple, label: 'Track Meal', color: 'text-green-600', path: '/meals' },
  { icon: AlertCircle, label: 'Emergency', color: 'text-red-600', path: '/emergency' },
  { icon: TrendingUp, label: 'AI Insights', color: 'text-blue-600', path: '/insights' },
  { icon: Stethoscope, label: 'Doctor', color: 'text-purple-600', path: '/doctor' },
  { icon: Activity, label: 'Growth', color: 'text-orange-600', path: '/growth' },
  { icon: Syringe, label: 'Vaccines', color: 'text-pink-600', path: '/vaccines' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Welcome Card */}
        <Card className="card-gradient p-6 space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Good Morning!</h1>
          <p className="text-muted text-sm">Emma is doing great today 🌟</p>
        </Card>

        {/* Health Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-primary">8</div>
            <p className="text-xs text-muted">Meals Tracked</p>
          </Card>
          <Card className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-secondary">2</div>
            <p className="text-xs text-muted">Symptoms</p>
          </Card>
          <Card className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-green-600">5</div>
            <p className="text-xs text-muted">Days Safe</p>
          </Card>
        </div>

        {/* Alert Banner */}
        <div className="alert-banner">
          <AlertCircle size={20} className="text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Potential Allergen Detected</p>
            <p className="text-xs text-muted">Peanuts in yesterday's meal may have caused symptoms</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, color, path }) => (
              <Button
                key={label}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all"
                onClick={() => (window.location.href = path)}
              >
                <Icon size={24} className={color} />
                <span className="text-xs font-medium text-foreground">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          <div className="space-y-2">
            {[
              { time: 'Today 2:30 PM', activity: 'Apple and banana eaten', type: 'meal' },
              { time: 'Today 1:15 PM', activity: 'Mild rash observed', type: 'symptom' },
              { time: 'Yesterday 10:00 AM', activity: 'Visited Dr. Smith', type: 'doctor' },
            ].map((item, idx) => (
              <Card key={idx} className="p-3 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.activity}</p>
                  <p className="text-xs text-muted">{item.time}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="floating-action-button" title="Add meal">
        <Plus size={24} />
      </button>
    </div>
  );
}
