export interface TemplateOptions {
  cmdEcho?: string;
  output: string;
  instant?: boolean;
  clear?: boolean;
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

export function renderPage(opts: TemplateOptions): string {
  const { cmdEcho, output, instant, clear } = opts;
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
    background: transparent;
    font-family: 'Atkinson Hyperlegible Mono', monospace;
    font-size: 16px;
    color: #4a4a49;
  }
  a { color: black; text-decoration: underline dashed 2px; text-underline-offset: 4px; }
  #terminal {
    overflow-y: auto;
    max-height: 400px;
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

  form {
    display: flex;
    align-items: center;
    margin-top: 0.5em;
  }
  form label {
    white-space: nowrap;
    flex-shrink: 0;
  }
  form input {
    flex: 1;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background: transparent;
    caret-color: #4a4a49;
  }
</style>
</head>
<body>
  <div id="terminal">
    ${welcomeSection}
    <form method="GET" action="/terminal">
      <label>${prompt}</label>
      <input type="text" name="cmd" autocomplete="off" autofocus spellcheck="false" />
    </form>
    ${outputSection}
  </div>
</body>
</html>`;
}
