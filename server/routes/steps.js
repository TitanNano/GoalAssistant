const Db = require('../Db');
const Trait = require('../util/Trait');
const StepTrait = require('../traits/Step');

// sends an imssing property error to the client
const createMissingError = function(code, index, res) {
    return function(key) {
        const error = {
            errorCode: code,
            description: `The property ${key} of step ${index} is not present`,
        };

        res.status(400).send(error);
    };
};

// sends an invalid property error to the client
const createInvalidError = function(code, index, res) {
    return function(key) {
        const error = {
            errorCode: code,
            description: `The property ${key} of step ${index} is invalid`,
        };

        res.status(400).send(error);
    };
};

exports.init = function(app) {
    app.route('/api/v1/goals/:goalId/steps/:stepId')

        // the a single step for one goal
        .get((req, res) => {
            let goalId = req.params.goalId;
            let stepId = req.params.stepId;

            try {
                goalId = Db.useAsObjectId(goalId);
            } catch (e) {
                res.statusMessage = e;
                res.sendStatus(400);
                return;
            }

            try {
                stepId = Db.useAsObjectId(stepId);
            } catch(e) {
                res.statusMessage = e;
                res.sendStatus(400);
                return;
            }

            Db.get('goals', { _id: goalId })
                .catch(() => {
                    res.statusMessage = 'goal not found';
                    res.sendStatus('404');

                    return Promise.reject(res.statusMessage);
                }).then((goal) => {
                    console.log(goal, stepId);
                    const stepIsInGoal = goal.steps && goal.steps.indexOf(stepId) > -1;

                    if(!stepIsInGoal) {
                        res.statusMessage = 'step not found';
                        res.sendStatus(404);
                    }

                    return Db.get('steps', { _id: stepId })
                        .catch(() => {
                            res.statusMessage = 'unable to find step data';
                            res.sendStatus(500);

                            return Promise.reject(res.statusMessage);
                        });

                }).then((step) => {
                    res.status(200).send(step);
                }).catch((error) => console.log(error));
        })

        // update a sigle step
        .put((req, res) => {
            let goalId = req.params.goalId;
            let stepId = req.params.stepId;

            const stepData = req.body;

            try {
                goalId = Db.useAsObjectId(goalId);
            } catch(e) {
                res.statusMessage = 'invalid goal id';
                res.sendStatus(400);
                return;
            }

            try {
                stepId = Db.useAsObjectId(stepId);
            } catch (e) {
                res.statusMessage = 'invalid step id';
                res.sendStatus(400);
                return;
            }

            const isOk = Trait.verify(stepData, StepTrait, res)
                .isInvalid('title', '002.102')
                .isInvalid('dueTo', '002.103')
                .isInvalid('noteData', '002.104')
                .isOk();

            if (!isOk) {
                return;
            }

            Db.get('goals', { _id: goalId })
                .catch(() => {
                    res.statusMessage = 'goal not found';
                    res.sendStatus(404);

                    return Promise.reject(res.statusMessage);
                }).then((goal) => {
                    const found = !!goal.steps.find(step => step.equals(stepId));

                    if (!found) {
                        res.statusMessage = 'step not found';
                        res.sendStatus(404);

                        return Promise.reject(res.statusMessage);
                    }

                    stepData._id = stepId;

                    return Db.put('steps', stepData).catch(() => {
                        res.statusMessage = 'faild to store step';
                        res.sendStatus(500);

                        return Promise.reject(res.statusMessage);
                    });
                }).then(() => {
                    return Db.get('steps', { _id: stepId });
                }).then(step => {
                    res.status(200).send(step);
                }).catch(e => console.error(e));
        });


    app.route('/api/v1/goals/:goalId/steps')

        // get all steps for a goal
        .get((req, res) => {
            let goalId = req.params.goalId;

            try {
                goalId = Db.useAsObjectId(goalId);
            } catch (e) {
                res.statusMessage = e;
                res.sendStatus(400);

                return;
            }

            Db.get('goals', { _id: goalId })
                .catch((e) => {
                    console.error(e);

                    res.statusMessage = 'goal not found';
                    res.sendStatus(404);

                    return Promise.reject(e);
                }).then((goal) => {
                    // got the goal fetching all steps
                    return Db.get('steps', { _id: { $in: goal.steps } })
                        .catch((e) => {
                            res.sendStatus(500);

                            return Promise.reject(e);
                        });
                }).then(stepList => {
                    res.status(200).send(stepList);
                }).catch((e) => console.error(e));
        })

        // post / create a new [batch] of steps
        .post((req, res) => {
            let goalId = req.params.goalId;

            try {
                goalId = Db.useAsObjectId(goalId);
            } catch (e) {
                res.statusMessage = e;
                res.sendStatus(400);

                return;
            }

            let stepList = req.body;

            if (!Array.isArray(stepList)) {
                stepList = [stepList];
            }

            for (let index = 0; index < stepList.length; index++) {
                const step = stepList[index];

                const isOk = Trait.verify(step, StepTrait, res)
                    .isMissing('title', createMissingError('002.002', index, res))
                    .isInvalid('title', createInvalidError('002.102', index, res))
                    .isMissing('dueTo', (key) => step[key] = 0)
                    .isInvalid('dueTo', createInvalidError('002.103', index, res))
                    .isMissing('noteData', (key) => step[key] = '')
                    .isInvalid('noteData', createInvalidError('002.104', index, res))
                    .isOk();

                if (!isOk) {
                    return;
                }
            }

            Db.get('goals', { _id: goalId })
                .catch(() => {
                    res.statusMessage = 'goal not found';
                    res.sendStatus(404);

                    return Promise.reject(res.statusMessage);
                }).then(goal => {
                    return Db.put('steps', stepList).catch((e) => {
                        console.error(e);
                        res.statusMessage = 'unable to store steps';
                        res.sendStatus(500);

                        return Promise.reject(res.statusMessage);
                    }).then((results) => {
                        goal.steps = goal.steps || [];

                        results.forEach((result, index) => {
                            const id = result.upsertedId._id;

                            if (id) {
                                goal.steps.push(id);
                                stepList[index]._id = id;
                            }
                        });

                        return Db.put('goals', goal);
                    });
                }).then(() => {
                    res.status(201).send(stepList);
                }).catch((e) => console.error(e));
        })

        // put / update a batch of steps
        .put((req, res) => {
            let goalId = req.params.goalId;
            const stepList = req.body;
            let stepIdList;

            try {
                stepIdList = stepList.map((step, i) => {
                    try {
                        console.log('001:', step);
                        step._id = Db.useAsObjectId(step._id);

                        return step._id;
                    } catch(e) {
                        console.log(step, e);
                        const error = new Error('invalid');
                        error.data = [step, i];

                        throw error;
                    }
                });
            } catch(e) {
                res.statusMessage = `invalid _id in step ${e.data[0]}`;
                res.sendStatus(400);
                return;
            }

            try {
                goalId = Db.useAsObjectId(goalId);
            } catch (e) {
                res.statusMessage = e;
                res.sendStatus(400);

                return;
            }

            Db.get('goals', { _id: goalId })
                .catch(() => {
                    res.statusMessage = 'goal not found';
                    res.sendStatus(404);
                }).then((goal) => {
                    try {
                        stepIdList.forEach((id, index) => {
                            if (!goal.steps.find(item => item.equals(id))) {
                                let error = new Error('unable to find step id');
                                error.data = [id, index];

                                throw error;
                            }
                        });
                    } catch(e) {
                        console.log(stepIdList, stepList, e);
                        res.statusMessage = `Step ${e.data[0]} is not in goal`;
                        res.sendStatus(404);

                        return Promise.reject(res.statusMessage);
                    }

                    for (let index = 0; index < stepList.length; index++) {
                        const step = stepList[index];

                        const isOk = Trait.verify(step, StepTrait, res)
                            .isInvalid('title', createInvalidError('002.102', index, res))
                            .isInvalid('dueTo', createInvalidError('002.103', index, res))
                            .isInvalid('noteData', createInvalidError('002.104', index, res))
                            .isOk();

                        if (!isOk) {
                            return Promise.reject(`Step ${index}: invalid property`);
                        }
                    }

                    return Db.put('steps', stepList)
                        .catch((e) => {
                            res.sendStatus(500);

                            return Promise.reject(e);
                        });
                }).then(() => {
                    return Db.get('steps', { _id: { $in: stepIdList } });
                }).then(steps => {
                    res.status(200).send(steps);
                });
        });
};
