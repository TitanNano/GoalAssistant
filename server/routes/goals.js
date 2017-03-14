const Db = require('../Db');
const Trait = require('../util/Trait');
const GoalTrait = require('../traits/Goal');
const { ObjectId } = require('mongodb');

const getGoalSteps = function(goal) {
    return Db.getList('steps', { _id: { $in: goal.steps } }, { allowEmpty: true })
        .catch((e) => console.log('error when fetching goal steps', e))
        .then(steps => goal.steps = steps);
};


exports.init = function(app) {
    app.route('/api/v1/goals/:goalId?')
        .get((req, res) => {

            if (req.params.goalId) {
                let goalId = req.params.goalId;

                try {
                    goalId = Db.useAsObjectId(goalId);
                } catch(e) {
                    res.statusMessage = 'invalid goalId';
                    res.sendStatus(400);
                    return;
                }

                Db.get('goals', { _id: goalId })
                    .then((goal) => res.status(200).send(goal))
                    .catch(() => {
                        res.statusMessage = 'goal not found';
                        res.sendStatus(404);
                    });
            } else {
                Db.getList('goals', {}, { allowEmpty: true }).then(list => {

                    const transactions = Promise.all(list.map(goal => {
                        return getGoalSteps(goal);
                    }));

                    return transactions.then(() => list);
                }).then((list) => {
                    res.status(200).send(list);
                });
            }
        })

        .post((req, res) => {

            if (req.params.goalId) {
                res.sendStatus(404);
                return;
            }

            const isModelOk = Trait.verify(req.body, GoalTrait, res)
                .isMissing('title', '001.002')
                .isInvalid('title', '001.102')
                .isInvalid('steps', '001.103')
                .isInvalid('dueTo', '001.104')
                .isInvalid('public', '001.105')
                .isInvalid('description', '001.106')
                .isInvalid('isFinished', '001.107')
                .isMissing('owner', '001.008')
                .isInvalid('owner', '001.108')
                .isOk();

            if (isModelOk) {
                req.body.steps = [];

                Db.put('goals', req.body).then((result) => {
                    const goalId = result.upsertedId._id;

                    return Db.get('goals', { _id: goalId });
                }).then(goal => {
                    res.status(200).send(goal);
                });
            }
        })

        .put((req, res) => {
            if (!req.params.goalId) {
                res.sendStatus(404);
                return;
            }

            const id = new ObjectId(req.params.goalId);
            const model = req.body;

            model._id = id;

            // check if resource exists
            Db.get('goals', { _id: id })
                .catch(() => {
                    res.sendStatus(404);
                    return Promise.reject('invalid goal id, returning 404');
                }).then(() => {

                    // validate received model
                    const isModelOk = Trait.verify(req.body, GoalTrait, res)
                        .isInvalid('title', '001.102')
                        .isInvalid('steps', '001.103')
                        .isInvalid('dueTo', '001.104')
                        .isInvalid('public', '001.105')
                        .isInvalid('description', '001.106')
                        .isInvalid('isFinished', '001.107')
                        .isInvalid('owner', '001.108')
                        .isOk();

                    // save update
                    if (isModelOk) {
                        return Db.put('goals', model);
                    }
                }).then(() => {
                    return Db.get('goals', { _id: id })
                        .then(goal => {
                            return getGoalSteps(goal).then(() => goal);
                        });
                }).then((result) => {
                    res.status(200).send(result);
                }).catch(error => {
                    console.log(error);
                });
        });
};
