import { handleCommand } from './commands';
import { renderPage } from './template';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface GuestbookPost {
  id: number;
  name: string;
  message: string;
  timestamp: number;
  ip: string;
  ua: string;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  GUESTBOOK: KVNamespace;
}

const MAX_POSTS = 200;

async function getPosts(kv: KVNamespace): Promise<GuestbookPost[]> {
  const raw = await kv.get('posts');
  if (!raw) return [];
  return JSON.parse(raw);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const headers = new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "script-src 'none'",
    });

    // POST /guestbook — create a new post
    if (url.pathname === '/guestbook' && request.method === 'POST') {
      const formData = await request.formData();
      let name = (formData.get('name') as string || '').trim();
      const message = (formData.get('message') as string || '').trim();

      if (!message) {
        return new Response(null, {
          status: 302,
          headers: { Location: '/?gb=1' },
        });
      }

      if (name.length > 50) name = name.slice(0, 50);
      if (!name) name = 'Anonymous';
      const safeMessage = message.slice(0, 2000);

      const posts = await getPosts(env.GUESTBOOK);
      const nextId = posts.length > 0 ? posts[0].id + 1 : 1;

      const ip = request.headers.get('cf-connecting-ip') || '';
      const ua = request.headers.get('user-agent') || '';

      posts.unshift({
        id: nextId,
        name,
        message: safeMessage,
        timestamp: Date.now(),
        ip,
        ua,
      });

      if (posts.length > MAX_POSTS) posts.length = MAX_POSTS;

      await env.GUESTBOOK.put('posts', JSON.stringify(posts));

      return new Response(null, {
        status: 302,
        headers: { Location: '/?gb=1' },
      });
    }

    // Terminal at root
    if (url.pathname === '/') {
      const cmd = url.searchParams.get('cmd') ?? '';
      const guestbookOpen = url.searchParams.has('gb');

      const posts = await getPosts(env.GUESTBOOK);

      if (!cmd && !url.searchParams.has('cmd')) {
        const html = renderPage({ output: '', instant: true, posts, guestbookOpen });
        return new Response(html, { headers });
      }

      const result = handleCommand(cmd);

      const html = renderPage({
        cmdEcho: escapeHtml(cmd),
        output: result.output,
        instant: result.instant,
        clear: result.clear,
        posts,
        guestbookOpen,
      });

      return new Response(html, { headers });
    }

    // Everything else: static assets (sigil.webm, etc.)
    return env.ASSETS.fetch(request);
  },
};
