/* --------------------------------------------------------------
   Street Racer — CountdownOverlay component
   3-2-1-GO! countdown before a race starts
   -------------------------------------------------------------- */
export default {
  name: 'CountdownOverlay',
  props: {
    count: { type: Number, default: 3 },
  },
  template: `
    <div class="overlay menu-bg">
      <div class="countdown-big" v-if="count > 0">{{ count }}</div>
      <div class="countdown-big text-win" v-else>GO!</div>
    </div>
  `,
};
