<script>
  // the same page as Typical.svelte, written by hand without sigil: the fair baseline
  const rows = [
    { id: 'a', short: '/x7kq2mp', dest: 'github.com/0nb/sigil', clicks: 1284 },
    { id: 'b', short: '/horizon', dest: '0nb.dev', clicks: 412 },
    { id: 'c', short: '/q3vbn8w', dest: 'docs.google.com/document/d/1x', clicks: 9 },
  ];
  const columns = ['short', 'dest', 'clicks'];
  const nav = [
    { href: '/', label: 'links', current: true },
    { href: '/keys', label: 'keys' },
  ];
  let page = $state(1);
  let url = $state('');
  let slug = $state('');
  let password = $state('');
  let expires = $state('');
</script>

<div>
  <header>
    <a href="/">fold</a>
    <nav>
      {#each nav as item (item.href)}<a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a>{/each}
    </nav>
  </header>
  <main>
    <form>
      <label for="url">destination url</label>
      <input id="url" name="url" bind:value={url} aria-invalid="true" />
      <p role="alert">err not a valid url.</p>
      <button type="submit">[ fold ]</button>
      <label>--slug <input name="slug" bind:value={slug} placeholder="auto" /></label>
      <label>--password <input name="password" bind:value={password} /></label>
      <label>--expires <input type="date" name="expires" bind:value={expires} /></label>
      <p role="status">ok ready</p>
    </form>
    <table>
      <caption>your links</caption>
      <thead><tr>{#each columns as c (c)}<th>{c}</th>{/each}</tr></thead>
      <tbody>
        {#each rows as row (row.id)}
          <tr tabindex="0" onclick={() => {}}>
            {#each columns as c (c)}<td title={String(row[c])}>{row[c]}</td>{/each}
          </tr>
        {/each}
      </tbody>
    </table>
    <nav aria-label="pages">
      <button type="button" disabled={page <= 1} onclick={() => (page -= 1)}>&lt;-</button>
      <span>{page}/4</span>
      <button type="button" disabled={page >= 4} onclick={() => (page += 1)}>-&gt;</button>
    </nav>
  </main>
</div>
