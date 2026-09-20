import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../../components/Card";
import { FormError } from "../../../components/FormError";
import { useAuth } from "../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { getProfile, getProfilePhotoBlob } from "../services/profileService";
import { useProfileStore } from "../stores/useProfileStore";

export default function Profile() {
  const { user } = useAuth();
  const { photoUrl, userProfile, setProfile, setPhotoUrl } = useProfileStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getProfile();
        if (cancelled) {
          return;
        }
        setProfile(data);
        setErrorMessage(null);

        if (data.hasPhoto && !useProfileStore.getState().photoUrl) {
          const blob = await getProfilePhotoBlob();
          if (cancelled || !blob) {
            return;
          }
          setPhotoUrl(URL.createObjectURL(blob));
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getApiErrorMessage(error));
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [setPhotoUrl, setProfile]);

  const name = userProfile?.name ?? user?.name ?? "Usuário";
  const email = userProfile?.email ?? user?.email ?? "";

  return (
    <section className="mx-auto w-full max-w-lg">
      <Card>
        <CardHeader className="text-center">
          <p className="mb-1 text-sm font-medium uppercase tracking-widest text-brand">
            FGC Monitor
          </p>
          <h1 className="text-2xl font-semibold">Perfil</h1>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-7">
          <ProfileAvatar name={name} photoUrl={photoUrl} className="h-40 w-40" />

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-card-foreground"> {name}</h2>
          </div>

          <div className="grid grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
            </div>
            <div>
              <p className="text-sm text-card-foreground">{email}</p>
            </div>
          </div>

          {errorMessage && <FormError className="w-full">{errorMessage}</FormError>}

          <Link
            to="/perfil/editar"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Editar perfil
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
