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
        return this.currentStep && (new Date(this.currentStep.dueTo)).toDateString();
    },

    set visibleDueToValue(value) {
        if (this.currentStep) {
            this.currentStep.dueTo = parseInt(value);
        }
    },

    get pickableDueToValue() {
        const date = (this.currentStep && this.currentStep.dueTo !== 0) ?
            this.currentStep.dueTo : Date.now();

        return new Date(date);
    },

    set pickableDueToValue(value) {
        if (this.currentStep) {
            this.currentStep.dueTo = value.getTime();
        }
    },

    currentStep: null,
    stepId: null,
    goalId: null,
    datePicker: null,
    datePickerDialog: null,

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

    onPickDate(e) {
        e.target.blur();
        this.view.datePicker.date = this.view.pickableDueToValue;
        this.view.datePickerDialog.open();
    },

    onDatePicked() {
        this.view.pickableDueToValue = this.view.datePicker.date;
        this.view.datePickerDialog.close();
    },

    __proto__: ViewPage,
};

export default StepEditPage;
