/* --------------------------------------------------------------
   Street Racer — ControlsHint component
   Keyboard hints shown during a race
   -------------------------------------------------------------- */
export default {
  name: 'ControlsHint',
  template: `
    <div class="controls-hint">
      <div><kbd>W</kbd><kbd>S</kbd><kbd>A</kbd><kbd>D</kbd> drive</div>
      <div><kbd>SPACE</kbd> boost &nbsp;|&nbsp; <kbd>SHIFT</kbd> brake</div>
    </div>
  `,
};
