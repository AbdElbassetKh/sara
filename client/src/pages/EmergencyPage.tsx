import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DANGER_SIGNS, EMERGENCY_NUMBERS, FIRST_AID_STEPS } from '@/const';
import { AlertTriangle, Phone } from 'lucide-react';

export default function EmergencyPage() {
  const [checkedSigns, setCheckedSigns] = useState<string[]>([]);

  const toggleSign = (sign: string) => {
    setCheckedSigns((prev) =>
      prev.includes(sign) ? prev.filter((s) => s !== sign) : [...prev, sign]
    );
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header - Red Alert */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
              <AlertTriangle size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-red-900">Emergency</h1>
          <p className="text-red-700">If your child shows any of these signs, call emergency immediately</p>
        </div>

        {/* Emergency Calls */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleCall(EMERGENCY_NUMBERS.ambulance)}
            className="h-16 text-lg font-bold bg-red-600 hover:bg-red-700 text-white gap-3"
          >
            <Phone size={24} />
            SAMU - {EMERGENCY_NUMBERS.ambulance}
          </Button>
          <Button
            onClick={() => handleCall(EMERGENCY_NUMBERS.police)}
            className="h-16 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white gap-3"
          >
            <Phone size={24} />
            Police - {EMERGENCY_NUMBERS.police}
          </Button>
          <Button
            onClick={() => handleCall(EMERGENCY_NUMBERS.fire)}
            className="h-16 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white gap-3"
          >
            <Phone size={24} />
            Fire - {EMERGENCY_NUMBERS.fire}
          </Button>
        </div>

        {/* Danger Signs */}
        <Card className="p-6 space-y-4 border-red-200 bg-red-50">
          <h2 className="text-lg font-bold text-red-900">Danger Signs</h2>
          <p className="text-sm text-red-700">Check any signs your child is experiencing:</p>
          <div className="space-y-3">
            {DANGER_SIGNS.map((sign) => (
              <div key={sign} className="flex items-center space-x-3">
                <Checkbox
                  id={sign}
                  checked={checkedSigns.includes(sign)}
                  onCheckedChange={() => toggleSign(sign)}
                />
                <label
                  htmlFor={sign}
                  className="text-sm font-medium text-red-900 cursor-pointer flex-1"
                >
                  {sign.replace(/_/g, ' ').charAt(0).toUpperCase() + sign.replace(/_/g, ' ').slice(1)}
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* First Aid Steps */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">First Aid Steps</h2>
          <div className="space-y-4">
            {FIRST_AID_STEPS.map((step: typeof FIRST_AID_STEPS[number], idx: number) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Important Note */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Always call emergency services first. These are guidelines only and do not replace
            professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
