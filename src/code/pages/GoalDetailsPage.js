import ViewPage from '@af-modules/databinding/prototypes/ViewPage';
import PageManager from '../managers/PageManager';
import GoalManager from '../managers/GoalManager';
import StepsManager from '../managers/StepsManager';
import Util from '../util';

const GoalsDetailsPage = {
    route: ['/goals/{goalId}/steps/details', '/goals/new'],

    template: 'goal-details-page',

    util: Util,

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

    datePicker: null,
    datePickerDialog: null,

    get newSteps() {
        return StepsManager.getPendingSteps();
    },

    get visibleDueToValue() {
        return this.currentStep && (new Date(this.currentGoal.dueTo)).toDateString();
    },

    set visibleDueToValue(value) {
        if (this.currentGoal) {
            this.currentGoal.dueTo = parseInt(value);
        }
    },

    get pickableDueToValue() {
        const date = (this.currentGoal && this.currentGoal.dueTo !== 0) ?
            this.currentGoal.dueTo : Date.now();

        return new Date(date);
    },

    set pickableDueToValue(value) {
        if (this.currentGoal) {
            this.currentGoal.dueTo = value.getTime();
        }
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
        } else {
            GoalManager.once(() => {
                this.currentGoal = GoalManager.getWorkingCopy(params.goalId);
            });
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

        PageManager.down(`edit-step/${step._id}`);
    },

    onSave() {
        if (this.view.currentGoal._id) {
            StepsManager.saveNew();
            GoalManager.update(this.view.currentGoal);
        } else {
            GoalManager.create(this.view.currentGoal).then((goal) => {
                StepsManager.setCurrentGoal(goal._id);

                return StepsManager.saveNew().then(steps => {
                    goal.steps = steps;

                    if (steps.length) {
                        goal.currentStep = steps[0]._id;
                    }
                });
            }).then(() => this.__apply__());
        }

        PageManager.up();
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

export default GoalsDetailsPage;
