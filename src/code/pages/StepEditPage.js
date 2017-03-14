import ViewPage from '@af-modules/databinding/prototypes/ViewPage';
import PageManager from '../managers/PageManager';
import GoalManager from '../managers/GoalManager';
import StepsManager from '../managers/StepsManager';

const StepEditPage = {

    template: 'step-edit-page',

    get title() {
        if (this.currentStep && this.currentStep._id) {
            return 'Edit Step';
        } else {
            return 'New Step';
        }
    },

    route: [
        '/goals/{goalId}/steps/details/edit-step/{stepId}',
        '/goals/new/edit-step/{stepId}',
    ],

    get isNotActive() {
        return !this.isActive;
    },

    get visibleDueToValue() {
        return this.currentStep && this.currentStep.dueTo;
    },

    set visibleDueToValue(value) {
        if (this.currentStep) {
            this.currentStep.dueTo = parseInt(value);
        }
    },

    currentStep: null,
    stepId: null,
    goalId: null,

    navigateBack() {
        const route = PageManager.getCurrentPath();
        route.pop();
        route.pop();
        route.shift();

        PageManager.switchTo('/' + route.join('/'));
    },

    onNavigateBack() {
        this.view._forceVisible = true;

        this.view.navigateBack();
    },

    onRouteEnter(path, params) {
        super.onRouteEnter(path, params);

        this.goalId = params.goalId;
        this.stepId = params.stepId;

        if (params.stepId === 'new') {
            this.currentStep = {
                title: '',
                dueTo: 0,
            };
        } else {
            GoalManager.once(() => {
                this.currentStep = StepsManager.getWorkingCopy(params.goalId, params.stepId);
            });
        }
    },

    onSaveStep() {
        if (this.view.stepId === 'new') {
            StepsManager.registerToSave(this.view.currentStep);
        } else {
            StepsManager.update(this.view.goalId, this.view.currentStep);
        }

        this.view.navigateBack();
    },

    __proto__: ViewPage,
};

export default StepEditPage;
