import GoalManager from './GoalManager';
import ApiManager from './ApiManager';

const StepsManager = {

    _currentWorkingCopy: null,
    _currentGoalId: null,
    _pendingNewSteps: null,

    init() {
        this._pendingNewSteps = [];
    },

    setCurrentGoal(goalId) {
        this._currentGoalId = goalId;
    },

    getWorkingCopy(goalId, stepId) {
        if (!this._currentWorkingCopy || this._currentWorkingCopy._id !== stepId) {
            const goalList = GoalManager.value;
            const goal = goalList.find(goal => goal._id === goalId);
            const step = goal.steps.find(step => step._id === stepId);

            this._currentGoalId = goalId;
            this._currentWorkingCopy = Object.assign({}, step);
        }

        return this._currentWorkingCopy;
    },

    registerToSave(newStep) {
        this._pendingNewSteps.push(newStep);
    },

    update(goalId, stepData) {
        const goal = GoalManager.getWorkingCopy(goalId);
        const stepIndex = goal.steps
            .findIndex(step => step._id === stepData._id);

        if (stepIndex > -1) {
            goal.steps[stepIndex] = stepData;
        } else {
            console.error(`unable to find step ${stepData._id} in goal ${goal._id}`);
        }
    },

    updateImediately(goalId, stepData) {
        ApiManager.updateOneStep(goalId, stepData);
    },

    saveNew() {
        const goalId = this._currentGoalId || GoalManager._currentWorkingCopy._id;

        return ApiManager.createSteps(goalId, this._pendingNewSteps)
            .then((resultList) => {
                this._pendingNewSteps.length = 0;
                return resultList;
            });
    },

    getPendingSteps() {
        return this._pendingNewSteps;
    }
};

export default StepsManager;
