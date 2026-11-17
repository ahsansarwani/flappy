<template>
  <div class="overlay" role="region" aria-label="Track selection">
    <div class="icon icon--big">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    </div>
    <div class="title">TRACKS</div>
    <div class="subtitle">Choose a circuit to master.</div>
    <div class="track-grid" role="grid" aria-label="Unlocked tracks">
      <div
        v-for="t in unlocked"
        :key="t.id"
        class="track-card"
        role="gridcell"
        tabindex="0"
      >
        <div class="track-icon">
          <img
            v-if="getTrackImage(t.id)"
            :src="getTrackImage(t.id)"
            :alt="t.name"
            class="track-img"
          />
          <svg
            v-else
            :viewBox="t.svgViewBox"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-html="t.svg"
          />
        </div>
        <h3>{{ t.name }}</h3>
        <div class="track-stats">Unlocks at level {{ t.unlockLevel }}</div>
        <button
          class="btn"
          @click="$emit('race', t.id)"
          type="button"
        >
          <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          Race
        </button>
      </div>
      <div v-if="locked.length" class="locked-section">
        <div class="locked-label">Locked</div>
        <div class="track-grid" role="grid" aria-label="Locked tracks">
          <div
            v-for="t in locked"
            :key="t.id"
            class="track-card locked"
            role="gridcell"
            aria-disabled="true"
          >
            <div class="track-icon track-icon--locked">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 class="locked-title">{{ t.name }}</h3>
            <div class="track-stats locked-stats">Level {{ t.unlockLevel }}</div>
          </div>
        </div>
      </div>
    </div>
    <button class="btn secondary" @click="$emit('back')" type="button">Back</button>
  </div>
</template>

<script>
export default {
  name: 'TrackSelectScreen',
  props: {
    unlocked: { type: Array, default: () => [] },
    locked: { type: Array, default: () => [] },
    getTrackImage: { type: Function, required: true },
  },
  emits: ['race', 'back'],
};
</script>
