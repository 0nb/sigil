<script>
  import { untrack } from 'svelte';
  import Line from './Line.svelte';

  /** @type {{ message?: string, kind?: 'err' | 'ok' | 'plain', timeout?: number }} */
  let { message = '', kind = 'plain', timeout = 4000 } = $props();

  // a notice comes from the `message` prop or from show(); show() repeats identical messages
  let seq = $state(0);
  let source = $state(/** @type {'prop' | 'call'} */ ('prop'));
  let called = $state({ text: '', kind: /** @type {'err' | 'ok' | 'plain'} */ ('plain') });
  let cleared = $state(false);

  const text = $derived(cleared ? '' : source === 'call' ? called.text : message);
  const shownKind = $derived(source === 'call' ? called.kind : kind);

  /**
   * @param {string} t
   * @param {'err' | 'ok' | 'plain'} [k]
   */
  export function show(t, k = 'plain') {
    called = { text: t, kind: k };
    source = 'call';
    cleared = false;
    seq++;
  }

  $effect(() => {
    message;
    untrack(() => {
      source = 'prop';
      cleared = false;
      seq++;
    });
  });

  $effect(() => {
    seq;
    if (!untrack(() => text) || !timeout) return;
    const t = setTimeout(() => (cleared = true), timeout);
    return () => clearTimeout(t);
  });
</script>

<div role="status" aria-live="polite" class="min-h-[1.55em]">
  {#if text}<Line kind={shownKind} announce={false}>{text}</Line>{/if}
</div>
