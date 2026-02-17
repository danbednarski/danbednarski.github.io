export interface FileEntry {
  contents: string;
  permissions: string;
}

export const files: Record<string, FileEntry> = {
  'README.md': {
    contents: `
<ul>
<li><a target="_blank" href="https://lichess.org/@/pricklypears">Lichess</a></li>
<li>pricklypears on PokeMMO</li>
<li><a target="_blank" href="https://bookwyrm.social/user/pricklypears">BookWyrm</a></li>
</ul>
<p />Click the sigil above to open the guestbook.
`,
    permissions: '-rw-rw-r--'
  },
  '.somefile.txt': {
    contents: 'TODO: implement CTF in my own page here!',
    permissions: '-r--r--r--'
  }
};
