<script>
  import { mount, unmount } from 'svelte';

  // renders a whole page in its own document, so its landmarks don't nest in the playground's
  /** @type {{ component: import('svelte').Component<any>, props?: Record<string, unknown>, title: string }} */
  let { component, props = {}, title } = $props();

  /** @type {HTMLIFrameElement | undefined} */
  let frame = $state();

  $effect(() => {
    const doc = frame?.contentDocument;
    if (!doc) return;
    doc.documentElement.lang = 'en';
    doc.title = title;
    for (const el of document.querySelectorAll('style, link[rel="stylesheet"]')) doc.head.append(el.cloneNode(true));
    const app = mount(component, { target: doc.body, props });
    return () => unmount(app);
  });
</script>

<iframe bind:this={frame} {title} class="block h-[400px] w-full border-b border-rule"></iframe>
