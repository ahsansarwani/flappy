/* --------------------------------------------------------------
   Street Racer — GarageScreen component
   Car selection grid for owned cars
   -------------------------------------------------------------- */
export default {
  name: 'GarageScreen',
  props: {
    cars: { type: Array, default: () => [] },
    currentId: { type: String, required: true },
  },
  emits: ['select', 'back'],
  template: `
    <div class="overlay" role="region" aria-label="Garage">
      <div class="icon icon--big">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="16" height="10" rx="2"/><path d="M18 6l-1.5 7.5L12 18l-4.5-4.5L6 6z"/></svg>
      </div>
      <div class="title">GARAGE</div>
      <div class="subtitle">Pick your ride.</div>
      <div class="garage-grid" role="grid" aria-label="Owned cars">
        <div v-for="car in cars" :key="car.id" class="car-card" :class="{ selected: currentId === car.id }" role="gridcell" :aria-selected="currentId === car.id" tabindex="0">
          <div class="car-icon">
            <car-model :color="car.color" :width="200" :height="100" />
          </div>
          <h3>{{ car.name }}</h3>
          <div class="car-stats">{{ (car.maxSpeed*10).toFixed(0) }} SPD &nbsp;|&nbsp; {{ (car.accel*100).toFixed(0) }} ACC</div>
          <button class="btn" :disabled="currentId === car.id" @click="$emit('select', car.id)" type="button">
            {{ currentId === car.id ? 'Selected' : 'Select' }}
          </button>
        </div>
      </div>
      <button class="btn secondary" @click="$emit('back')" type="button">Back</button>
    </div>
  `,
};
