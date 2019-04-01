import ViewPage from '@af-modules/databinding/prototypes/ViewPage';
import PageManager from '../managers/PageManager';
import GoalManager from '../managers/GoalManager';

const GoalListPage = {
    route: '/goals',

    template: 'goal-list-page',

    title: 'Goal List',

    constructor() {
        super.constructor();

        GoalManager.when(() => this.scope.__apply__(null, true));
    },

    getCurrentStep(goal) {
        return goal.steps.find(step => step._id === goal.currentStep);
    },

    get currentGoals() {
        return GoalManager.value;
    },

    onGoalSelected(e) {
        const goal = this.currentGoals[e.target.selected];

        e.target.selected = -1;

        PageManager.down(`${goal._id}/steps`);
    },

    onCreateNewGoal() {
        PageManager.down('new');
    },

    onOpenDrawer() {
        PageManager.isDrawerOpen = true;
    },

    __proto__: ViewPage,
};

export default GoalListPage;
