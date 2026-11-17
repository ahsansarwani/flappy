/* --------------------------------------------------------------
   Street Racer — TrackSelectScreen component
   Single-select track grid with confirm-to-race
   -------------------------------------------------------------- */
export default {
  name: 'TrackSelectScreen',
  props: {
    unlocked: { type: Array, default: () => [] },
    locked: { type: Array, default: () => [] },
    getImage: { type: Function, required: true },
    selectedId: { type: String, default: 'grid' },
  },
  emits: ['race', 'back', 'select'],
  computed: {
    selectedTrack() {
      return this.unlocked.find((t) => t.id === this.selectedId) || this.unlocked[0] || null;
    },
  },
  template: `
    <div class="overlay" role="region" aria-label="Track selection">
      <div class="icon icon--big">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <div class="title">TRACKS</div>
      <div class="subtitle">Pick a circuit, then confirm to race it.</div>
      <div class="track-grid" role="grid" aria-label="Unlocked tracks">
        <button
          v-for="t in unlocked"
          :key="t.id"
          type="button"
          class="track-card track-card-btn"
          :class="{ 'track-card-selected': t.id === selectedId }"
          role="gridcell"
          :aria-pressed="t.id === selectedId"
          @click="$emit('select', t.id)"
          @dblclick="$emit('race', t.id)"
        >
          <div class="track-icon">
            <img v-if="getImage(t.id)" :src="getImage(t.id)" :alt="t.name" class="track-img" />
            <svg v-else :viewBox="t.svgViewBox" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" v-html="t.svg"></svg>
          </div>
          <h3>{{ t.name }}</h3>
          <div class="track-stats">Unlocks at level {{ t.unlockLevel }}</div>
          <span class="track-select-badge" v-if="t.id === selectedId">SELECTED</span>
        </button>
        <div v-if="locked.length" class="locked-section">
          <div class="locked-label">Locked</div>
          <div class="track-grid" role="grid" aria-label="Locked tracks">
            <div v-for="t in locked" :key="t.id" class="track-card locked" role="gridcell" aria-disabled="true">
              <div class="track-icon track-icon--locked">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3 class="locked-title">{{ t.name }}</h3>
              <div class="track-stats locked-stats">Level {{ t.unlockLevel }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="track-select-actions">
        <button class="btn secondary" @click="$emit('back')" type="button">BACK</button>
        <button class="btn" :disabled="!selectedTrack" @click="$emit('race', selectedId)" type="button">
          <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          CONFIRM &amp; RACE
        </button>
      </div>
    </div>
  `,
};