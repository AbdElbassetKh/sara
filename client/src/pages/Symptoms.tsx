import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, Plus } from 'lucide-react';

const COMMON_SYMPTOMS = [
  { name: 'Rash', emoji: '🔴' },
  { name: 'Itching', emoji: '🤔' },
  { name: 'Swelling', emoji: '💧' },
  { name: 'Cough', emoji: '😷' },
  { name: 'Vomiting', emoji: '🤢' },
  { name: 'Diarrhea', emoji: '💩' },
  { name: 'Fever', emoji: '🌡️' },
  { name: 'Fatigue', emoji: '😴' },
];

export default function Symptoms() {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!selectedSymptom) return;
    // TODO: Call tRPC mutation to save symptom
    console.log({ symptom: selectedSymptom, severity, notes });
    setSelectedSymptom(null);
    setSeverity(5);
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Track Symptoms</h1>
          <p className="text-muted">Record any symptoms your child is experiencing</p>
        </div>

        {/* Alert */}
        <div className="alert-banner">
          <AlertCircle size={20} className="text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Track Correlations</p>
            <p className="text-xs text-muted">We'll correlate symptoms with meals for insights</p>
          </div>
        </div>

        {/* Symptom Selection */}
        <Card className="p-6 space-y-4">
          <Label className="text-sm font-medium">Select Symptom</Label>
          <div className="grid grid-cols-2 gap-3">
            {COMMON_SYMPTOMS.map((symptom) => (
              <Card
                key={symptom.name}
                className={`p-4 cursor-pointer transition-all border-2 text-center ${
                  selectedSymptom === symptom.name
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedSymptom(symptom.name)}
              >
                <div className="text-3xl mb-2">{symptom.emoji}</div>
                <p className="text-sm font-medium text-foreground">{symptom.name}</p>
              </Card>
            ))}
          </div>
        </Card>

        {/* Severity Slider */}
        {selectedSymptom && (
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Severity Level</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[severity]}
                  onValueChange={(value) => setSeverity(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{
                    backgroundColor: severity <= 3 ? '#10b981' : severity <= 6 ? '#f59e0b' : '#ef4444'
                  }}>
                  {severity}
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          </Card>
        )}

        {/* Notes */}
        {selectedSymptom && (
          <Card className="p-6 space-y-4">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes (Optional)
            </Label>
            <Input
              id="notes"
              placeholder="e.g., Started after lunch, worse on left arm..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-24 resize-none"
            />
          </Card>
        )}

        {/* Submit Button */}
        <Button
          disabled={!selectedSymptom}
          onClick={handleSubmit}
          className="w-full h-12 text-base font-medium gap-2"
        >
          <Plus size={18} />
          Record Symptom
        </Button>
      </div>
    </div>
  );
}
