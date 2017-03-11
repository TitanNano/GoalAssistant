import ViewPage from '@af-modules/databinding/prototypes/ViewPage';
import PageManager from '../managers/PageManager';

const GoalsDetailsPage = {
    route: ['/goals/{goalId}/steps/details', '/goals/new'],

    template: 'goal-details-page',

    currentGoal: {
        id: 2113,
        title: 'A Goal',
        steps: [{
            title: 'Step 1',
            dueTo: 428359,
        }, {
            title: 'Step 2',
            dueTo: 23252,
        }, {
            title: 'Step 3',
            dueTo: 4212,
        }]
    },

    onRouteEnter(path, params) {
        super.onRouteEnter(path, params);

        if (!params.goalId) {
            this.currentGoal = {
                title: '',
                description: '',
                dueTo: 0,
                steps: [],
            };
        }
    },

    get isNotActive() {
        return !this.isActive;
    },

    onNavigateBack() {
        this.view._forceVisible = true;

        PageManager.up();
    },

    onCreateNewStep() {
        PageManager.down('edit-step/new');
    },

    onEditStep(event) {
        const id = parseInt(event.target.dataset.id);
        const step = this.view.currentGoal.steps[id];

        PageManager.down(`edit-step/${step.id}`);
    },

    __proto__: ViewPage,
};

export default GoalsDetailsPage;
