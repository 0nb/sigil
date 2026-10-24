import './app.css';
import { mount } from 'svelte';
import Baseline from './Baseline.svelte';

mount(Baseline, { target: /** @type {HTMLElement} */ (document.getElementById('app')) });
