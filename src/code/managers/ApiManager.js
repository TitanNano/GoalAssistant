import NetworkRequestBasic  from 'application-frame/core/NetworkRequest';
import DataStorage from 'application-frame/core/DataStorage';

/**
 * [NetworkRequest description]
 *
 * @extends {NetworkRequestBasic}
 */
const NetworkRequest = {
    constructor(url, config) {
        this._make(url, config);

        return this;
    },

    __proto__: NetworkRequestBasic,
};

const ApiManager = {
    _baseURI: 'http://localhost:3000/api/v1',

    init() {
        this._store = Object.create(DataStorage).constructor();
    },

    /**
     * [_createRequest description]
     *
     * @param {string} path
     * @param {Object} params
     *
     * @return {NetworkRequest}
     */
    _createRequest(path, params = {}) {
        params = Object.keys(params).reduce((target, current) => {
            if (target.length > 0) {
                target += '&';
            }

            const value = params[current];

            if (typeof value === 'string') {
                target += `${current}=${encodeURIComponent(value)}`;
            } else if(typeof value === 'boolean') {
                target += `${current}=${value ? 1 : 0}`;
            } else {
                target += `${current}=${value}`;
            }

            return target;
        }, '');

        if (params.length > 0) {
            params = `?${params}`;
        }

        const request = Object.create(NetworkRequest)
            .constructor(`${this._baseURI}${path}${params}`, { type: 'json'});

        return request;
    },

    getGoalList(finished = false) {
        const request = this._createRequest('/goals', {
            isFinished: finished,
        });

        request.body(null);

        return request.send();
    },

    createGoal(goalData) {
        const request = this._createRequest('/goals');

        request.method = 'POST';
        request.body(goalData);

        return request.send();
    },

    updateGoal(goalData) {
        const request = this._createRequest(`/goals/${goalData._id}`);

        request.method = 'PUT';
        request.body(goalData);

        return request.send();
    },

    getSteps(goalId) {
        const request = this._createRequest(`/goals/${goalId}/steps`);

        return request.send();
    },

    createSteps(goalId, newSteps) {
        const request = this._createRequest(`/goals/${goalId}/steps`);

        request.method = 'POST';
        request.body(newSteps);
        return request.send();
    },

    updateSteps(goalId, stepData) {
        const request = this._createRequest(`/goals/${goalId}/steps`);

        request.method = 'PUT';
        request.body(stepData);

        return request.send();
    },

    updateOneStep(goalId, stepData) {
        const request = this._createRequest(`/goals/${goalId}/steps/${stepData._id}`);

        request.method = 'PUT';
        request.body(stepData);

        return request.send();
    }
};

export default ApiManager;
