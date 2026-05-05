import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Plus } from 'lucide-react';

const GROWTH_DATA = [
  { date: '2024-01-15', weight: 3.5, height: 50, headCirc: 35 },
  { date: '2024-02-15', weight: 4.2, height: 52, headCirc: 36 },
  { date: '2024-03-15', weight: 5.1, height: 54, headCirc: 37 },
  { date: '2024-04-15', weight: 6.0, height: 56, headCirc: 38 },
  { date: '2024-05-15', weight: 6.8, height: 58, headCirc: 39 },
];

export default function Growth() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCirc: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // TODO: Call tRPC mutation to save growth record
    console.log(formData);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      headCirc: '',
    });
    setShowForm(false);
  };

  const latestRecord = GROWTH_DATA[GROWTH_DATA.length - 1];
  const previousRecord = GROWTH_DATA[GROWTH_DATA.length - 2];

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Growth Tracking</h1>
          <p className="text-muted">Monitor your child's development</p>
        </div>

        {/* Latest Measurements */}
        {latestRecord && (
          <Card className="card-gradient p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Latest Measurements</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-primary">{latestRecord.weight} kg</p>
                <p className="text-xs text-muted">Weight</p>
                {previousRecord && (
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp size={12} />
                    +{(latestRecord.weight - previousRecord.weight).toFixed(1)} kg
                  </p>
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-secondary">{latestRecord.height} cm</p>
                <p className="text-xs text-muted">Height</p>
                {previousRecord && (
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp size={12} />
                    +{(latestRecord.height - previousRecord.height).toFixed(1)} cm
                  </p>
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-orange-600">{latestRecord.headCirc} cm</p>
                <p className="text-xs text-muted">Head Circ.</p>
                {previousRecord && (
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <TrendingUp size={12} />
                    +{(latestRecord.headCirc - previousRecord.headCirc).toFixed(1)} cm
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Growth Chart Placeholder */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Growth Chart</h2>
          <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
            <p className="text-muted text-sm">Growth chart visualization coming soon</p>
          </div>
        </Card>

        {/* Previous Records */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Previous Records</h2>
          <div className="space-y-3">
            {GROWTH_DATA.slice().reverse().map((record, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{record.date}</p>
                  <p className="text-xs text-muted">{record.weight} kg • {record.height} cm</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-primary">{record.headCirc} cm</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Measurement Form */}
        {showForm && (
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Add Measurement</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 6.8"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 58"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headCirc" className="text-sm font-medium">
                  Head Circumference (cm)
                </Label>
                <Input
                  id="headCirc"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 39"
                  value={formData.headCirc}
                  onChange={(e) => handleInputChange('headCirc', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Add Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full h-12 text-base font-medium gap-2"
          >
            <Plus size={18} />
            Add Measurement
          </Button>
        )}
      </div>
    </div>
  );
}
