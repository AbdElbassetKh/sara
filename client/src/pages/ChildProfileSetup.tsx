import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ALLERGEN_LIST, FEEDING_TYPES, GENDER_OPTIONS } from '@/const';
import { Upload, ArrowRight } from 'lucide-react';

export default function ChildProfileSetup() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '',
    feedingType: '',
    allergies: [] as string[],
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllergyToggle = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergen)
        ? prev.allergies.filter((a) => a !== allergen)
        : [...prev.allergies, allergen],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Submit form data to backend
    console.log('Form data:', formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Create Child Profile</h1>
          <p className="text-muted">Help us know your child better</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <Card className="p-6 space-y-4 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
            <Label className="text-sm font-medium">Child Photo (Optional)</Label>
            <div className="flex flex-col items-center gap-4">
              {photoPreview ? (
                <img src={photoPreview} alt="Child" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload size={32} className="text-primary/50" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>Upload Photo</span>
                </Button>
              </label>
            </div>
          </Card>

          {/* Basic Info */}
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Child's Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Emma"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium">
                Birth Date *
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium">
                Gender *
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === 'boy' ? 'Boy' : 'Girl'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedingType" className="text-sm font-medium">
                Feeding Type
              </Label>
              <Select value={formData.feedingType} onValueChange={(value) => handleInputChange('feedingType', value)}>
                <SelectTrigger id="feedingType">
                  <SelectValue placeholder="Select feeding type" />
                </SelectTrigger>
                <SelectContent>
                  {FEEDING_TYPES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Allergies */}
          <Card className="p-6 space-y-4">
            <Label className="text-sm font-medium">Known Allergies</Label>
            <div className="grid grid-cols-2 gap-3">
              {ALLERGEN_LIST.map((allergen) => (
                <div key={allergen} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergen}
                    checked={formData.allergies.includes(allergen)}
                    onCheckedChange={() => handleAllergyToggle(allergen)}
                  />
                  <Label htmlFor={allergen} className="text-sm cursor-pointer font-normal">
                    {allergen.charAt(0).toUpperCase() + allergen.slice(1).replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="p-6 space-y-4">
            <Label className="text-sm font-medium">Emergency Contact</Label>
            <div className="space-y-2">
              <Input
                placeholder="Contact name"
                value={formData.emergencyContactName}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              />
              <Input
                placeholder="Contact phone"
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              />
            </div>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!formData.name || !formData.birthDate || !formData.gender || isLoading}
            className="w-full h-12 text-base font-medium gap-2"
          >
            {isLoading ? 'Creating Profile...' : 'Create Profile'}
            {!isLoading && <ArrowRight size={18} />}
          </Button>
        </form>
      </div>
    </div>
  );
}
