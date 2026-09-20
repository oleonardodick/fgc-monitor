import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/AlertDialog";
import { Card, CardContent, CardHeader } from "../../../components/Card";
import { FormError } from "../../../components/FormError";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { ProfileForm, type ProfileFormValues } from "../components/ProfileForm";
import {
  getProfile,
  getProfilePhotoBlob,
  updateProfile as updateProfileService,
} from "../services/profileService";
import { useProfileStore } from "../stores/useProfileStore";

export default function EditProfile() {
  const navigate = useNavigate();
  const { userProfile, photoUrl, setProfile, setPhotoUrl } = useProfileStore();
  const [pending, setPending] = useState<ProfileFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Carrega os dados atuais do perfil (valores frescos + foto atual).
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const profile = await getProfile();
        if (cancelled) {
          return;
        }
        setProfile(profile);

        if (profile.hasPhoto) {
          const blob = await getProfilePhotoBlob();
          if (!cancelled && blob) {
            setPhotoUrl(URL.createObjectURL(blob));
          }
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(getApiErrorMessage(error));
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [setProfile, setPhotoUrl]);

  // RN-004: antes de alterar os dados, o sistema questiona o usuário.
  const handleSubmit = useCallback(async (values: ProfileFormValues) => {
    setErrorMessage(null);
    setPending(values);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!pending) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const updated = await updateProfileService(pending);
      setProfile(updated);
      if (pending.photo) {
        console.log(photoUrl);
        const newPhotoUrl = URL.createObjectURL(pending.photo);
        setPhotoUrl(newPhotoUrl);
        console.log(newPhotoUrl);
      }
      navigate("/perfil");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
      setPending(null); // FA-002 / EX-001: usuário permanece na edição.
    } finally {
      setIsSubmitting(false);
    }
  }, [pending, photoUrl, setProfile, setPhotoUrl, navigate]);

  // RN-004: se o usuário desistir, nenhum dado deve ser alterado (FA-002).
  const handleCancelConfirmation = useCallback(() => {
    setPending(null);
  }, []);

  const handleCancelForm = useCallback(() => {
    navigate("/perfil");
  }, [navigate]);

  return (
    <section className="mx-auto w-full max-w-lg">
      <Card>
        <CardHeader className="text-center">
          <p className="mb-1 text-sm font-medium uppercase tracking-widest text-brand">
            FGC Monitor
          </p>
          <h1 className="text-2xl font-semibold">Editar perfil</h1>
        </CardHeader>

        <CardContent>
          {loadError && <FormError>{loadError}</FormError>}

          <ProfileForm
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            isSubmitting={false}
            errorMessage={errorMessage}
            userProfile={userProfile}
            photoUrl={photoUrl}
          />

          {pending && (
            <AlertDialog>
              <AlertDialogContent>
                <AlertDialogHeader type="Warning">
                  <AlertDialogTitle>
                    Deseja realmente atualizar suas informações de perfil?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta operação não poderá ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    variant="primary"
                    onClick={handleConfirm}
                    isLoading={isSubmitting}
                    loadingText="Atualizando..."
                  >
                    Confirmar
                  </AlertDialogAction>
                  <AlertDialogAction
                    variant="secondary"
                    onClick={handleCancelConfirmation}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
