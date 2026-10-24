import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: /** @type {HTMLElement} */ (document.getElementById('app')) });
