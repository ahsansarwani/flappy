/* --------------------------------------------------------------
   Street Racer — Entry Point
   Creates the Vue app, registers components, mounts it,
   then boots the Phaser engine behind the UI
   -------------------------------------------------------------- */
import App from './app.js';
import { registerComponents } from './components/index.js';
import { RACE } from './race.js';

const { createApp } = window.Vue;

window.keys = {};
window.addEventListener('keydown', (e) => { window.keys[e.code] = true; });
window.addEventListener('keyup', (e) => { window.keys[e.code] = false; });

const app = createApp(App);
registerComponents(app);
app.mount('#app');

RACE.init('phaser-game');
