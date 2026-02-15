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

  /* ── Hide all checkbox toggles ── */
  #desktop-toggle,
  #start-toggle,
  #trash-toggle,
  #kali-toggle,
  #napster-toggle,
  #netscape-toggle,
  #aol-toggle,
  #pokeroom-toggle { display: none; }

  /* ══════════════════════════════════════════
     Win95 Desktop
     ══════════════════════════════════════════ */
  #desktop-modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: teal;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    color: black;
  }
  #desktop-toggle:checked ~ #desktop-modal { display: block; }

  /* ── Desktop icon area ── */
  .desktop-icons {
    position: absolute;
    top: 16px;
    left: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .desktop-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    cursor: pointer;
    text-decoration: none;
  }
  .desktop-icon img {
    width: 48px;
    height: 48px;
    image-rendering: pixelated;
  }
  .desktop-icon span {
    margin-top: 4px;
    color: white;
    text-align: center;
    font-size: 11px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    line-height: 1.2;
  }

  /* ── Taskbar ── */
  .taskbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 36px;
    background: #c0c0c0;
    border-top: 2px solid white;
    display: flex;
    align-items: center;
    padding: 2px 8px;
  }
  .start-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: #c0c0c0;
    border: 2px outset #dfdfdf;
    cursor: pointer;
    font-weight: bold;
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
  }
  .start-btn img {
    width: 20px;
    height: 20px;
    image-rendering: pixelated;
  }
  #start-toggle:checked ~ #desktop-modal .start-btn {
    border-style: inset;
  }
  .taskbar-clock {
    margin-left: auto;
    font-size: 11px;
    border: 1px inset #dfdfdf;
    padding: 2px 8px;
    background: #c0c0c0;
  }

  /* ── Start menu ── */
  .start-menu {
    display: none;
    position: absolute;
    bottom: 36px;
    left: 2px;
    width: 180px;
    background: #c0c0c0;
    border: 2px outset #dfdfdf;
    z-index: 1100;
  }
  #start-toggle:checked ~ #desktop-modal .start-menu { display: block; }
  .start-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    cursor: pointer;
    text-decoration: none;
    color: black;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
  }
  .start-menu-item:hover { background: #000080; color: white; }
  .start-menu-item img { width: 20px; height: 20px; image-rendering: pixelated; }
  .start-menu-item.disabled {
    color: #808080;
    cursor: default;
  }
  .start-menu-item.disabled:hover { background: transparent; color: #808080; }
  .start-menu-divider { border-top: 1px solid #808080; border-bottom: 1px solid white; margin: 2px 4px; }

  /* ══════════════════════════════════════════
     Win95 Window base styles
     ══════════════════════════════════════════ */
  .win-window {
    display: none;
    position: absolute;
    background: #c0c0c0;
    border: 2px outset #dfdfdf;
    min-width: 300px;
  }
  .win-titlebar {
    background: #000080;
    color: white;
    padding: 2px 4px;
    font-weight: bold;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .win-close {
    background: #c0c0c0;
    border: 2px outset #dfdfdf;
    color: black;
    font-size: 10px;
    font-weight: bold;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-decoration: none;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1;
  }
  .win-close:hover { border-style: inset; }
  .win-body {
    padding: 8px;
  }

  /* ── Recycling Bin window ── */
  #trash-window {
    top: 60px;
    left: 120px;
    width: 340px;
    z-index: 1050;
  }
  #trash-toggle:checked ~ #desktop-modal #trash-window { display: block; }
  .trash-file {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90px;
    cursor: pointer;
    text-decoration: none;
    color: black;
    padding: 4px;
  }
  .trash-file:hover { background: #000080; color: white; }
  .trash-file img { width: 32px; height: 32px; image-rendering: pixelated; }
  .trash-file span { font-size: 11px; text-align: center; margin-top: 2px; }
  .trash-body {
    background: white;
    min-height: 100px;
    padding: 12px;
    border: 2px inset #dfdfdf;
  }

  /* ── Image viewer (Kali) ── */
  #kali-window {
    top: 80px;
    left: 160px;
    z-index: 1060;
  }
  #kali-toggle:checked ~ #desktop-modal #kali-window { display: block; }
  .kali-body {
    background: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
  }
  .kali-body img {
    max-width: 300px;
    display: block;
  }

  /* ── Napster window ── */
  #napster-window {
    top: 50px;
    left: 140px;
    width: 420px;
    z-index: 1055;
  }
  #napster-toggle:checked ~ #desktop-modal #napster-window { display: block; }
  .napster-body {
    background: white;
    border: 2px inset #dfdfdf;
    max-height: 250px;
    overflow-y: auto;
  }
  .napster-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    font-family: Arial, Helvetica, sans-serif;
  }
  .napster-table th {
    background: #c0c0c0;
    border: 1px solid #808080;
    padding: 2px 6px;
    text-align: left;
    font-weight: bold;
  }
  .napster-table td {
    border: 1px solid #dfdfdf;
    padding: 2px 6px;
  }
  .napster-table audio { height: 24px; width: 120px; }

  /* ── Netscape window ── */
  #netscape-window {
    top: 70px;
    left: 180px;
    width: 360px;
    z-index: 1052;
  }
  #netscape-toggle:checked ~ #desktop-modal #netscape-window { display: block; }
  .netscape-body {
    background: white;
    border: 2px inset #dfdfdf;
    padding: 12px;
    font-size: 12px;
  }
  .netscape-body h3 { font-size: 14px; margin-bottom: 8px; }
  .netscape-body a {
    display: block;
    color: #0000ff;
    text-decoration: underline;
    margin: 6px 0;
    font-size: 12px;
    text-underline-offset: initial;
  }

  /* ── AOL Mail window ── */
  #aol-window {
    top: 40px;
    left: 100px;
    width: 400px;
    z-index: 1053;
  }
  #aol-toggle:checked ~ #desktop-modal #aol-window { display: block; }
  .aol-body {
    background: white;
    border: 2px inset #dfdfdf;
    padding: 12px;
    font-size: 12px;
    line-height: 1.5;
    max-height: 300px;
    overflow-y: auto;
  }
  .aol-header {
    border-bottom: 1px solid #c0c0c0;
    padding-bottom: 8px;
    margin-bottom: 8px;
    font-size: 11px;
    color: #666;
  }

  /* ══════════════════════════════════════════
     Pokeroom modal (above desktop)
     ══════════════════════════════════════════ */
  #pokeroom-modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 2000;
    align-items: center;
    justify-content: center;
  }
  #pokeroom-toggle:checked ~ #pokeroom-modal { display: flex; }
  .pr-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    cursor: pointer;
  }
  .pr-modal-content {
    position: relative;
    z-index: 1;
  }
  #pokeroom-close {
    position: fixed;
    top: 16px;
    right: 24px;
    z-index: 2001;
    color: #ccc;
    font-size: 32px;
    cursor: pointer;
    font-family: monospace;
    line-height: 1;
  }
  #pokeroom-close:hover { color: white; }

  /* ── Pokeroom game (scoped inside modal) ── */
  .pr-browser-warning {
    display: none;
    color: #ccc;
    font-family: monospace;
    font-size: 16px;
    text-align: center;
    padding: 2rem;
  }
  .pr-browser-warning a { color: #6cf; }
  @supports not (animation-timeline: scroll()) {
    .pr-browser-warning { display: block; }
    .pr-viewport { display: none !important; }
  }
  .pr-viewport {
    width: 470px;
    height: 470px;
    overflow: scroll;
    outline: none;
    position: relative;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-timeline-name: --pr-x, --pr-y;
    scroll-timeline-axis: inline, block;
    scroll-start: 215px 215px;
  }
  .pr-viewport::-webkit-scrollbar { display: none; }
  .pr-scroll {
    width: 900px;
    height: 900px;
    position: relative;
  }
  .pr-room-wrap {
    position: sticky;
    top: 0;
    left: 0;
    width: 470px;
    height: 470px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pr-room {
    width: 450px;
    height: 450px;
    border: 10px solid black;
    background-color: beige;
    position: relative;
    overflow: hidden;
  }
  .pr-player, .pr-companion {
    will-change: left, top;
  }
  .pr-player {
    position: absolute;
    width: 78px;
    height: 85px;
    z-index: 100;
    animation: pr-px linear, pr-py linear;
    animation-timeline: --pr-x, --pr-y;
    animation-fill-mode: both, both;
  }
  .pr-player img, .pr-companion img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center bottom;
    image-rendering: pixelated;
  }
  @keyframes pr-px  { 0% { left: -15px; }  100% { left: 345px; } }
  @keyframes pr-py  { 0% { top: -40px; }   100% { top: 350px; } }
  .pr-companion {
    position: absolute;
    width: 68px;
    height: 68px;
    z-index: 99;
    left: 30px;
    bottom: 30px;
  }
  .pr-desk {
    position: absolute;
    left: 150px;
    top: 10px;
    width: 90px;
    z-index: 50;
    pointer-events: none;
  }
  .pr-desk-link {
    position: absolute;
    left: 140px;
    top: 2px;
    width: 110px;
    height: 50px;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.6);
    color: white;
    font-family: Arial, sans-serif;
    font-size: 13px;
    font-weight: bold;
    text-decoration: none;
    border-radius: 6px;
    border: 2px solid rgba(255,255,255,0.4);
  }
  /* Speech bubble wrapper — fixed near companion in bottom-left */
  .pr-speech-wrap {
    position: absolute;
    left: 25px;
    bottom: 100px;
    z-index: 300;
    pointer-events: none;
    width: 200px;
    height: 60px;
  }
  .pr-speech {
    position: absolute;
    left: 0;
    top: 0;
    background: white;
    border: 2px solid black;
    border-radius: 10px;
    padding: 8px 12px;
    max-width: 200px;
    font-size: 13px;
    font-family: Arial, sans-serif;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    opacity: 0;
    animation: pr-bubble 3s ease both;
    animation-play-state: paused;
  }
  .pr-speech:nth-child(1) { animation-delay: 0.5s; }
  .pr-speech:nth-child(2) { animation-delay: 3.5s; }
  .pr-speech:nth-child(3) { animation-delay: 6.5s; }
  .pr-speech:nth-child(4) { animation-delay: 9.5s; }
  #pokeroom-toggle:checked ~ #pokeroom-modal .pr-speech {
    animation-play-state: running;
  }
  @keyframes pr-bubble {
    0%   { opacity: 0; }
    10%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }
  /* Triangle pointer — points down toward companion */
  .pr-speech::after {
    content: '';
    position: absolute;
    bottom: -10px; left: 15px;
    width: 0; height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid white;
  }
  .pr-speech::before {
    content: '';
    position: absolute;
    bottom: -13px; left: 13px;
    width: 0; height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 12px solid black;
    z-index: -1;
  }
  .pr-hint {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(0,0,0,0.5);
    font-family: Arial, sans-serif;
    font-size: 16px;
    z-index: 400;
    pointer-events: none;
    animation: pr-hint-fade 3s 1s both;
  }
  @keyframes pr-hint-fade { 0%{opacity:1} 70%{opacity:1} 100%{opacity:0} }
  .pr-viewport:focus .pr-hint,
  .pr-viewport:active .pr-hint { display: none; }

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
  <div class="page">
    <header class="header">
      <label id="sigil-container" for="desktop-toggle">
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
      <form method="GET" action="/">
        <label>${prompt}</label>
        <input type="text" name="cmd" autocomplete="off" autofocus spellcheck="false" />
      </form>
      ${outputSection}
    </div>
  </div>

  <!-- All checkbox toggles as siblings before modals -->
  <input type="checkbox" id="desktop-toggle" />
  <input type="checkbox" id="start-toggle" />
  <input type="checkbox" id="trash-toggle" />
  <input type="checkbox" id="kali-toggle" />
  <input type="checkbox" id="napster-toggle" />
  <input type="checkbox" id="netscape-toggle" />
  <input type="checkbox" id="aol-toggle" />
  <input type="checkbox" id="pokeroom-toggle" />

  <!-- ══ Win95 Desktop ══ -->
  <div id="desktop-modal">

    <!-- Desktop icons -->
    <div class="desktop-icons">
      <label class="desktop-icon" for="trash-toggle">
        <img src="/bin.png" alt="Recycling Bin" />
        <span>Recycling Bin</span>
      </label>
      <label class="desktop-icon" for="napster-toggle">
        <img src="/napster.png" alt="Napster" />
        <span>Napster</span>
      </label>
      <label class="desktop-icon" for="pokeroom-toggle">
        <img src="/pokeball.png" alt="Pokeroom" />
        <span>Pokeroom</span>
      </label>
    </div>

    <!-- App windows -->

    <!-- Recycling Bin -->
    <div id="trash-window" class="win-window">
      <div class="win-titlebar">
        <span>Recycling Bin</span>
        <label class="win-close" for="trash-toggle">&times;</label>
      </div>
      <div class="win-body">
        <div class="trash-body">
          <label class="trash-file" for="kali-toggle">
            <img src="/imgicon.svg" alt="image" />
            <span>Black Boobies.jpg</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Image viewer (Kali) -->
    <div id="kali-window" class="win-window">
      <div class="win-titlebar">
        <span>Image Preview - Black Boobies.jpg</span>
        <label class="win-close" for="kali-toggle">&times;</label>
      </div>
      <div class="win-body kali-body">
        <img src="/kali.webp" alt="Black Boobies" />
      </div>
    </div>

    <!-- Napster -->
    <div id="napster-window" class="win-window">
      <div class="win-titlebar">
        <span>Napster</span>
        <label class="win-close" for="napster-toggle">&times;</label>
      </div>
      <div class="win-body">
        <div class="napster-body">
          <table class="napster-table">
            <thead>
              <tr><th>Song</th><th>Artist</th><th>Play</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Cereal</td>
                <td>Dari</td>
                <td><audio controls preload="none"><source src="/cereal.mp3" type="audio/mpeg" /></audio></td>
              </tr>
              <tr>
                <td>Chillzara</td>
                <td>Dari</td>
                <td><audio controls preload="none"><source src="/chillzara.mp3" type="audio/mpeg" /></audio></td>
              </tr>
              <tr>
                <td>Gez</td>
                <td>Dari</td>
                <td><audio controls preload="none"><source src="/gez.mp3" type="audio/mpeg" /></audio></td>
              </tr>
              <tr>
                <td>Giants</td>
                <td>Dari</td>
                <td><audio controls preload="none"><source src="/giants.mp3" type="audio/mpeg" /></audio></td>
              </tr>
              <tr>
                <td>Jorge</td>
                <td>Dari</td>
                <td><audio controls preload="none"><source src="/jorge.mp3" type="audio/mpeg" /></audio></td>
              </tr>
              <tr>
                <td>Shutoff</td>
                <td>Dari</td>
                <td><audio controls preload="none"><source src="/shutoff.mp3" type="audio/mpeg" /></audio></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Netscape -->
    <div id="netscape-window" class="win-window">
      <div class="win-titlebar">
        <span>Netscape Navigator</span>
        <label class="win-close" for="netscape-toggle">&times;</label>
      </div>
      <div class="win-body">
        <div class="netscape-body">
          <h3>Bookmarks</h3>
          <a href="/">D-WOS Terminal</a>
          <a href="/#33chan">33chan</a>
        </div>
      </div>
    </div>

    <!-- AOL Mail -->
    <div id="aol-window" class="win-window">
      <div class="win-titlebar">
        <span>AOL Mail - Inbox (1)</span>
        <label class="win-close" for="aol-toggle">&times;</label>
      </div>
      <div class="win-body">
        <div class="aol-body">
          <div class="aol-header">
            <strong>From:</strong> Kali &lt;kali@aol.com&gt;<br />
            <strong>To:</strong> Dari &lt;dari@aol.com&gt;<br />
            <strong>Subject:</strong> miss you
          </div>
          <p>Hey bro,</p>
          <br />
          <p>I just wanted to say hi and that I miss you. Things have been busy but I think about you all the time. Remember when we used to play Pokemon together? Those were the best days.</p>
          <br />
          <p>I hope you're doing well. Come visit soon okay?</p>
          <br />
          <p>Love,<br />Kali</p>
        </div>
      </div>
    </div>

    <!-- Start menu -->
    <div class="start-menu">
      <label class="start-menu-item" for="netscape-toggle">
        <img src="/napster.png" alt="" /> Netscape
      </label>
      <label class="start-menu-item" for="aol-toggle">
        <img src="/pokeball.png" alt="" /> AOL Mail
      </label>
      <div class="start-menu-divider"></div>
      <span class="start-menu-item disabled">
        <img src="/bin.png" alt="" /> cmd.exe
      </span>
      <div class="start-menu-divider"></div>
      <a class="start-menu-item" href="/">
        <img src="/windows_logo.png" alt="" /> Shut Down
      </a>
    </div>

    <!-- Taskbar -->
    <div class="taskbar">
      <label class="start-btn" for="start-toggle">
        <img src="/windows_logo.png" alt="Windows" />
        Start
      </label>
      <span class="taskbar-clock">4:20 PM</span>
    </div>
  </div>

  <!-- ══ Pokeroom modal (above desktop) ══ -->
  <div id="pokeroom-modal">
    <label class="pr-overlay" for="pokeroom-toggle"></label>
    <div class="pr-modal-content">
      <label id="pokeroom-close" for="pokeroom-toggle">&times;</label>
      <div class="pr-browser-warning">
        <div>
          <p>This game requires <strong>Chrome</strong> or <strong>Edge</strong>.</p>
        </div>
      </div>
      <div class="pr-viewport" tabindex="0">
        <div class="pr-scroll">
          <div class="pr-room-wrap">
            <div class="pr-room">
              <div class="pr-player">
                <img src="/down_still.png" alt="player" />
              </div>
              <div class="pr-companion">
                <img src="/companion_down.png" alt="companion" />
              </div>
              <div class="pr-speech-wrap">
                <div class="pr-speech">Hi, I'm Mimikyu!</div>
                <div class="pr-speech">Use arrow keys to move around.</div>
                <div class="pr-speech">Walk to the desk to use the computer.</div>
                <div class="pr-speech">Have fun exploring!</div>
              </div>
              <img class="pr-desk" src="/desk.png" alt="desk">
              <a href="/#33chan" class="pr-desk-link">Computer</a>
              <div class="pr-hint">Click here, then use arrow keys</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
