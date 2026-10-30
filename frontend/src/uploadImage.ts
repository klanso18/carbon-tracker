import axios from 'axios';

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = 'image/png,image/jpeg,image/webp';

export default async function uploadImage(file: File) {
  const form = new FormData();
  form.append('file', file);
  return axios.post<{
    url: string;
  }>(
    (process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT as string) || '/uploads',
    form,
    // The upload service authenticates with the session cookie
    { withCredentials: true },
  );
}

export function getUploadErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        return 'Votre session a expiré, reconnectez-vous.';
      case 413:
        return 'Image trop lourde (5 Mo maximum).';
      case 415:
        return 'Format non pris en charge (PNG, JPEG ou WebP).';
      default:
    }
  }
  return "Impossible d'enregistrer la photo, réessayez.";
}
