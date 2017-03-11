import Application from 'application-frame/core/Application';
import PageManager from './managers/PageManager';

import GoalListPage from './pages/GoalListPage';
import SettingsPage from './pages/SettingsPage';
import GoalStepsPage from './pages/GoalStepsPage';
import GoalDetailsPage from './pages/GoalDetailsPage';
import StepEditPage from './pages/StepEditPage';
import ReminderModalController from './pages/ReminderModalController';

const App = {

    name: 'GoalAssistant',

    pages: [
        GoalListPage,
        SettingsPage,
        GoalStepsPage,
        GoalDetailsPage,
        StepEditPage,
        ReminderModalController,
    ],

    navigation: [
        GoalListPage,
        SettingsPage,
    ],

    constructor() {
        super._make();
    },

    init() {
        super.init();

        PageManager.init({ pages: this.pages, navigation: this.navigation });
    },

    __proto__: Application,
};

export default App;
