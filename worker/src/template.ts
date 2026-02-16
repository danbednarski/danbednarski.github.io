import type { GuestbookPost } from './index';

export interface TemplateOptions {
  cmdEcho?: string;
  output: string;
  instant?: boolean;
  clear?: boolean;
  posts: GuestbookPost[];
  guestbookOpen: boolean;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${String(d.getFullYear()).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function buildTypewriterLines(html: string): string {
  const lines = html.split('<br />');
  if (lines.length > 5) {
    return `<div class="cmd-output">${html}</div>`;
  }

  let delay = 0;
  const spans = lines.map(line => {
    const textLen = line.replace(/<[^>]*>/g, '').length;
    const charCount = Math.max(textLen, 1);
    const span = `<span style="--chars:${charCount};--delay:${delay}ms">${line}</span>`;
    delay += charCount * 28 + 100;
    return span;
  });

  return `<div class="cmd-output typewriter">${spans.join('\n')}</div>`;
}

function renderPost(post: GuestbookPost): string {
  return `<div class="gb-post">
      <div class="gb-post-header">
        <span class="gb-name">${escapeHtml(post.name)}</span>
        <span class="gb-date">${formatDate(post.timestamp)}</span>
        <span class="gb-id">No.${post.id}</span>
      </div>
      <div class="gb-post-body">${escapeHtml(post.message)}</div>
    </div>`;
}

export function renderPage(opts: TemplateOptions): string {
  const { cmdEcho, output, instant, clear, posts, guestbookOpen } = opts;
  const prompt = 'guest@darigo.su:~ $&nbsp;';

  let outputSection = '';
  if (cmdEcho !== undefined && !clear && output) {
    if (instant) {
      outputSection = `<div class="cmd-output">${output}</div>`;
    } else {
      outputSection = buildTypewriterLines(output);
    }
  }

  const welcomeSection = clear ? '' : `
    <div class="welcome">
      Welcome to <a target="_blank" href="https://github.com/darighost">D-WOS \u24B6</a> (Dari's Web OS)<br />
      Commands: <b>ls</b>, <b>cat</b>, <b>who</b>, <b>ps</b>
    </div>`;

  const postsHtml = posts.map(renderPost).join('\n');

  const checkedAttr = guestbookOpen ? ' checked' : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    height: 100%;
    background: white;
    font-family: 'Atkinson Hyperlegible Mono', monospace;
    font-size: 16px;
    color: #4a4a49;
  }
  a { color: black; text-decoration: underline dashed 2px; text-underline-offset: 4px; }

  .page {
    text-align: center;
    margin-bottom: 20px;
  }
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  #sigil-container { overflow: hidden; cursor: pointer; height: 260px; }
  #sigil-container video { margin-bottom: -10px; pointer-events: none; }
  #quote { font-size: 14px; }
  hr { width: 500px; margin: 10px auto 40px auto; }

  #terminal {
    overflow-y: auto;
    max-height: 400px;
    max-width: 500px;
    margin: 0 auto;
    text-align: left;
  }
  .welcome { margin-bottom: 1em; }
  .cmd-output { margin-top: 0.25em; }

  .typewriter span {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    max-width: 0;
    animation: type calc(var(--chars) * 28ms) steps(var(--chars)) var(--delay) forwards;
  }
  @keyframes type {
    to { max-width: 100%; }
  }

  form.terminal-form {
    display: flex;
    align-items: center;
    margin-top: 0.5em;
  }
  form.terminal-form label {
    white-space: nowrap;
    flex-shrink: 0;
  }
  form.terminal-form input {
    flex: 1;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background: transparent;
    caret-color: #4a4a49;
  }

  /* ── Guestbook toggle ── */
  #guestbook-toggle { display: none; }

