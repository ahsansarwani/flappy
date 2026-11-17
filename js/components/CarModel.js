/* --------------------------------------------------------------
   Street Racer — CarModel component
   Renders the procedural canvas car model (js/carModel.js)
   and redraws when the color or size changes
   -------------------------------------------------------------- */
import { generateCarModel } from '../carModel.js';

const { ref, watch, onMounted } = window.Vue;

export default {
  name: 'CarModel',
  props: {
    color: { type: String, required: true },
    width: { type: Number, default: 360 },
    height: { type: Number, default: 216 },
  },
  setup(props) {
    const canvasEl = ref(null);

    function draw() {
      const canvas = canvasEl.value;
      if (!canvas) return;
      canvas.width = props.width;
      canvas.height = props.height;
      generateCarModel(canvas.getContext('2d'), props.color, props.width, props.height);
    }

    onMounted(draw);
    watch(() => [props.color, props.width, props.height], draw);

    return { canvasEl };
  },
  template: `
    <canvas ref="canvasEl" class="car-model-canvas"></canvas>
  `,
};
