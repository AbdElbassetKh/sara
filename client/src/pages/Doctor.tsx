import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, Plus, FileText, Phone } from 'lucide-react';

const DOCTOR_VISITS = [
  {
    id: 1,
    doctorName: 'Dr. Sarah Smith',
    specialty: 'Pediatrics',
    date: '2024-05-01',
    notes: 'General checkup. All vital signs normal. Growth on track.',
    documents: 2,
  },
  {
    id: 2,
    doctorName: 'Dr. John Doe',
    specialty: 'Allergist',
    date: '2024-04-15',
    notes: 'Allergy testing completed. Milk allergy confirmed.',
    documents: 1,
  },
  {
    id: 3,
    doctorName: 'Dr. Emily Brown',
    specialty: 'Pediatrics',
    date: '2024-03-20',
    notes: 'Vaccination appointment. Polio 2 administered.',
    documents: 0,
  },
];

export default function Doctor() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // TODO: Call tRPC mutation to save doctor visit
    console.log(formData);
    setFormData({
      doctorName: '',
      specialty: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Doctor Visits</h1>
          <p className="text-muted">Track medical appointments and records</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center space-y-2 cursor-pointer hover:bg-muted/10 transition-colors">
            <Stethoscope size={24} className="mx-auto text-primary" />
            <p className="text-sm font-medium text-foreground">{DOCTOR_VISITS.length}</p>
            <p className="text-xs text-muted">Total Visits</p>
          </Card>
          <Card className="p-4 text-center space-y-2 cursor-pointer hover:bg-muted/10 transition-colors">
            <FileText size={24} className="mx-auto text-secondary" />
            <p className="text-sm font-medium text-foreground">3</p>
            <p className="text-xs text-muted">Documents</p>
          </Card>
        </div>

        {/* Doctor Contacts */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Phone size={20} />
            Emergency Contacts
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-muted/10 rounded-lg">
              <p className="text-sm font-medium text-foreground">Primary Pediatrician</p>
              <p className="text-sm text-muted">Dr. Sarah Smith</p>
              <p className="text-xs text-primary">+1 (555) 123-4567</p>
            </div>
            <div className="p-3 bg-muted/10 rounded-lg">
              <p className="text-sm font-medium text-foreground">Allergist</p>
              <p className="text-sm text-muted">Dr. John Doe</p>
              <p className="text-xs text-primary">+1 (555) 234-5678</p>
            </div>
          </div>
        </Card>

        {/* Visit History */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Recent Visits</h2>
          <div className="space-y-3">
            {DOCTOR_VISITS.map((visit) => (
              <Card key={visit.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{visit.doctorName}</h3>
                    <p className="text-xs text-muted">{visit.specialty}</p>
                  </div>
                  <span className="text-xs font-medium text-primary">{visit.date}</span>
                </div>
                <p className="text-sm text-muted">{visit.notes}</p>
                {visit.documents > 0 && (
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <FileText size={14} />
                    {visit.documents} document{visit.documents > 1 ? 's' : ''}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Add Visit Form */}
        {showForm && (
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Add Doctor Visit</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="doctorName" className="text-sm font-medium">
                  Doctor Name *
                </Label>
                <Input
                  id="doctorName"
                  placeholder="e.g., Dr. Sarah Smith"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-sm font-medium">
                  Specialty
                </Label>
                <Input
                  id="specialty"
                  placeholder="e.g., Pediatrics"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Visit Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </Label>
                <textarea
                  id="notes"
                  placeholder="Visit notes..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full p-2 border border-border rounded-lg text-sm resize-none h-24"
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
            Add Doctor Visit
          </Button>
        )}
      </div>
    </div>
  );
}
