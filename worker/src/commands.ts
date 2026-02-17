import { files } from './files';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface CommandResult {
  output: string;
  instant?: boolean;
  clear?: boolean;
}

export function handleCommand(cmd: string): CommandResult {
  const parts = cmd.trim().split(/\s+/);
  const command = parts[0]?.toLowerCase() ?? '';
  const argument = parts[1];

  switch (command) {
    case '':
      return { output: '', instant: true };

    case 'ls':
      return {
        output: Object.keys(files)
          .filter(name => !name.startsWith('.'))
          .map(name => `${files[name].permissions} ${name}`)
          .join('<br />')
      };

    case 'who':
      return {
        output: `I'm pears, aka pricklypears.<p />Sabreur, <a target="_blank" href="https://narski.neocities.org/">rogue dev</a>, Walmart Plus subscriber.<p />`
      };

    case 'cat': {
      if (!argument) {
        return { output: 'Usage: cat &lt;filename&gt;' };
      }
      if (!(argument in files)) {
        return { output: 'The file you entered does not exist' };
      }
      return {
        output: files[argument].contents,
        instant: true
      };
    }

    default:
      return { output: 'Unknown command.' };
  }
}
