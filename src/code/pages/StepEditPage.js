import ViewPage from '@af-modules/databinding/prototypes/ViewPage';
import PageManager from '../managers/PageManager';

const StepEditPage = {

    template: 'step-edit-page',

    route: [
        '/goals/{goalId}/steps/details/edit-step/{stepId}'
    ],

    get isNotActive() {
        return !this.isActive;
    },


    onNavigateBack() {
        this.view._forceVisible = true;

        const route = PageManager.getCurrentPath();
        route.pop();
        route.pop();
        route.shift();

        PageManager.switchTo('/' + route.join('/'));
    },

    __proto__: ViewPage,
};

export default StepEditPage;
