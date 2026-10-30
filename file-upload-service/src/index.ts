import { writeFile } from 'node:fs/promises';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';

// Fail fast, like the backend: the same key signs the session cookie.
const { SECRET_KEY } = process.env;
if (!SECRET_KEY) {
  throw new Error('SECRET_KEY environment variable is required');
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// The type comes from the file's first bytes: the Content-Type and the name are
// both chosen by the client.
function detectImageExtension(bytes: Uint8Array): string | null {
  const startsWith = (signature: number[], offset = 0) =>
    signature.every((byte, i) => bytes[offset + i] === byte);

  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return 'png';
  if (startsWith([0xff, 0xd8, 0xff])) return 'jpg';
  // WebP: "RIFF", 4 bytes of file size, then "WEBP"
  if (
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    startsWith([0x57, 0x45, 0x42, 0x50], 8)
  )
    return 'webp';
  return null;
}

const app = new Hono();

// Credentials cannot be sent with a wildcard origin, so the origins are explicit.
app.use(
  '/*',
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') ?? [
      'http://localhost:3000',
    ],
    credentials: true,
  }),
);

app.get('/', (c) =>
  c.html(
    `<p>To use this service, POST on ${c.req.url + 'uploads'} 
    with a multipart form containing a "file" field with your file to store.</p>`,
  ),
);

app.use('/files/*', serveStatic({ root: '.' }));

app.post(
  '/uploads',
  jwt({ secret: SECRET_KEY, cookie: 'token' }),
  async (c) => {
    const { file } = await c.req.parseBody();
    if (!file || typeof file === 'string') {
      return c.json({ error: 'Missing file' }, 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return c.json({ error: 'File too large' }, 413);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const extension = detectImageExtension(bytes);
    if (!extension) {
      return c.json({ error: 'Unsupported file type' }, 415);
    }

    // The name and extension never come from the client: a crafted file.name
    // could escape files/, and the extension decides the type served back.
    const path = `files/${crypto.randomUUID()}.${extension}`;
    // Not Bun.write: under Bun 1.0.14 it kills the process on real-sized files.
    await writeFile(path, bytes);

    return c.json({ path, url: c.req.url.replace('uploads', path) });
  },
);

console.log('server ready');

process.on('SIGINT', () => {
  console.log('Exiting...');
  process.exit();
});

export default {
  port: process.env.PORT || 8000,
  // Rejects oversized bodies before they are buffered in memory (1 MB of margin
  // for the multipart overhead); the check in the route gives the exact limit.
  maxRequestBodySize: MAX_FILE_SIZE + 1024 * 1024,
  fetch: app.fetch,
};
