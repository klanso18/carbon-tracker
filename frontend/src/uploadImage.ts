import axios from 'axios';

export default async function uploadImage(file: File) {
  const form = new FormData();
  form.append('file', file);
  return axios
    .post<{
      url: string;
    }>(
      (process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT as string) || '/uploads',
      form,
      // The upload service authenticates with the session cookie
      { withCredentials: true },
    )
    .catch(console.error);
}
