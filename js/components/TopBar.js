/* --------------------------------------------------------------
   Street Racer — TopBar component
   Coins and level readout for menu screens
   -------------------------------------------------------------- */
export default {
  name: 'TopBar',
  props: {
    coins: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  template: `
    <div class="top-bar">
      <div class="top-item">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 20 23 16.17 16.17"/></svg>
        <span class="top-label">Coins</span>
        <span class="top-val">{{ coins }}</span>
      </div>
      <div class="top-item">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/></svg>
        <span class="top-label">Level</span>
        <span class="top-val">{{ level }}</span>
      </div>
    </div>
  `,
};
