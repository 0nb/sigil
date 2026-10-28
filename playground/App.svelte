<script>
  import {
    Sigil, Line, Status, Spinner, Empty, Field, Button, Check, Confirm,
    Ls, Readout, Tiles, Bars, Chip, Choice, Pager, Flap, Scope, Spark, Shell, Card, Code, Horizon, NotFound, Expired, Locked,
  } from '../src/lib/index.js';
  import { brandSvgs } from '../scripts/brand-svgs.js';
  import pkg from '../package.json';
  import Frame from './Frame.svelte';

  const tokens = [
    ['ground', '#000000'], ['fg', '#e6e6e6'], ['dim', '#8a8a8a'],
    ['ghost', '#4a4a4a'], ['rule', '#2a2a2a'], ['card', '#050505'], ['red', '#ff3b30'],
  ];
  const lum = (/** @type {string} */ hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (/** @type {string} */ hex) => ((lum(hex) + 0.05) / 0.05).toFixed(1);

  const sizes = [['tag', 'text-tag tracking-tag'], ['label', 'text-label'], ['small', 'text-small'], ['body', 'text-body'], ['lead', 'text-lead'], ['title', 'text-title'], ['display', 'text-display']];

  const rules = [
    'text is sans. mono only for links, slugs, codes and handles.',
    'one primary button per screen, for the main action. secondary for the rest, ghost for row actions.',
    'every field has a visible label. hints and errors sit under it, in plain words.',
    'cards group what belongs together: one rule, 10px radius. no shadows, no colour.',
    'confirmations use words: delete / keep. focus starts on the safe one.',
    'messages are lines prefixed with err or ok. monochrome, no red, no green.',
    'transient notices are a single status line, not toasts.',
    'loading is a braille spinner; static … under reduced motion.',
  ];
  const copy = ['lowercase. always.', 'short. say what happened and what to do next.', 'words over symbols.', 'no emoji. no marketing.'];

  const rows = [
    { id: 'a', short: '/x7kq2mp', dest: 'github.com/0nb/sigil', clicks: 1284 },
    { id: 'b', short: '/horizon', dest: '0nb.dev', clicks: 412 },
    { id: 'c', short: '/q3vbn8w', dest: 'docs.google.com/document/d/' + 'x'.repeat(300), clicks: 9 },
  ];
  const columns = [
    { key: 'short', label: 'short' },
    { key: 'dest', label: 'destination', dim: true },
    { key: 'clicks', label: 'clicks', align: /** @type {'right'} */ ('right') },
  ];
  /** @type {typeof rows} */
  const noRows = [];
  const links = [
    { id: 'a', short: 'fld.0nb.dev/signup-form', dest: 'docs.google.com/forms/d/e/1FAIpQLSf/viewform', tags: ['just now'], week: [0, 0, 0, 0, 0, 0, 0] },
    { id: 'b', short: 'fld.0nb.dev/x7kq2mp', dest: 'www.example.com/blog/2026/10/how-we-built-a-tiny-link-shortener', tags: ['password', 'ends dec 31'], week: [9, 12, 10, 21, 17, 26, 33] },
    { id: 'c', short: 'fld.0nb.dev/hello', dest: '0nb.dev', tags: ['business card'], week: [2, 2, 3, 2, 3, 2, 3] },
  ];
  const pts = [3, 9, 4, 12, 30, 22, 41].map((v, i) => ({ t: Date.UTC(2026, 9, 18 + i), v }));

  /** @type {{ show: (t: string, k?: 'err' | 'ok' | 'plain') => void } | undefined} */
  let status = $state();
  let page = $state(1);
  let answered = $state('');
  let horizon = $state(false);
  let range = $state('24h');
  let period = $state('7d');
  const brand = brandSvgs({ left: '0nb', right: 'est. 2023' });
</script>

{#if horizon}<Horizon />{/if}

{#snippet head(/** @type {string} */ t)}
  <h2 class="mb-4 text-tag tracking-tag text-dim">{t}</h2>
{/snippet}

<Shell
  name="sigil"
  nav={[{ href: '#tokens', label: 'tokens', current: true }, { href: '#components', label: 'components' }, { href: '#dashboard', label: 'dashboard' }, { href: '#pages', label: 'pages' }, { href: '#assets', label: 'assets' }]}
  grid
  tags={{ left: '0nb', right: `sigil v${pkg.version}` }}
>
  <div class="flex max-w-4xl flex-col gap-16 pb-24">
    <h1 class="sr-only">sigil</h1>
    <section id="tokens">
      {@render head('tokens')}
      <Ls caption="color tokens" columns={[{ key: 'name', label: 'token' }, { key: 'value', label: 'value', dim: true }, { key: 'ratio', label: 'on black', align: 'right' }]}
        rows={tokens.map(([name, value]) => ({ name, value, ratio: name === 'ground' ? '—' : ratio(value) + ':1' }))} key={(r) => r.name} />
      <p class="mt-3 text-small text-dim">ghost, rule and card are decoration only.</p>
      <div class="mt-8 flex flex-col gap-2">
        {#each sizes as [name, cls] (name)}<p class={cls}>{name} · the quick brown fox · 0123456789</p>{/each}
      </div>
    </section>

    <section>
      {@render head('look rules')}
      <ul class="mb-10 flex flex-col gap-2 text-small">{#each rules as r (r)}<li><span class="text-dim">- </span>{r}</li>{/each}</ul>
      {@render head('copy rules')}
      <ul class="flex flex-col gap-2 text-small">{#each copy as r (r)}<li><span class="text-dim">- </span>{r}</li>{/each}</ul>
    </section>

    <section id="components" class="flex flex-col gap-10">
      {@render head('components')}
      <div class="flex items-center gap-6"><Sigil /><Sigil size={18} weight={2.4} /><Sigil size={64} title="0nb" /></div>
      <div class="flex flex-col gap-4">
        <Field name="bad" label="bad link" value="developers.cloudflare com" mono error="that doesn't look like a link. check the dot before “com”." />
        <Field name="off" label="disabled" value="read only" disabled />
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Button type="button" variant="primary">save</Button><Button type="button">cancel</Button><Button type="button" variant="ghost">stats</Button><Button type="button" size="small">copy</Button><Button type="button" variant="primary" disabled>sending</Button><a href="#components" class="sg-btn" data-variant="ghost">link</a>
        <Check name="private" label="private" />
      </div>
      <div class="max-w-xs"><Field name="find" label="search" type="search" labelHidden placeholder="search your links" /></div>
      <div class="flex flex-col gap-2">
        <Line kind="err">not a valid url.</Line><Line kind="ok">link folded.</Line><Line>plain line.</Line>
        <div class="flex items-baseline gap-6"><Button type="button" onclick={() => status?.show('copied', 'ok')}>notify</Button><Status bind:this={status} timeout={2000} /></div>
        <Spinner />
      </div>
      <div class="flex items-baseline gap-4">
        {#if answered}<Line kind="ok">answered {answered}.</Line>{:else}<Confirm question="delete fld.0nb.dev/x7kq2mp?" onyes={() => (answered = "delete")} onno={() => (answered = "keep")} />{/if}
      </div>
      <Card as="section"><Ls caption="links" {columns} {rows} key={(r) => r.id} /></Card>
      <Ls caption="no links" {columns} rows={noRows} key={(r) => r.id}>
        {#snippet empty()}<Empty title="no links yet" hint="paste a url above and press enter." />{/snippet}
      </Ls>
      <div class="max-w-md rounded-card border border-rule bg-card">
        <Flap label="example: a long link folded into fld.0nb.dev/merino">
          {#snippet before()}<p class="flex h-full flex-col justify-center gap-2 px-5"><span class="text-label text-dim">the long one</span><span class="font-mono text-[13px] break-all text-dim">https://shop.example.com/collections/autumn-2026/products/merino-crew-sweater?variant=44718</span></p>{/snippet}
          {#snippet after()}<p class="flex h-full flex-col justify-center gap-2 px-5"><span class="text-label text-dim">your short link</span><span class="font-mono text-[24px]"><span class="text-dim">fld.0nb.dev/</span>merino</span></p>{/snippet}
        </Flap>
      </div>
      <Tiles items={[{ key: 'people', value: 128, hint: 'the last 7 days' }, { key: 'busiest day', value: 40, hint: 'friday' }, { key: 'link previews', value: 37, hint: 'not counted as people', dim: true }]} />
      <Tiles items={[{ key: 'links', value: 4 }, { key: 'people', value: 214 }, { key: 'countries', value: 12 }, { key: 'previews', value: 51, dim: true }]} />
      <Readout items={[{ key: 'clicks', value: 1284 }, { key: 'created', value: '3d ago' }, { key: 'destination', value: 'github.com/0nb/sigil' }]} />
      <div class="flex flex-col gap-3"><Pager {page} pages={12} onpage={(p) => (page = p)} /><Pager page={3} pages={3} label="last page" /></div>
      <div role="group" aria-label="range" class="flex flex-wrap gap-4">
        {#each ['24h', '7d', '30d', 'all'] as r (r)}<Button type="button" pressed={range === r} onclick={() => (range = r)}>{r}</Button>{/each}
      </div>
      <Scope points={pts} label="clicks, last 7 days" />
      <Scope points={pts} label="people per day" area />
      <Choice label="period" options={[{ value: '24h', label: '24h' }, { value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: 'all', label: 'all' }]} bind:value={period} />
      <div id="chips-nowrap" class="flex w-[300px] gap-1.5"><Chip text="password" lock /><Chip text={'a note that will not wrap '.repeat(12)} /></div>
      <div class="flex max-w-[200px] flex-wrap gap-1.5"><Chip text="password" lock /><Chip text="ends jan 31 2027" /><Chip text={'a very long note that has to truncate inside a narrow row '.repeat(5)} /></div>
      <div class="grid gap-4 sm:grid-cols-2">
        <Card><Bars label="countries" items={[{ key: 'belgium', n: 53 }, { key: 'netherlands', n: 28 }, { key: 'france', n: 15 }, { key: 'united states', n: 11 }]} /></Card>
        <Card><Bars label="countries, share" percent items={[{ key: 'belgium', n: 53 }, { key: 'netherlands', n: 28 }, { key: 'france', n: 15 }]} /></Card>
      </div>
      <div class="grid gap-6 sm:grid-cols-2"><Scope points={[]} label="clicks" height={100} /><Scope points={[pts[0]]} label="clicks" height={100} /></div>
      <p class="text-small">trend <Spark values={[3, 9, 4, 12, 30, 22, 41]} /></p>
      <Code code="curl -X POST https://fld.0nb.dev/api/v2/links -d url=https://0nb.dev" />
      <div><Button type="button" onclick={() => (horizon = !horizon)}>horizon {horizon ? 'off' : 'on'}</Button></div>
    </section>

    <section id="prose">
      {@render head('prose')}
      <article class="sg-prose max-w-xl">
        <p>reading pages, like terms or privacy. links in running text are <a class="sg-link" href="#prose">underlined</a>, so they never rely on colour alone.</p>
        <h2>a heading</h2>
        <p>a paragraph under it, with <code>fold_session</code> in code.</p>
        <ul><li>a list item</li><li>another one</li></ul>
      </article>
    </section>

    <section id="dashboard" class="flex flex-col gap-6">
      {@render head('dashboard')}
      <form class="sg-card flex flex-col gap-4" onsubmit={(e) => e.preventDefault()}>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field name="long" label="paste a long link" type="url" mono placeholder="https://" />
          <Button variant="primary">fold it</Button>
        </div>
        <details open class="text-small">
          <summary class="cursor-pointer text-dim">more options</summary>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <Field name="slug" label="custom ending" prefix="fld.0nb.dev/" mono hint="letters, numbers and dashes" />
            <Field name="expires" label="stop working on" type="date" hint="leave it empty and the link never stops" />
            <Field name="password" label="password" type="password" placeholder="none — anyone with the link can open it" autocomplete="new-password" />
            <Field name="note" label="note (only you see it)" placeholder="e.g. november newsletter" />
          </div>
        </details>
      </form>
      <div class="flex flex-wrap items-center justify-between gap-3 rounded-card border border-fg p-4">
        <div class="min-w-0"><p class="text-label text-dim">your short link is ready</p><p class="truncate font-mono text-lead">fld.0nb.dev/signup-form</p></div>
        <Button type="button" variant="primary" size="small">copy</Button>
      </div>
      <Card as="section">
        <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-title font-semibold">your links</h3>
          <div class="w-full sm:w-56"><Field name="q" label="search your links" type="search" labelHidden placeholder="search your links" /></div>
        </div>
        <ul>
          {#each links as l (l.id)}
            <li class="grid gap-3 border-t border-rule py-4 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-center">
              <div class="min-w-0">
                <p class="truncate font-mono">{l.short}</p>
                <p class="truncate text-small text-dim">{l.dest}</p>
                <p class="mt-1.5 flex flex-wrap gap-1.5">{#each l.tags as t (t)}<span class="rounded-ctl border border-rule px-1.5 text-tag text-dim">{t}</span>{/each}</p>
              </div>
              <p class="flex items-center gap-2 text-small text-dim sm:flex-col sm:items-start sm:gap-1"><Spark values={l.week} /><span><span class="text-fg">{l.week.reduce((a, b) => a + b, 0)}</span> this week</span></p>
              <div class="flex gap-1">
                <Button type="button" variant="ghost" size="small">copy</Button>
                <Button type="button" variant="ghost" size="small">stats</Button>
                <Button type="button" variant="ghost" size="small" label="more for {l.short}">⋯</Button>
              </div>
            </li>
          {/each}
        </ul>
      </Card>
    </section>

    <section id="pages" class="flex flex-col gap-6">
      {@render head('pages')}
      <Frame title="not found page" component={NotFound} props={{ home: "#pages" }} />
      <Frame title="expired page" component={Expired} props={{ home: "#pages" }} />
      <Frame title="locked page" component={Locked} props={{ error: "wrong password." }} />
    </section>

    <section id="assets" class="flex flex-col gap-6">
      {@render head('assets')}
      <div class="flex items-end gap-6">
        <div class="w-10 [&_svg]:h-auto [&_svg]:w-full">{@html brand.favicon}</div>
        <div class="w-24 [&_svg]:h-auto [&_svg]:w-full">{@html brand.avatar}</div>
      </div>
      <div class="[&_svg]:h-auto [&_svg]:w-full">{@html brand.og}</div>
      <div class="[&_svg]:h-auto [&_svg]:w-full">{@html brand.banner}</div>
      <Code code="pnpm brand --left fold --right fld.0nb.dev --out ../fold/public" />
    </section>
  </div>
</Shell>
