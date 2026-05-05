import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const VACCINES = [
  { name: 'BCG', date: '2024-01-15', status: 'completed', nextDue: null },
  { name: 'Hepatitis B', date: '2024-01-15', status: 'completed', nextDue: null },
  { name: 'Polio 1', date: '2024-02-15', status: 'completed', nextDue: '2024-04-15' },
  { name: 'Polio 2', date: '2024-04-15', status: 'completed', nextDue: '2024-06-15' },
  { name: 'Polio 3', date: null, status: 'pending', nextDue: '2024-06-15' },
  { name: 'DPT 1', date: '2024-02-15', status: 'completed', nextDue: '2024-04-15' },
  { name: 'DPT 2', date: '2024-04-15', status: 'completed', nextDue: '2024-06-15' },
  { name: 'DPT 3', date: null, status: 'pending', nextDue: '2024-06-15' },
  { name: 'MMR', date: null, status: 'pending', nextDue: '2024-09-15' },
  { name: 'Varicella', date: null, status: 'pending', nextDue: '2024-12-15' },
];

export default function Vaccines() {
  const completedCount = VACCINES.filter((v) => v.status === 'completed').length;
  const pendingCount = VACCINES.filter((v) => v.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Vaccination Schedule</h1>
          <p className="text-muted">Track your child's vaccinations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted">Completed</p>
          </Card>
          <Card className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <p className="text-xs text-muted">Pending</p>
          </Card>
        </div>

        {/* Completed Vaccines */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Completed</h2>
          <div className="space-y-2">
            {VACCINES.filter((v) => v.status === 'completed').map((vaccine) => (
              <Card key={vaccine.name} className="p-4 flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{vaccine.name}</p>
                  <p className="text-sm text-muted">{vaccine.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pending Vaccines */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Upcoming</h2>
          <div className="space-y-2">
            {VACCINES.filter((v) => v.status === 'pending').map((vaccine) => (
              <Card key={vaccine.name} className="p-4 flex items-start gap-3 border-orange-200 bg-orange-50/50">
                <Clock size={20} className="text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{vaccine.name}</p>
                  <p className="text-sm text-muted">Due: {vaccine.nextDue}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Keep Updated</p>
              <p className="text-xs text-blue-800 mt-1">
                Vaccinations are crucial for your child's health. Follow the recommended schedule and consult with your pediatrician.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full h-12 text-base font-medium">
          Schedule Appointment
        </Button>
      </div>
    </div>
  );
}
