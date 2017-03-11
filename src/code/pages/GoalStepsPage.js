import EventManager from 'application-frame/core/EventTarget';
import ViewPage from '@af-modules/databinding/prototypes/ViewPage';
import PageManager from '../managers/PageManager';

const GoalStepsPage = {

    template: 'goal-steps-page',

    route: '/goals/{goalId}/steps',

    currentStepElement: null,

    doneDialog: null,

    get isNotActive() {
        return !this.isActive;
    },

    get currentStep() {
        return this.currentGoal.steps[this.currentGoal.currentStep];
    },

    get previousSteps() {
        return this.currentGoal.steps.slice(0, this.currentGoal.currentStep);
    },

    get futureSteps() {
        return this.currentGoal.steps.slice(this.currentGoal.currentStep + 1);
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

    constructor() {
        super.constructor();

        this.scope.$animation = Object.create(EventManager);
        this.scope.$animation._make();
        this.scope.$animation.on('animateSlideIn', () => {
            setTimeout(() => {
                this.currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        });
    },

    onNavigateBack() {
        this.view._forceVisible = true;

        PageManager.switchTo('/goals');
    },

    onEnterGoalEdit() {
        PageManager.down('details');
    },

    onMarkAsDone() {
        this.view.doneDialog.open();
    },

    onCancelDone() {
        this.view.doneDialog.cancel();
    },

    __proto__: ViewPage,
};

export default GoalStepsPage;
