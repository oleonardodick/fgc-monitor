import {
  ALLOWED_PROFILE_PHOTO_MIME_TYPES,
  MAX_PROFILE_PHOTO_BYTES,
  type UserProfile,
  updateProfileSchema,
} from "@fgc-monitor/shared";
import { ImagePlus, Mail, User } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "../../../components/Button";
import { FileField } from "../../../components/FileField";
import { FormError } from "../../../components/FormError";
import { FormField } from "../../../components/FormField";
import { useZodForm } from "../../../hooks/useZodForm";
import { cn } from "../../../utils/merge";
import { ProfileAvatar } from "./ProfileAvatar";

export interface ProfileFormValues {
  name: string;
  email: string;
  photo?: File;
}

interface ProfileFormProps {
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
  userProfile: UserProfile | null;
  photoUrl: string | null;
}

/** Pré-validação client-side da foto (formato e tamanho — RN-003). */
function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_PROFILE_PHOTO_MIME_TYPES.includes(file.type)) {
    return "A foto deve estar no formato PNG ou JPG";
  }
  if (file.size > MAX_PROFILE_PHOTO_BYTES) {
    return "A foto enviada excede o limite de tamanho permitido";
  }
  return null;
}

export function ProfileForm({
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage,
  userProfile,
  photoUrl,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(updateProfileSchema, {
    defaultValues: { name: userProfile?.name ?? "", email: userProfile?.email ?? "" },
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhotoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPhotoError(null);
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
        setPhotoPreviewUrl(null);
      }
      setPhotoFile(null);

      const file = event.target.files?.[0] ?? null;
      if (!file) {
        return;
      }

      const validationError = validatePhotoFile(file);
      if (validationError) {
        setPhotoError(validationError);
        return;
      }

      setPhotoFile(file);
      setPhotoPreviewUrl(URL.createObjectURL(file));
    },
    [photoPreviewUrl],
  );

  const handleFormSubmit = handleSubmit((fields) =>
    onSubmit({
      name: fields.name,
      email: fields.email,
      photo: photoFile ?? undefined,
    }),
  );

  const previewUrl = photoPreviewUrl ?? photoUrl ?? null;

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
      <div className="flex items-center gap-4">
        <ProfileAvatar name={userProfile?.name ?? ""} photoUrl={previewUrl} className="h-24 w-24" />

        <FileField
          label="Foto"
          accept="image/png,image/jpeg"
          buttonLabel="Buscar foto"
          buttonIcon={ImagePlus}
          error={photoError}
          onChange={handlePhotoChange}
        />
      </div>

      <FormField
        label="Nome"
        type="text"
        autoComplete="name"
        placeholder="Seu nome"
        error={errors.name?.message}
        icon={User}
        iconPosition="right"
        className={cn(errors.name && "border-destructive focus:ring-destructive")}
        {...register("name")}
      />

      <FormField
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        icon={Mail}
        iconPosition="right"
        className={cn(errors.email && "border-destructive focus:ring-destructive")}
        {...register("email")}
      />

      {errorMessage && <FormError>{errorMessage}</FormError>}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" isLoading={isSubmitting} loadingText="Salvando...">
          Salvar
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
