/* --------------------------------------------------------------
   Street Racer — ResultsScreen component
   Victory/defeat summary with stats and new achievements
   -------------------------------------------------------------- */
import { ordinal } from '../utils.js';

export default {
  name: 'ResultsScreen',
  props: {
    result: { type: Object, default: null },
    resultText: { type: String, default: '' },
    achievements: { type: Array, default: () => [] },
  },
  emits: ['back'],
  computed: {
    won() {
      return !!(this.result && this.result.won);
    },
    positionLabel() {
      return this.result && this.result.position
        ? ordinal(this.result.position)
        : '--';
    },
    timeLabel() {
      return this.result && this.result.time
        ? this.result.time.toFixed(1)
        : 0;
    },
  },
  template: `
    <div class="overlay">
      <div class="icon icon--big" :class="{ 'icon--win': won }">
        <svg v-if="won" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 3L9 14l-2-2"/><polyline points="18 4 12 10 6 4"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
      </div>
      <div class="title" :class="{ 'text-win': won }">{{ won ? 'VICTORY' : 'DEFEAT' }}</div>
      <div class="result-big">{{ positionLabel }} place</div>
      <div class="result-sub">{{ resultText }}</div>
      <div class="stat-row flex-center">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Time <span class="val">{{ timeLabel }}s</span>
      </div>
      <div v-if="achievements.length" class="achievements-list">
        <div class="ach-chip" v-for="a in achievements" :key="a.id">
          <svg class="ach-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" v-html="a.svg"></svg>
          <span>{{ a.name }}</span>
        </div>
      </div>
      <button class="btn" @click="$emit('back')">Back to Menu</button>
    </div>
  `,
};
