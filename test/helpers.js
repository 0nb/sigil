import { createRawSnippet } from 'svelte';

export const snip = (html) => createRawSnippet(() => ({ render: () => html }));
