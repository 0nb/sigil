import './app.css';
import { mount } from 'svelte';
import Typical from './Typical.svelte';

mount(Typical, { target: /** @type {HTMLElement} */ (document.getElementById('app')) });
