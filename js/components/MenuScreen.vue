<template>
  <div
    class="overlay menu-bg"
    role="region"
    aria-label="Main menu"
  >
    <div class="icon icon--big">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M5 5l7 7M17 5l-7 7"/></svg>
    </div>
    <div class="title">STREET RACER</div>
    <div class="subtitle">Offline arcade racing — no build, no assets, just drive.</div>

    <div class="car-preview">
      <div class="preview-title">Your Ride</div>
      <div class="preview-car">
        <car-model :color="car.color" :width="240" :height="120" />
      </div>
      <div class="preview-name">{{ car.name }}</div>
      <div class="preview-stats">{{ (car.maxSpeed * 10).toFixed(0) }} SPD &nbsp;|&nbsp; {{ (car.accel * 100).toFixed(0) }} ACC</div>
    </div>

    <div class="btn-group" role="group" aria-label="Game actions">
      <button
        class="btn"
        @click="$emit('start')"
        type="button"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        Start Race
      </button>
      <button
        class="btn secondary"
        @click="$emit('garage')"
        type="button"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="16" height="10" rx="2"/><path d="M18 6l-1.5 7.5L12 18l-4.5-4.5L6 6z"/></svg>
        Garage
      </button>
      <button
        class="btn secondary"
        @click="$emit('tracks')"
        type="button"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4-4 8-8 8s-8-4-8-8 4-8 8-8 8 4 8 8z"/><path d="M12 2v20"/></svg>
        Select Track
      </button>
    </div>
  </div>
</template>

<script>
import CarModel from './CarModel.js';

export default {
  name: 'MenuScreen',
  components: { CarModel },
  props: {
    car: { type: Object, required: true },
  },
  emits: ['start', 'garage', 'tracks'],
};
</script>
