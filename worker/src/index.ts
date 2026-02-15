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

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const headers = new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "script-src 'none'",
    });

    // Terminal at root
    if (url.pathname === '/') {
      const cmd = url.searchParams.get('cmd') ?? '';

      if (!cmd && !url.searchParams.has('cmd')) {
        const html = renderPage({ output: '', instant: true });
        return new Response(html, { headers });
      }

      const result = handleCommand(cmd);

      const html = renderPage({
        cmdEcho: escapeHtml(cmd),
        output: result.output,
        instant: result.instant,
        clear: result.clear,
      });

      return new Response(html, { headers });
    }

    // Everything else: static assets (sigil.webm, etc.)
    return env.ASSETS.fetch(request);
  },
};
