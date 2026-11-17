/* --------------------------------------------------------------
   Street Racer — Root App Component (Vue 3)
   Progression, XP, levels, coins, garage, achievements, screens
   Composes the UI from components in ./components/
   -------------------------------------------------------------- */
const { ref, computed, onMounted, onBeforeUnmount } = window.Vue;

import { CARS, TRACKS, CONFIG } from './config.js';
import { state, startTimeRef } from './state.js';
import { RACE } from './race.js';
import { hud, syncHud } from './hudStore.js';
import { getTrackImage } from './track.js';
import { ordinal } from './utils.js';

const SAVE_KEY = 'streetracer_save_v1';

const DEFAULT_PROFILE = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  coins: 200,
  playerName: 'Driver',
  cars: ['starter'],
  currentCar: 'starter',
  achievements: [],
  stats: {
    racesRun: 0,
    racesWon: 0,
    streak: 0,
    boostUses: 0,
    offTrackCount: 0,
  },
};

const ACHIEVEMENTS = [
  { id: 'first_win', name: 'First Blood', desc: 'Win your first race.', icon: '🏆', svg: '<path d="M22 12h-4l-3 3L9 14l-2-2"/><polyline points="18 4 12 10 6 4"/>', check: (s) => s.stats.racesWon >= 1 },
  { id: 'streak_3', name: 'Clean Sweep', desc: 'Win 3 races in a row.', icon: '🔥', svg: '<path d="M7 13v8M12 13v6M17 13v4M7 7l5-5M12 7l5-5M17 7l5-5"/>', check: (s) => s.stats.streak >= 3 },
  { id: 'streak_5', name: 'Unstoppable', desc: 'Win 5 races in a row.', icon: '⚡', svg: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>', check: (s) => s.stats.streak >= 5 },
  { id: 'collector', name: 'Collector', desc: 'Own 3 different cars.', icon: '🚗', svg: '<rect x="2" y="6" width="16" height="10" rx="2"/><path d="M18 6l-1.5 7.5L12 18l-4.5-4.5L6 6z"/>', check: (s) => s.cars.length >= 3 },
  { id: 'garage_full', name: 'Full Garage', desc: 'Own every car.', icon: '🏁', svg: '<path d="M22 12h-4l-3 3L9 14l-2-2"/><polyline points="18 4 12 10 6 4"/>', check: (s) => s.cars.length >= 4 },
  { id: 'speed_demon', name: 'Speed Demon', desc: 'Use nitro boost 10 times.', icon: '💨', svg: '<path d="M12 2v20M22 12c0 4.42-4.48 8-10 8S2 16.42 2 12 6.48 4 10 4s10 2.42 10 8Z"/>', check: (s) => s.stats.boostUses >= 10 },
  { id: 'perfectionist', name: 'Perfectionist', desc: 'Win without going off-track.', icon: '✨', svg: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>', check: (s) => s.stats.racesWon >= 1 && s.stats.offTrackCount === 0 },
  { id: 'veteran', name: 'Veteran', desc: 'Reach level 10.', icon: '🏅', svg: '<polygon points="12 2 2 7 12 12 22 7 12 2"/>', check: (s) => s.level >= 10 },
  { id: 'legend', name: 'Street Legend', desc: 'Reach level 25.', icon: '👑', svg: '<path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m0 0a3 3 0 0 1 4.24 4.24m0 0a3 3 0 0 1-4.24-4.24z"/><path d="M11 14h2M4 11.75c0 .674.266 1.3.71 1.77M21.29 11.75c0 .674-.266 1.3-.71 1.77M4 21.75a6 6 0 0 1-.71-10M21.29 21.75a6 6 0 0 0 .71-10M11 21h2M4 9.75v4.5M21.29 9.75v4.5M17 21h-4M7 21H3M4 9.75V5M21.29 9.75V5M17 5h2M4 5H2M17 21h2M4 21H2"/><path d="M9 14h2M18 14h2M9 5h2M18 5h2M9 19h2M18 19h2"/>', check: (s) => s.level >= 25 },
];

function loadProfile() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROFILE, ...parsed, stats: { ...DEFAULT_PROFILE.stats, ...(parsed.stats || {}) } };
    }
  } catch (e) { /* ignore */ }
  return { ...DEFAULT_PROFILE };
}

function saveProfile(profile) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(profile)); } catch (e) { /* ignore */ }
}

