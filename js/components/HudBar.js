/* --------------------------------------------------------------
   Street Racer — HudBar component
   Asphalt 8-inspired racing HUD: huge center speedo, gear,
   position, lap counter, lap timer, drift, nitro bar, mini-map
   -------------------------------------------------------------- */
import { state } from '../state.js';
export default {
  name: 'HudBar',
  props: {
    rank: { type: Number, default: 1 },
    speed: { type: Number, default: 0 },
    lap: { type: Number, default: 1 },
    maxLaps: { type: Number, default: 1 },
    boost: { type: Number, default: 0 },
    drift: { type: Number, default: 0 },
  },
  setup(props) {
    const { ref, computed, onMounted, onUnmounted, watch } = window.Vue;

    const lapTime = ref(0);
    let timer = null;

    const gear = computed(() => {
      const s = Math.max(0, props.speed || 0);
      if (s < 30) return 1;
      if (s < 70) return 2;
      if (s < 115) return 3;
      if (s < 160) return 4;
      if (s < 205) return 5;
      return 6;
    });

    const positionOrdinal = computed(() => {
      const n = props.rank || 1;
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    });

    const positionClass = computed(() => {
      const n = props.rank || 1;
      return n <= 3 ? `pos-top-${n}` : 'pos-other';
    });

    const lapTimeText = computed(() => {
      const t = lapTime.value;
      const m = Math.floor(t / 60000);
      const s = Math.floor((t % 60000) / 1000);
      const ms = Math.floor((t % 1000) / 100);
      return `${m}:${String(s).padStart(2, '0')}.${ms}`;
    });

    const boostPct = computed(() => Math.min(100, Math.max(0, Math.round((props.boost || 0) / 40 * 100))));
    const driftDeg = computed(() => Math.round(Math.abs((props.drift || 0) * 0.45)));
    const isDrifting = computed(() => (props.drift || 0) > 15);

    const rankChange = ref('same');
    watch(() => props.rank, (newVal, oldVal) => {
      if (oldVal === undefined) return;
      rankChange.value = newVal < oldVal ? 'up' : newVal > oldVal ? 'down' : 'same';
      setTimeout(() => { rankChange.value = 'same'; }, 1500);
    });

    // Mini-map: project car world positions onto a small top-down view
    function mapDots() {
      const cars = state.cars || [];
      const player = cars.find((c) => c.isPlayer) || {};
      const pz = player.world ? player.world.z : 0;
      const px = player.world ? player.world.x : 0;
      const dots = [];
      const scale = 0.045;
      const offsetX = 60;
      const offsetY = 44;
      for (const c of cars) {
        if (!c.world) continue;
        const relZ = c.world.z - pz;
        const relX = c.world.x - px;
        if (relZ < -120 || relZ > 900) continue;
        const sx = offsetX + relX * scale * 0.5;
        const sy = offsetY - relZ * scale;
        dots.push({
          id: c.id,
          isPlayer: c.isPlayer,
          sx: Math.max(2, Math.min(116, sx)),
          sy: Math.max(2, Math.min(92, sy)),
        });
      }
      return dots;
    }

    onMounted(() => {
      const start = Date.now();
      timer = setInterval(() => { lapTime.value = Date.now() - start; }, 50);
    });
    onUnmounted(() => clearInterval(timer));

    return { gear, positionOrdinal, positionClass, lapTimeText, boostPct, driftDeg, isDrifting, rankChange, mapDots };
  },
  template: `
    <div class="hud" role="region" aria-label="Race HUD">
      <!-- Top: position (left), lap counter (right) -->
      <div class="hud-top">
        <div class="pos-block" :class="positionClass">
          <span class="pos-big">{{ positionOrdinal }}</span>
          <span class="pos-label">PLACE</span>
        </div>
        <div class="lap-block">
          <span class="lap-label">LAP</span>
          <span class="lap-val">{{ lap }}</span>
          <span class="lap-slash">/</span>
          <span class="lap-val">{{ maxLaps }}</span>
        </div>
      </div>

      <!-- Center: speed + gear -->
      <div class="speed-block">
        <span class="speed-val">{{ Math.round(speed) }}</span>
        <span class="speed-unit">KM/H</span>
        <div class="gear-chip">
          <span class="gear-label">G</span>
          <span class="gear-num">{{ gear }}</span>
        </div>
      </div>

      <!-- Bottom center: lap time -->
      <div class="laptime-block">
        <span class="laptime-val">{{ lapTimeText }}</span>
      </div>

      <!-- Nitro bar (bottom) -->
      <div class="nitro-block">
        <div class="nitro-track">
          <div class="nitro-fill" :style="{ width: boostPct + '%' }"></div>
        </div>
        <span class="nitro-label">NITRO</span>
      </div>

      <!-- Drift -->
      <div v-if="isDrifting" class="drift-block">
        <span class="drift-icon">↻</span>
        <span class="drift-val">{{ driftDeg }}°</span>
      </div>

      <!-- Mini-map (top-right) -->
      <div class="minimap-block">
        <div class="minimap">
          <div class="map-dot" v-for="dot in mapDots()" :key="dot.id"
               :class="{ 'map-dot-player': dot.isPlayer }"
               :style="{ left: dot.sx + 'px', top: dot.sy + 'px' }"></div>
        </div>
        <span class="map-label">RACE MAP</span>
      </div>
    </div>
  `,
};
