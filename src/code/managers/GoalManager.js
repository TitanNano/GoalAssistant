import ApiManager from './ApiManager';
import DataStorage from 'application-frame/core/DataStorage';

const GoalManager = {

    _currentWorkingCopy: null,

    init() {
        this.constructor();

        ApiManager.getGoalList().then(list => this.fill(list));
    },

    getWorkingCopy(goalId) {
        if (!this._currentWorkingCopy || this._currentWorkingCopy._id !== goalId) {
            const goal = this.value.find(goal => goal._id === goalId);

            this._currentWorkingCopy = Object.assign({}, goal);

            this._currentWorkingCopy.steps = this._currentWorkingCopy.steps.slice();
        }

        return this._currentWorkingCopy;
    },

    update(newGoalData) {
        newGoalData = Object.assign({}, newGoalData);

        const steps = newGoalData.steps;
        delete newGoalData.steps;

        return ApiManager.updateSteps(newGoalData._id, steps)
            .catch(e => console.error(e))
            .then(() => ApiManager.updateGoal(newGoalData))
            .then(goal => {
                const index = this.value.findIndex(goal => goal._id === newGoalData._id);
                const list = this.value.slice();

                if (index > -1) {
                    list[index] = goal;
                    this.fill(list);
                }

                this._currentWorkingCopy = null;
            });
    },

    create(newGoalData) {
        return ApiManager.createGoal(newGoalData).then(goal => {
            const list = this.value.slice();

            list.push(goal);
            this.fill(list);

            return goal;
        });
    },

    __proto__: DataStorage,
};

export default GoalManager;
