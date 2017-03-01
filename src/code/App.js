import Application from 'application-frame/core/Application';
import PageManager from './managers/PageManager';

import GoalListPage from './pages/GoalListPage';
import SettingsPage from './pages/SettingsPage';
import GoalStepsPage from './pages/GoalStepsPage';

const App = {

    name: 'GoalAssistant',

    pages: [
        GoalListPage,
        SettingsPage,
        GoalStepsPage,
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
