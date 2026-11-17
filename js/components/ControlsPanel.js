/* --------------------------------------------------------------
   Street Racer — ControlsPanel component
   Collapsible controls reference (replaces the Alpine island)
   -------------------------------------------------------------- */
const { ref } = window.Vue;

export default {
  name: 'ControlsPanel',
  setup() {
    const open = ref(false);
    function toggle() { open.value = !open.value; }
    return { open, toggle };
  },
  template: `
    <div>
      <div class="controls-panel" v-show="open">
        <h3>Controls</h3>
        <div class="row"><kbd>W</kbd> Accelerate &nbsp; <kbd>S</kbd> Brake / Reverse</div>
        <div class="row"><kbd>A</kbd> <kbd>D</kbd> Steer left / right</div>
        <div class="row"><kbd>SPACE</kbd> Nitro boost &nbsp; <kbd>SHIFT</kbd> Drift assist</div>
      </div>
      <div class="toggle-hint" @click="toggle">{{ open ? 'Hide controls' : 'Show controls' }}</div>
    </div>
  `,
};
