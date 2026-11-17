/* --------------------------------------------------------------
   Street Racer — RaceSetupScreen component
   Pre-race briefing: player, car, track, rivals, laps, start button
   -------------------------------------------------------------- */
export default {
  name: 'RaceSetupScreen',
  props: {
    playerName: { type: String, default: 'Driver' },
    car: { type: Object, required: true },
    track: { type: Object, required: true },
    unlockedTracks: { type: Array, default: () => [] },
    selectedTrackId: { type: String, default: 'grid' },
    maxLaps: { type: Number, default: 3 },
    getImage: { type: Function, required: true },
  },
  emits: ['start', 'garage', 'tracks', 'back', 'select-track'],
  computed: {
    speedKph() {
      return Math.round((this.car.maxSpeed || 0) * 2.5);
    },
    accelRating() {
      return Math.round((this.car.accel || 0) * 100);
    },
    handlingRating() {
      return Math.round((this.car.handling || 1) * 100);
    },
  },
  template: `
    <div class="overlay menu-bg setup-overlay" role="region" aria-label="Race setup">
      <div class="setup-header">
        <div class="title">RACE SETUP</div>
        <div class="subtitle">Review your loadout, then hit the grid.</div>
      </div>

      <div class="setup-grid">
        <!-- Driver card -->
        <div class="setup-card driver-card">
          <div class="setup-card-title">DRIVER</div>
          <div class="driver-avatar">
            <span class="driver-initials">{{ (playerName || 'D').slice(0,2).toUpperCase() }}</span>
          </div>
          <div class="driver-name">{{ playerName || 'Driver' }}</div>
          <div class="driver-tag">STREET RACER</div>
        </div>

        <!-- Car card -->
        <div class="setup-card car-card">
          <div class="setup-card-title">YOUR RIDE</div>
          <div class="setup-car">
            <car-model :color="car.color" :width="420" :height="252" />
          </div>
          <div class="setup-car-name">{{ car.name }}</div>
          <div class="setup-car-stats">
            <div class="mini-stat">
              <span class="mini-stat-label">SPEED</span>
              <span class="mini-stat-val">{{ speedKph }}</span>
              <span class="mini-stat-unit">KM/H</span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat-label">ACCEL</span>
              <span class="mini-stat-val">{{ accelRating }}</span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat-label">GRIP</span>
              <span class="mini-stat-val">{{ handlingRating }}</span>
            </div>
          </div>
          <button class="btn secondary setup-link" @click="$emit('garage')" type="button">CHANGE CAR</button>
        </div>

        <!-- Track card -->
        <div class="setup-card track-card">
          <div class="setup-card-title">CIRCUIT</div>
          <div class="setup-track-img">
            <img v-if="getImage(track.id)" :src="getImage(track.id)" :alt="track.name" />
            <svg v-else :viewBox="track.svgViewBox" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" v-html="track.svg"></svg>
          </div>
          <div class="setup-track-name">{{ track.name }}</div>
          <div class="setup-track-laps">{{ maxLaps }} LAPS &nbsp;|&nbsp; 4 RIVALS</div>
          <button class="btn secondary setup-link" @click="$emit('tracks')" type="button">CHANGE TRACK</button>
        </div>
      </div>

      <!-- Quick track switcher -->
      <div v-if="unlockedTracks.length > 1" class="setup-track-strip">
        <button
          v-for="t in unlockedTracks"
          :key="t.id"
          class="track-pill"
          :class="{ 'track-pill-active': t.id === selectedTrackId }"
          @click="$emit('select-track', t.id)"
          type="button"
        >
          {{ t.name }}
        </button>
      </div>

      <!-- Rivals preview -->
      <div class="setup-rivals">
        <div class="setup-card-title">THE GRID</div>
        <div class="rival-row">
          <div class="rival-chip rival-player">
            <span class="rival-dot"></span>
            <span class="rival-name">{{ playerName || 'Driver' }}</span>
            <span class="rival-you">YOU</span>
          </div>
          <div class="rival-chip" v-for="r in rivals" :key="r.name">
            <span class="rival-dot"></span>
            <span class="rival-name">{{ r.name }}</span>
          </div>
        </div>
      </div>

      <div class="setup-actions">
        <button class="btn secondary" @click="$emit('back')" type="button">BACK</button>
        <button class="btn setup-start" @click="$emit('start')" type="button">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          START RACE
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      rivals: [
        { name: 'Raze' },
        { name: 'Volt' },
        { name: 'Null' },
        { name: 'Glitch' },
      ],
    };
  },
};