  /* ── Guestbook overlay ── */
  #guestbook-modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
  }
  #guestbook-toggle:checked ~ #guestbook-modal { display: flex; }

  .gb-panel {
    background: #eef2ff;
    width: 90%;
    max-width: 550px;
    min-height: 80vh;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid #b7c5e4;
    position: relative;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    color: #000;
  }

  .gb-header {
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #b7c5e4;
  }
  .gb-header h1 {
    font-size: 28px;
    color: #800000;
    letter-spacing: -1px;
  }
  .gb-close {
    position: absolute;
    top: 8px;
    right: 12px;
    z-index: 1001;
    color: red;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    font-family: Arial, Helvetica, sans-serif;
    text-decoration: none;
  }
  .gb-close:hover { color: #c00; }

  .gb-inner {
    padding: 10px;
  }

  /* ── Pinned OP post ── */
  .gb-pinned {
    background: #d6daf0;
    border: 1px solid #b7c5e4;
    padding: 8px;
    margin-bottom: 10px;
  }
  .gb-pinned .gb-post-header {
    margin-bottom: 4px;
  }
  .gb-admin-name {
    color: #800080;
    font-weight: bold;
  }
  .gb-admin-trip {
    color: #228854;
  }

  /* ── Post form ── */
  .gb-form {
    padding: 10px 10px 0;
    margin-bottom: 10px;
  }
  .gb-form table { margin: 0 auto; }
  .gb-form td { padding: 2px 4px; }
  .gb-form td:first-child {
    font-weight: bold;
    text-align: right;
  }
  .gb-form input[type="text"] {
    width: 300px;
    padding: 2px 4px;
    font-size: 13px;
    border: 1px solid #aaa;
  }
  .gb-form textarea {
    width: 300px;
    height: 80px;
    padding: 2px 4px;
    font-size: 13px;
    font-family: Arial, Helvetica, sans-serif;
    border: 1px solid #aaa;
    resize: vertical;
  }
  .gb-form input[type="submit"] {
    padding: 2px 12px;
    font-size: 13px;
    cursor: pointer;
  }

  /* ── Posts ── */
  .gb-post {
    background: #d6daf0;
    border: 1px solid #b7c5e4;
    padding: 4px 6px;
    margin-bottom: 4px;
  }
  .gb-post-header {
    margin-bottom: 4px;
  }
  .gb-name {
    color: #117743;
    font-weight: bold;
  }
  .gb-date {
    color: #666;
    margin-left: 8px;
    font-size: 12px;
  }
  .gb-id {
    color: #800000;
    margin-left: 8px;
    font-size: 12px;
  }
  .gb-post-body {
    padding-top: 4px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .gb-empty {
    text-align: center;
    color: #666;
    padding: 20px;
    font-style: italic;
  }
</style>
</head>
<body>
  <div class="page">
    <header class="header">
      <label id="sigil-container" for="guestbook-toggle">
        <video width="270" muted autoplay loop playsinline>
          <source src="/sigil.webm" type="video/webm" />
        </video>
      </label>
      <p id="quote">
        <i>One day, you will be old enough to start reading fairytales again.</i><br />
        <span style="display:inline-block;padding-top:8px">- C.S. Lewis</span>
      </p>
    </header>
    <hr />
    <div id="terminal">
      ${welcomeSection}
      <form class="terminal-form" method="GET" action="/">
        <label>${prompt}</label>
        <input type="text" name="cmd" autocomplete="off" autofocus spellcheck="false" />
      </form>
      ${outputSection}
    </div>
  </div>

  <input type="checkbox" id="guestbook-toggle"${checkedAttr} />

  <div id="guestbook-modal">
    <div class="gb-panel">
    <label class="gb-close" for="guestbook-toggle">[x]</label>
    <div class="gb-header">
      <h1>/b/ - Guestbook</h1>
    </div>
    <div class="gb-inner">
      <div class="gb-form">
        <form method="POST" action="/guestbook">
          <table>
            <tr>
              <td>Name</td>
              <td><input type="text" name="name" placeholder="Anonymous" maxlength="50" /></td>
            </tr>
            <tr>
              <td>Message</td>
              <td><textarea name="message" maxlength="2000" required placeholder="Your message..."></textarea></td>
            </tr>
            <tr>
              <td></td>
              <td><input type="submit" value="Post" /></td>
            </tr>
          </table>
        </form>
      </div>

      <div class="gb-pinned">
        <div class="gb-post-header">
          <span class="gb-admin-name">Anonymous</span>
          <span class="gb-admin-trip">## Admin</span>
        </div>
        <div class="gb-post-body">Welcome to the guestbook. Say hi, leave a message, or just lurk.</div>
      </div>

      ${postsHtml || '<div class="gb-empty">No posts yet. Be the first!</div>'}
    </div>
    </div>
  </div>
</body>
</html>`;
}
