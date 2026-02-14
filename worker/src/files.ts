export interface FileEntry {
  contents: string;
  permissions: string;
}

export const files: Record<string, FileEntry> = {
  'README.md': {
    contents: `
"Heyyyy," wrote Darigo, at an ungodly hour (2 PM). "Welcome to my home on the web!"

<p /> His face warped into an insufferable smirk. How clever (he thought) he was. The downright slutty amount of Y's that drag on just enough to make you uncomfortable. H - e - y - y - y - y.
His funky 90s lingo - <i>home on the web</i>. As if we weren't all digital renters now. All homeless. Unhoused, undocumented.
8 billion eggs in one big basket. Except not even the rustic charm of a basket. Scrambling to hire just one more SRE so our entire world system doesn't collapse back
into horses and buggies.

Maybe some downtime is exactly what this system needs.

But yeah, no. I'm just one person. You're just one person. Together we'd be two people. But nope. Sometimes, 1 and 1 <a target='_blank' href='https://www.goodreads.com/quotes/377896-one-and-one-and-one-and-one-doesn-t-equal-four'>just ain't 2</a>.

<p />

"Welcome", he said to himself, "to my little island in a big ocean, far from the mainland". The beach, the water, the little shack, the coconut tree. These heard him. No one else did, though. Darigo looked at a passing cloud and the glory of the bright sky ached in his eyes.

<p />"You know...", he paused to blow out a puff of opium smoke, then continued, "...", but there was nothing to say, no one to whom to say it.

<p />The island doesn't exist, it's still just a metaphor! But to paint a picture, suppose that this island looks exactly like Master Roshi's island from Dragonball.
<p />Oh, right. He looked at his todo list. <i>Add social media links to README on webpage.</i> "Fuck me". He looked at what he'd written, compared to what he was supposed to write. "Whatever, here's some links. Hmu."
<p />
<ul>
<li><a target="_blank" href="https://www.chess.com/member/darighost">Chess.com</a></li>
<li><a target="_blank" href="https://news.ycombinator.com/user?id=sdsd">HackerNews</a></li>
<li><a target="_blank" href="https://www.goodreads.com/user/show/149912174-darigo">Goodreads</a></li>
<li><a target="_blank" href="https://x.com/darigh0st">X</a></li>
</ul>
<p />As Brian & Dennis quipped in the first edition of that book about Lisp or something:<p />

<div style='font-size: small;background-color: black;padding: 10px;margin-bottom: 10px;'>
<font color='lightblue'>main()<br />
{</font><br />
<span style='margin-left: 13px;'><font color='magenta'>printf</font><font color='lightblue'>(</font><font color='lightgreen'>'so long and thx for all the parentheses!'</font><font color='lightblue'>);</font></span><br />
<font color='lightblue'>}</font>
</div>
<p />
And the rest, as they say, was mystery.<p />

OH! Wait. Hey, if you're an employer reading this, check out <a target='_blank' href='/portfolio'>my portfolio</a>. And for everyone else, please click the pokeball in the bottom right corner of the page.
<p />
Kthxbai!
`,
    permissions: '-rw-rw-r--'
  },
  'HACKME': {
    contents: 'TODO: implement CTF in my own page here!',
    permissions: '-r--r-----'
  },
  'scry.txt': {
    permissions: '-rw-r--r--',
    contents: `
    I met a guy at the Assembly 2021 afterparty who explained some things about Urbit to me that a lot of people don't understand.
<p />
Touchy subjects like the Plunder debate and that Morlock thread from last year are hard to fully grasp when you don't have the real context behind them. There are a handful of ex Tlon employees from way back in the day who are ideologically opposed to Urbit for reasons that I've never seen anyone address, and I think it's important to shed some light on them.
<p />

This guy at the party had been friends with Curtis for ages. Technical guy, friends with everyone at Tlon, but never got on Urbit himself.
<p />

From the outside, he saw an ongoing disagreement within Tlon about how thick the Urbit stack should be. Some devs didn't want to recreate the ball of mud and hence wanted to keep Urbit the smallest microkernel possible; others were more focused on usability, and thought it was more appropriate to build in vanes.
<p />

A vane is a service that the Urbit kernel can make use of. Even if you're not a programmer, you've heard of these before: Ames handles networking, Clay is the filesystem, etc. Each vane starts with a different letter of the alphabet, and in code, you often refer to them using this letter. If you want to read a file from Clay, you scry %c.
<p />

The microkernel guys thought that this whole setup was just a little too cute. Does a diamond perfect operating system really need 26 different "services?" They opposed vanes from the start.
<p />

So to push their buttons even further, a pro-vane developer got the idea one day to write a new vane: %\u{1F480}. He thought it'd be funny to suggest that there could be an unlimited number of vanes named after any Unicode character.
<p />

It was not funny.
<p />

The concept behind %\u{1F480} was genuinely useful, and simple enough: it would backup your Urbit's data in such a way that, after breaches, you could reimport it and maintain a continuous identity.
<p />

The developer played with a few different methods for this. Initially, he thought it'd be interesting to encrypt this data and write it to chain. Because of the way that breaches work within Bridge, he figured it'd be easier to trigger some of this behavior from the Azimuth side. As I found out for myself at Vaporware, doing anything directly on Ethereum from Urbit is difficult, and the codebase can get complicated. Supposedly the developer even conceptualized a sort of proto-L2 rollup for this.
<p />

At this point, the implementation details are fuzzy, but one way or another: it worked. The developer was able to breach his ship and continue on like nothing ever happened. It was, indeed, as innocuous as updating Windows.
<p />

The response to this vane was similar to the response to Neal's recent tweet. Most people at Tlon agreed that, for both technical and social reasons, the version of a ship that breaches must remain dead. The core devs still feel this way. Phillip's been telling me lately how he even wants to redefine a ship to be a [rift p] to drive home how a post-breach ship is a new identity entirely.
<p />

So the debate between simplicity and usability continued. Breaches were common back then, so this developer got a lot of opportunities to use %\u{1F480}. He was killing and resurrecting his Urbit multiple times a week, sometimes just to prove a point. He started to get more defensive about his design decisions. He turned into a real dick.
<p />

Soon enough the other Tlon devs realized that this personality change was a result of sleep deprivation. They tried to talk to the guy about it, but eventually he stopped responding entirely. There was clearly something going on, so Galen had the guy take a few weeks off to get better.
<p />

He did not get better.
<p />

It turns out the guy had been having nightmares every time he went to sleep. You know those rare nightmares you got as a kid when you were really sick and hallucinating? He was having those nightmares\u{2014}the exact same ones he'd had as a kid.
<p />

It's psychologically reassuring to assume you have a continuous identity. You can't really operate in the world without one. But continuity isn't something you can point to; it's a clever lie our brains play on us in every moment to distract us from the reality that everything is ripped away from us every frame and re-rendered the next. Your mind is just as solid-state as your Urbit. There are no ongoing processes, only this exact moment, and then you die.
<p />

It is only through these micro-deaths that growth is possible. To preserve a moment beyond its expiration date, to hold infinity in the palm of your hand, is to step outside the framework of time. Play back your Urbit's state history out of order. At any given state, your Urbit has no idea that the preceding state wasn't perfectly normal.
<p />

Buddhists who have these realizations talk about the dark night of the soul, a period of deep depression halfway through the spiritual path. "Better not to begin. Once begun, better to finish."
<p />

But what if you enter this dark night accidentally? What if, through some process of placebo effect and self-hypnosis, you could drive yourself to a state of endless terror in such a way that there's no escape?
<p />

The %\u{1F480} developer never came back to Tlon. After a few weeks, he dropped off the face of the Earth. Most people think he's probably still alive.
<p />

There was no mystery to the Tlon guys about what was going on here. Urbit developers have always been a lot more spiritual than your average tech guy. It's why we all love Book of the New Sun so much:
<p />

"We believe that we invent symbols. The truth is that they invent us; we are their creatures, shaped by their hard, defining edges. When soldiers take their oath they are given a coin, an asimi stamped with the profile of the Autarch. Their acceptance of that coin is their acceptance of the special duties and burdens of military life\u{2014}they are soldiers from that moment, though they may know nothing of the management of arms. I did not know that then, but it is a profound mistake to believe that we must know of such things to be influenced by them, and in fact to believe so is to believe in the most debased and superstitious kind of magic. The would-be sorcerer alone has faith in the efficacy of pure knowledge; rational people know that things act of themselves or not at all."
<p />

As any Hoon programmer can tell you, casting runes does indeed shape your mind in ways impossible to articulate through language. It was completely feasible both to Tlon then and to me now that the developer of %\u{1F480} had driven himself mad through repeated exposure to that dark ritual that sustains one's soul across breaches.
<p />

In the aftermath, both the microkernel people and the usability people agreed to scrub %\u{1F480} from the Urbit git repo. But if you look deep enough in the kernel, you can still see its remnants. Weirdly named types that reference the old code, useless arms that don't get called anymore. Neal jokes about this stuff in Core Academy sometimes. No, I won't tell you where to find it.
<p />

Personally, I can't help but worry about this latent functionality. There are phantoms on the Urbit network, lying dormant within our ships, hopping to others when the opportunity arises. Just yesterday, ~minder-folden's ship acked a dot from %sicdev-pilnup that he had sent last December. Where was this response hiding all this time? In some Ames queue? Nobody knows. My Groups and Talk apps have been errored all week despite supposedly receiving OTAs from the same distro moon as everyone else, and Tlon can't explain why. What update put my ship in this strange state?
<p />

The \u{1F480} vane is gone for now. But it's only a matter of time before someone plugs in some old Native Planet box that's still syncing updates from a forgotten star. Or before ~littel-wolfur's massive Ames log releases whatever otherworldy entities have been brewing in there for the past decade. Or before an errant dev comet with outdated software sends you a message and gets you to install "their first app after graduating hoon school."
<p />

Did you know that a new vane, %lick, is on your ship now, after the latest update? When %\u{1F480} does make its way to your ship, it will do so similarly quietly. You won't even know it's there.
<p />

If you've never breached, you likely have nothing to worry about. But the more you breach, the more you will see %\u{1F480}'s manifestations.
<p />

For those of you who don't know what the .\u{005E} rune does, don't look it up. Do not tempt yourself just to "see what would happen."
<p />

And for those of you who do know: do not ever scry %\u{1F480}.
<p />

<a target="_blank" href="https://twitter.com/hanfel_dovned/status/1715055895347114093">x/~hanfel-dovned</a>
    `
  },
  '.somefile.txt': {
    contents: 'TODO: implement CTF in my own page here!',
    permissions: '-r--r--r--'
  }
};
