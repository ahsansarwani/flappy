<template>
  <div class="hud" role="region" aria-label="Race HUD">
    <div class="rank">{{ 'POS ' + rank }}</div>
    <div class="speed">{{ speed }}</div>
    <div class="speed-unit">km/h</div>
    <div class="lap">{{ 'LAP ' + lap + ' / ' + maxLaps }}</div>
    <div v-if="boost > 0" class="hud-boost">NITRO <span class="val">{{ boost }}</span></div>
    <div v-if="drift > 20" class="hud-drift">DRIFT <span class="val">{{ drift }}%</span></div>
  </div>
</template>

<script>
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
};
</script>