function xpForLevel(level) {
  return 100 + (level - 1) * 75;
}

function addXP(profile, amount) {
  profile.xp += amount;
  while (profile.xp >= profile.xpToNext) {
    profile.xp -= profile.xpToNext;
    profile.level += 1;
    profile.xpToNext = xpForLevel(profile.level);
    profile.coins += 100;
  }
  return profile;
}

function checkAchievements(profile) {
  const newly = [];
  for (const ach of ACHIEVEMENTS) {
    if (profile.achievements.includes(ach.id)) continue;
    if (ach.check(profile)) {
      profile.achievements.push(ach.id);
      newly.push(ach);
    }
  }
  return newly;
}

function rewardForResult(position, totalCars) {
  const base = 100;
  const positionBonus = (totalCars - position + 1) * 50;
  const winBonus = position === 1 ? 200 : 0;
  return base + positionBonus + winBonus;
}

function xpForResult(position) {
  const map = { 1: 80, 2: 60, 3: 40, 4: 25, 5: 15 };
  return map[position] || 10;
}

export default {
  name: 'App',
  setup() {
    const profile = ref(loadProfile());
    const playerName = computed({
      get: () => profile.value.playerName || 'Driver',
      set: (value) => {
        profile.value.playerName = value.trim() || 'Driver';
        saveProfile(profile.value);
      },
    });
    const screen = ref('menu');
    const countdownNum = ref(3);
    const newAchievements = ref([]);
    const lastResult = ref(null);
    let isCountingDown = false;
    let countdownTimer = null;
    let countdownEnd = 0;

    const ownedCars = computed(() =>
      profile.value.cars.map((id) => CARS[id])
    );

    const currentCar = computed(() =>
      CARS[profile.value.currentCar]
    );

    const unlockedTracks = computed(() =>
      Object.values(TRACKS).filter((t) => t.unlockLevel <= profile.value.level)
    );
    const lockedTracks = computed(() =>
      Object.values(TRACKS).filter((t) => t.unlockLevel > profile.value.level)
    );

    const showTopBar = computed(() =>
      ['menu', 'garage', 'trackselect', 'setup'].includes(screen.value)
    );

    const selectedTrackId = ref('grid');

    const selectedTrack = computed(() =>
      TRACKS[selectedTrackId.value] || TRACKS.grid
    );

    const selectedCar = computed(() =>
      CARS[profile.value.currentCar] || CARS.starter
    );

    const resultText = computed(() => {
      const result = lastResult.value;
      if (!result) return '';
      if (result.won) return 'First place — ' + result.time.toFixed(1) + 's';
      return 'Finished ' + ordinal(result.position);
    });

    function goMenu() { screen.value = 'menu'; }
    function goGarage() { screen.value = 'garage'; }
    function goTrackSelect() { screen.value = 'trackselect'; }
    function goRaceSetup() { screen.value = 'setup'; }

    function selectCar(id) {
      if (!profile.value.cars.includes(id)) return;
      profile.value.currentCar = id;
      saveProfile(profile.value);
    }

    function selectTrack(id) {
      if (TRACKS[id]) selectedTrackId.value = id;
    }

    function startRaceTrack(trackId) {
      if (!state.scene) {
        console.error('Phaser scene not ready yet');
        return;
      }
      if (isCountingDown) return;
      isCountingDown = true;

      const raceTrackId = trackId || selectedTrackId.value;
      if (!TRACKS[raceTrackId]) {
        selectedTrackId.value = Object.keys(TRACKS)[0];
      }
      const finalTrackId = TRACKS[raceTrackId] ? raceTrackId : selectedTrackId.value;

      if (countdownTimer) clearInterval(countdownTimer);

      countdownNum.value = 3;
      screen.value = 'countdown';
      state.onFinish = finishRace;

      // Reset race state so the countdown overlay is the only active screen
      state.racing = false;

      countdownEnd = Date.now() + 3200;
      countdownTimer = setInterval(() => {
        const remaining = Math.max(0, countdownEnd - Date.now());
        const num = Math.ceil(remaining / 1000);
        countdownNum.value = num;
        if (remaining <= 0) {
          clearInterval(countdownTimer);
          countdownTimer = null;
          startTimeRef.current = Date.now();
          RACE.startRace(profile.value.currentCar, finalTrackId);
          state.racing = true;
          screen.value = 'racing';
          isCountingDown = false;
        }
      }, 100);
    }

    function startRace() {
      const firstUnlocked = unlockedTracks.value[0];
      const trackId = selectedTrackId.value && TRACKS[selectedTrackId.value]
        ? selectedTrackId.value
        : (firstUnlocked ? firstUnlocked.id : Object.keys(TRACKS)[0]);
      startRaceTrack(trackId);
    }

    function finishRace(result) {
      state.racing = false;
      isCountingDown = false;
      if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
      lastResult.value = result;
      const p = profile.value;
      p.stats.racesRun += 1;
      p.stats.boostUses += result.boostCount || 0;
      p.stats.offTrackCount += result.offTrackCount || 0;

      if (result.won) {
        p.stats.racesWon += 1;
        p.stats.streak += 1;
      } else {
        p.stats.streak = 0;
      }

      const coins = rewardForResult(result.position, result.totalCars);
      p.coins += coins;
      addXP(p, xpForResult(result.position));

      const newly = checkAchievements(p, result);
      newAchievements.value = newly;
      saveProfile(p);

      screen.value = 'results';
    }

    function backToMenu() {
      newAchievements.value = [];
      goMenu();
    }

    let rafId = 0;
    onMounted(() => {
      const loop = () => {
        syncHud();
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    });
    onBeforeUnmount(() => {
      cancelAnimationFrame(rafId);
      if (countdownTimer) clearInterval(countdownTimer);
    });

    return {
      hud,
      profile,
      playerName,
      screen,
      countdownNum,
      newAchievements,
      lastResult,
      resultText,
      progressPct: computed(() =>
        Math.min(100, Math.floor((profile.value.xp / profile.value.xpToNext) * 100))
      ),
      ownedCars,
      currentCar,
      unlockedTracks,
      lockedTracks,
      showTopBar,
      goMenu,
      goGarage,
      goTrackSelect,
      goRaceSetup,
      startRaceTrack,
      startRace,
      selectCar,
      selectTrack,
      selectedTrackId,
      selectedTrack,
      selectedCar,
      backToMenu,
      getTrackImage,
      maxLaps: CONFIG.maxLaps,
    };
  },
  template: `
    <a href="#app" class="skip-link">Skip to content</a>
    <div>
      <hud-bar
        v-if="screen === 'racing'"
        :rank="hud.rank"
        :speed="hud.speed"
        :lap="hud.lap"
        :max-laps="maxLaps"
        :boost="hud.boost"
        :drift="hud.drift"
      />
      <controls-hint v-if="screen === 'racing'" />
      <leaderboard v-if="screen === 'racing'" :cars="hud.standings" />

      <top-bar v-if="showTopBar" :coins="profile.coins" :level="profile.level" />

      <countdown-overlay v-if="screen === 'countdown'" :count="countdownNum" />

      <div v-if="screen === 'menu'" class="player-name-field">
        <label>PLAYER NAME</label>
        <input
          v-model="playerName"
          type="text"
          maxlength="12"
          placeholder="Driver"
        />
      </div>
      <menu-screen
        v-if="screen === 'menu'"
        :car="currentCar"
        :player-name="playerName"
        :selected-track="selectedTrack"
        @start="goRaceSetup"
        @garage="goGarage"
        @tracks="goTrackSelect"
      />

      <race-setup-screen
        v-if="screen === 'setup'"
        :player-name="playerName"
        :car="selectedCar"
        :track="selectedTrack"
        :unlocked-tracks="unlockedTracks"
        :selected-track-id="selectedTrackId"
        :max-laps="maxLaps"
        :get-image="getTrackImage"
        @start="startRaceTrack(selectedTrackId)"
        @garage="goGarage"
        @tracks="goTrackSelect"
        @back="goMenu"
        @select-track="selectTrack"
      />

      <track-select-screen
        v-if="screen === 'trackselect'"
        :unlocked="unlockedTracks"
        :locked="lockedTracks"
        :get-image="getTrackImage"
        :selected-id="selectedTrackId"
        @race="startRaceTrack"
        @select="selectTrack"
        @back="goMenu"
      />

      <garage-screen
        v-if="screen === 'garage'"
        :cars="ownedCars"
        :current-id="profile.currentCar"
        @select="selectCar"
        @back="goMenu"
      />

      <results-screen
        v-if="screen === 'results'"
        :result="lastResult"
        :result-text="resultText"
        :achievements="newAchievements"
        @back="backToMenu"
      />

      <controls-panel />
    </div>
  `,
};
