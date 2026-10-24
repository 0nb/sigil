<script>
  import {
    Sigil, Line, Status, Spinner, Empty, Prompt, Button, Check, Flag, Confirm,
    Ls, Readout, Pager, Scope, Spark, Shell, Code, Horizon, NotFound, Expired, Locked,
  } from '../src/lib/index.js';
  import { brandSvgs } from '../scripts/brand-svgs.js';

  const tokens = [
    ['ground', '#000000'], ['fg', '#e6e6e6'], ['dim', '#8a8a8a'],
    ['ghost', '#4a4a4a'], ['rule', '#2a2a2a'],
  ];
  const lum = (/** @type {string} */ hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (/** @type {string} */ hex) => ((lum(hex) + 0.05) / 0.05).toFixed(1);

  const sizes = [['tag', 'text-tag tracking-tag'], ['label', 'text-label'], ['small', 'text-small'], ['body', 'text-body'], ['input', 'text-input'], ['display', 'text-display']];

  const rules = [
    'no boxes, cards, borders around groups, radius or shadows. structure comes from spacing, alignment and one underline.',
    'inputs are prompts: a > marker, the value, a block cursor when focused, one underline.',
    'buttons are bracketed text: [ fold ]. the brackets are drawn in secondary text.',
    'options are flags: --slug auto  --password none  --expires never. clicking or pressing enter on a flag edits it in place.',
    'lists look like ls output: aligned columns, a tracked header in secondary text, a > marker on the hovered or focused row.',
    'messages are lines prefixed with err or ok. monochrome, no red, no green.',
    'confirmations are inline: delete /x7kq2mp? [ y ] [ n ].',
    'transient notices are a single status line, not toasts.',
    'loading is a braille spinner; static … under reduced motion.',
  ];
  const copy = ['lowercase. always.', 'short. say what happened and what to do.', 'err / ok, never colors.', 'no emoji. no marketing.'];

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
  const pts = [3, 9, 4, 12, 30, 22, 41].map((v, i) => ({ t: Date.UTC(2026, 9, 18 + i), v }));

  /** @type {{ show: (t: string, k?: 'err' | 'ok' | 'plain') => void } | undefined} */
  let status = $state();
  let page = $state(1);
  let answered = $state('');
  let horizon = $state(false);
  const brand = brandSvgs({ left: '0nb', right: 'est. 2023' });
  const frame = 'relative h-[400px] overflow-hidden border-b border-rule [transform:translateZ(0)] [&_.min-h-dvh]:min-h-[400px]';
</script>

{#if horizon}<Horizon />{/if}

{#snippet head(/** @type {string} */ t)}
  <h2 class="mb-4 text-tag tracking-tag text-dim">{t}</h2>
{/snippet}

<Shell
  name="sigil"
  nav={[{ href: '#tokens', label: 'tokens', current: true }, { href: '#components', label: 'components' }, { href: '#pages', label: 'pages' }, { href: '#assets', label: 'assets' }]}
  grid
  tags={{ left: '0nb', right: 'sigil v0.1.0' }}
>
  <div class="flex max-w-4xl flex-col gap-16 pb-24">
    <section id="tokens">
      {@render head('tokens')}
      <Ls caption="color tokens" columns={[{ key: 'name', label: 'token' }, { key: 'value', label: 'value', dim: true }, { key: 'ratio', label: 'on black', align: 'right' }]}
        rows={tokens.map(([name, value]) => ({ name, value, ratio: name === 'ground' ? '—' : ratio(value) + ':1' }))} key={(r) => r.name} />
      <p class="mt-3 text-small text-dim">ghost is decoration only.</p>
      <div class="mt-8 flex flex-col gap-2">
        {#each sizes as [name, cls] (name)}<p class={cls}>{name} · the quick brown fox · 0123456789</p>{/each}
      </div>
    </section>

    <section>
      {@render head('terminal rules')}
      <ul class="mb-10 flex flex-col gap-2 text-small">{#each rules as r (r)}<li><span class="text-dim">- </span>{r}</li>{/each}</ul>
      {@render head('copy rules')}
      <ul class="flex flex-col gap-2 text-small">{#each copy as r (r)}<li><span class="text-dim">- </span>{r}</li>{/each}</ul>
    </section>

    <section id="components" class="flex flex-col gap-10">
      {@render head('components')}
      <div class="flex items-center gap-6"><Sigil /><Sigil size={18} weight={2.4} /><Sigil size={64} title="0nb" /></div>
      <div class="flex flex-col gap-4">
        <Prompt name="url" label="destination url" placeholder="paste a long url" />
        <Prompt name="bad" label="bad url" value="developers.cloudflare com" error='not a valid url. check the dot before "com".' />
        <Prompt name="off" label="disabled" value="read only" disabled />
      </div>
      <div class="flex flex-wrap items-baseline gap-6">
        <Button type="button">fold</Button><Button type="button" disabled>fold</Button><Button href="#components">link</Button>
        <Check name="private" label="private" />
      </div>
      <div class="flex flex-wrap gap-6">
        <Flag name="slug" flag="slug" empty="auto" />
        <Flag name="lock" flag="password" kind="toggle" />
        <Flag name="domain" flag="domain" kind="choice" options={['fld.0nb.dev', '0nb.dev']} value="fld.0nb.dev" />
        <Flag name="expires" flag="expires" kind="date" empty="never" />
      </div>
      <div class="flex flex-col gap-2">
        <Line kind="err">not a valid url.</Line><Line kind="ok">link folded.</Line><Line>plain line.</Line>
        <div class="flex items-baseline gap-6"><Button type="button" onclick={() => status?.show('copied', 'ok')}>notify</Button><Status bind:this={status} timeout={2000} /></div>
        <Spinner />
      </div>
      <div class="flex items-baseline gap-4">
        {#if answered}<Line kind="ok">answered {answered}.</Line>{:else}<Confirm question="delete /x7kq2mp?" onyes={() => (answered = 'y')} onno={() => (answered = 'n')} />{/if}
      </div>
      <Ls caption="links" {columns} {rows} key={(r) => r.id} onrowclick={() => status?.show('row opened')} />
      <Ls caption="no links" {columns} rows={noRows} key={(r) => r.id}>
        {#snippet empty()}<Empty title="no links yet" hint="paste a url above and press enter." />{/snippet}
      </Ls>
      <Readout items={[{ key: 'clicks', value: 1284 }, { key: 'created', value: '3d ago' }, { key: 'destination', value: 'github.com/0nb/sigil' }]} />
      <div class="flex flex-col gap-3"><Pager {page} pages={12} onpage={(p) => (page = p)} /><Pager page={1} pages={3} href={(p) => `#p${p}`} /></div>
      <Scope points={pts} label="clicks, last 7 days" />
      <div class="grid gap-6 sm:grid-cols-2"><Scope points={[]} label="clicks" height={100} /><Scope points={[pts[0]]} label="clicks" height={100} /></div>
      <p class="text-small">trend <Spark values={[3, 9, 4, 12, 30, 22, 41]} /></p>
      <Code code="curl -X POST https://fld.0nb.dev/api/v2/links -d url=https://0nb.dev" />
      <div><Button type="button" onclick={() => (horizon = !horizon)}>horizon {horizon ? 'off' : 'on'}</Button></div>
    </section>

    <section id="pages" class="flex flex-col gap-6">
      {@render head('pages')}
      <div class={frame}><NotFound home="#pages" /></div>
      <div class={frame}><Expired home="#pages" /></div>
      <div class={frame}><Locked action="#pages" error="wrong password." /></div>
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
