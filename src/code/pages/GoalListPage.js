import ViewPage from '@af-modules/databinding/prototypes/ViewPage';
import PageManager from '../managers/PageManager';

const GoalListPage = {
    route: '/goals',

    template: 'goal-list-page',

    title: 'Goal List',

    getCurrentStep(goal) {
        return goal.steps[goal.currentStep];
    },

    _currentGoals: [{
        title: 'Goal 12',
        currentStep: 1,

        steps: [{
            title: 'step X',
        }, {
            title: 'stuff to do',
        }, {
            title: 'keep it secret',
        }, {
            title: 'destroy everything',
        }],
    }, {
        title: 'Test Goal',
        currentStep: 0,

        steps: [{ title: 'A Step'}],
    }, {
        title: 'More Stuff',
        currentStep: 0,

        steps: [{ title: 'some step '}],
    }, {
        title: 'The goal of the goals!',
        currentStep: 0,

        steps: [{ title: 'test test test '}],
    }],

    get currentGoals() {
        return this._currentGoals;
    },

    onGoalSelected() {
        PageManager.down('1234/steps');
    },

    onCreateNewGoal() {
        PageManager.down('new');
    },

    __proto__: ViewPage,
};

export default GoalListPage;
