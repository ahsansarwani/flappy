/* --------------------------------------------------------------
   Street Racer — Leaderboard component
   Live race standings table
   -------------------------------------------------------------- */
export default {
  name: 'Leaderboard',
  props: {
    cars: { type: Array, default: () => [] },
  },
  template: `
    <div class="leaderboard">
      <table>
        <thead><tr><th>Pos</th><th>Racer</th><th>Lap</th></tr></thead>
        <tbody>
          <tr v-for="(c, i) in cars" :key="c.id" :class="{ player: c.isPlayer }">
            <td class="pos">{{ i + 1 }}</td>
            <td class="name" :class="{ player: c.isPlayer }">{{ c.name }}</td>
            <td class="lap">{{ c.lap }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};
