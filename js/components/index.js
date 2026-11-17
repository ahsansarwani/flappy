/* --------------------------------------------------------------
   Street Racer — Component Registry
   Registers every UI component on the Vue app instance
   -------------------------------------------------------------- */
import HudBar from './HudBar.js';
import ControlsHint from './ControlsHint.js';
import Leaderboard from './Leaderboard.js';
import TopBar from './TopBar.js';
import CountdownOverlay from './CountdownOverlay.js';
import MenuScreen from './MenuScreen.js';
import TrackSelectScreen from './TrackSelectScreen.js';
import GarageScreen from './GarageScreen.js';
import ResultsScreen from './ResultsScreen.js';
import ControlsPanel from './ControlsPanel.js';
import CarModel from './CarModel.js';
import RaceSetupScreen from './RaceSetupScreen.js';

export function registerComponents(app) {
  app.component('HudBar', HudBar);
  app.component('ControlsHint', ControlsHint);
  app.component('Leaderboard', Leaderboard);
  app.component('TopBar', TopBar);
  app.component('CountdownOverlay', CountdownOverlay);
  app.component('MenuScreen', MenuScreen);
  app.component('TrackSelectScreen', TrackSelectScreen);
  app.component('GarageScreen', GarageScreen);
  app.component('ResultsScreen', ResultsScreen);
  app.component('ControlsPanel', ControlsPanel);
  app.component('CarModel', CarModel);
  app.component('RaceSetupScreen', RaceSetupScreen);
}
