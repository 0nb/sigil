import './app.css';
import { mount } from 'svelte';
import Handmade from './Handmade.svelte';

mount(Handmade, { target: /** @type {HTMLElement} */ (document.getElementById('app')) });
