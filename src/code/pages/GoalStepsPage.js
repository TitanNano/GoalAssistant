import ViewPage from '@af-modules/databinding/prototypes/ViewPage';
import PageManager from '../managers/PageManager';

const GoalStepsPage = {

    template: 'goal-steps-page',

    route: '/goals/{goalId}/steps',

    get isNotActive() {
        return !this.isActive;
    },

    get currentStep() {
        return this.currentGoal.steps[this.currentGoal.currentStep];
    },

    currentGoal: {
        title: 'This is The current Goal',
        description: 'something something something',
        currentStep: 0,

        steps: [{
            title: 'Test test',
            noteData: 'hahaha haha',
        }],
    },

    onNavigateBack() {
        this.view._forceVisible = true;

        PageManager.switchTo('/goals');
    },

    __proto__: ViewPage,
};

export default GoalStepsPage;
