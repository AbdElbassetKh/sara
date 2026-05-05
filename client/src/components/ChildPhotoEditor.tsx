import { useRef, useState } from 'react';
import { Camera, Upload, User, Check, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Child {
  id: number;
  name: string;
  photoUrl?: string | null;
  gender: string;
}

interface ChildPhotoEditorProps {
  child: Child;
  onPhotoUpdated?: (newPhotoUrl: string) => void;
}

export function ChildPhotoEditor({ child, onPhotoUpdated }: ChildPhotoEditorProps) {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const t = (fr: string, ar: string, en: string) =>
    language === 'fr' ? fr : language === 'ar' ? ar : en;

  const utils = trpc.useUtils();

  const uploadPhotoMutation = trpc.children.uploadPhoto.useMutation({
    onSuccess: (data) => {
      toast.success(t('Photo mise à jour avec succès !', 'تم تحديث الصورة بنجاح!', 'Photo updated successfully!'));
      setPreviewUrl(null);
      onPhotoUpdated?.(data.photoUrl);
      utils.children.list.invalidate();
    },
    onError: () => {
      toast.error(t("Erreur lors de l'upload", 'خطأ في رفع الصورة', 'Upload error'));
      setPreviewUrl(null);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('Image trop grande (max 5 Mo)', 'الصورة كبيرة جداً (الحد الأقصى 5 ميغابايت)', 'Image too large (max 5MB)'));
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);

      // Extract base64 data (remove the data:image/...;base64, prefix)
      const base64Data = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/jpeg';

      setIsUploading(true);
      uploadPhotoMutation.mutate({
        childId: child.id,
        base64Data,
        mimeType,
      });
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const currentPhoto = previewUrl || child.photoUrl;
  const genderColor = child.gender === 'girl' ? 'from-pink-400 to-rose-500' : 'from-sky-400 to-blue-500';

  return (
    <div className="flex items-center gap-4">
      {/* Avatar with photo or initials */}
      <div className="relative flex-shrink-0">
        <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gradient-to-br ${genderColor} flex items-center justify-center`}>
          {currentPhoto ? (
            <img
              src={currentPhoto}
              alt={child.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Upload overlay button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md border-2 border-background hover:bg-primary/90 transition-colors disabled:opacity-60"
          title={t('Changer la photo', 'تغيير الصورة', 'Change photo')}
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Camera className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Child info + upload button */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{child.name}</p>
        <p className="text-xs text-muted-foreground mb-2">
          {child.gender === 'girl'
            ? t('Fille', 'بنت', 'Girl')
            : t('Garçon', 'ولد', 'Boy')}
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 bg-primary/5 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors disabled:opacity-60"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {t('Upload en cours…', 'جارٍ الرفع…', 'Uploading…')}
            </>
          ) : child.photoUrl ? (
            <>
              <Upload className="w-3.5 h-3.5" />
              {t('Changer la photo', 'تغيير الصورة', 'Change photo')}
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5" />
              {t('Ajouter une photo', 'إضافة صورة', 'Add a photo')}
            </>
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
