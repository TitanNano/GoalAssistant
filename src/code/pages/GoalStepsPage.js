import EventManager from 'application-frame/core/EventTarget';
import ViewPage from '@af-modules/databinding/prototypes/ViewPage';
import PageManager from '../managers/PageManager';
import GoalManager from '../managers/GoalManager';
import StepsManager from '../managers/StepsManager';

const GoalStepsPage = {

    template: 'goal-steps-page',

    route: '/goals/{goalId}/steps',

    currentStepElement: null,

    doneDialog: null,

    currentGoalId: null,

    get _currentStepIndex() {
        return this.currentGoal.steps.findIndex(step => step._id === this.currentGoal.currentStep);
    },

    get isNotActive() {
        return !this.isActive;
    },

    get currentStep() {
        return this.currentGoal.steps[this._currentStepIndex];
    },

    get previousSteps() {
        return this.currentGoal.steps.slice(0, this._currentStepIndex);
    },

    get futureSteps() {
        return this.currentGoal.steps.slice(this._currentStepIndex + 1);
    },

    currentGoal: {
        title: 'This is The current Goal',
        description: 'something something something',
        currentStep: 2,

        steps: [{
            title: 'Test test',
            noteData: 'hahaha haha',
            dueTo: 1451241,
        }, {
            title: 'Suff Step 1',
            noteData: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
            Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
            aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
            imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
            mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
            semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
            porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante,
            dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla
            ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam
            ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
            Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum
            rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed
            ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id,
            lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae
            sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit
            amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla
            mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat,
            leo eget bibendum sodales, augue velit cursus nunc,`,
            dueTo: 432234,
        }, {
            title: 'Future 1',
            dueTo: 5436654,
        }, {
            title: 'Future 2',
            dueTo: 35438,
        }],
    },

    get currentStepNotes() {
        return this.currentStep && this.currentStep.noteData;
    },

    set currentStepNotes(value) {
        if (this.currentStep) {
            this.currentStep.noteData = value;

            StepsManager.updateImediately(this.currentGoalId, {
                _id: this.currentStep._id,
                noteData: this.currentStep.noteData,
            });
        }
    },

    constructor() {
        super.constructor();

        this.scope.$animation = Object.create(EventManager);
        this.scope.$animation._make();
        this.scope.$animation.on('animateSlideIn', () => {
            setTimeout(() => {
                this.currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        });

        GoalManager.when(list => {
            if (this.currentGoalId) {
                this.loadCurrentGoal(list);
            }
        });
    },

    loadCurrentGoal(list) {
        const goal = list.find(goal => goal._id === this.currentGoalId);

        this.currentGoal = goal;
        this.scope.__apply__(null, true);
    },

    onRouteEnter(path, params) {
        this.currentGoalId = params.goalId;
        GoalManager.once(this.loadCurrentGoal.bind(this));

        super.onRouteEnter(path, params);
    },

    onNavigateBack() {
        this.view._forceVisible = true;

        PageManager.switchTo('/goals');
    },

    onEnterGoalEdit() {
        PageManager.down('details');
    },

    onMarkAsDone() {
        const view = this.view;
        const index = view.currentGoal.steps
            .findIndex(step => step._id === view.currentGoal.currentStep);

        if (index === view.currentGoal.steps.length - 1) {
            view.doneDialog.open();
        } else {
            view.currentGoal.currentStep = view.currentGoal.steps[index + 1]._id;
            view.currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            GoalManager.update(view.currentGoal);
        }
    },

    onCancelDone() {
        this.view.doneDialog.cancel();
    },

    onDoneAndNext() {
        const view = this.view;
        const currentIndex = view.currentGoal.steps.findIndex(step => step._id === view.currentStep._id);

        view.doneDialog.close();
        view.currentGoal.currentStep = view.currentGoal.steps[currentIndex + 1]._id;
        view.currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        GoalManager.update(view.currentGoal);

        PageManager.down('details/edit-step/new');
    },

    __proto__: ViewPage,
};

export default GoalStepsPage;
