const { MongoClient, ObjectId } = require('mongodb');

const Config = require('./util/Config');

const LAST_X_ITEMS = Symbol('LAST_X_ITEMS');

const dbHost = Config.db_domain;

let connectDb = function() {
    return MongoClient.connect(dbHost).then(db => {
        console.log('successfully connected to the db!');

        return db;
    }).catch(error => console.error('db connection faild', error));
};

let ensureConnection = function() {
    return db.then(dbInstance => {
        if (!dbInstance || !dbInstance.topology || !dbInstance.topology.isConnected()) {
            console.warn('db connection lost... trying to reconnect!');
            db = connectDb();
        }

        return db;
    });
};

const createPutQuery = function(doc) {
    let query = null;

    if (doc._id) {
        query = { _id: doc._id };
    } else {
        query = doc;
    }

    return query;
};

console.log('trying to connect to the db...');
let  db = connectDb();

let Db = {

    getDbInstance: ensureConnection,

    put: function(collection, doc) {
        return ensureConnection().then(db => {
            if (!Array.isArray(doc)) {
                const query = createPutQuery(doc);

                delete doc._id;

                return db.collection(collection).updateOne(query, { $set: doc }, { upsert: true });
            } else {
                return Promise.all(doc.map(doc => {
                    const query = createPutQuery(doc);

                    delete doc._id;

                    return db.collection(collection).updateOne(query, { $set: doc }, { upsert: true });
                }));
            }
        });
    },

    get: function(collection, query, {allowEmpty = false, limit = 0, skip = 0 } = {}) {
        return ensureConnection().then(db => {

            if (skip.isSkipRange) {
                if (skip.type === LAST_X_ITEMS) {
                    skip = db.collection(collection).count() - skip.count;
                } else {
                    console.error('Invalid skip range in db query!');
                    return Promise.reject();
                }
            }

            return db.collection(collection).find(query).limit(limit).skip(skip).toArray();
        }).then(list => {
            if (list.length < 2) {
                if (list[0]) {
                    return list[0];
                }

                if (allowEmpty) {
                    return [];
                } else {
                    return Promise.reject('no results');
                }
            } else {
                return list;
            }
        });
    },

    getList: function(collection, query, allowEmpty) {
        return this.get(collection, query, allowEmpty).then(data => {
            if (!Array.isArray(data)) {
                return [data];
            } else {
                return data;
            }
        });
    },

    getLastDocuments(count) {
        return { isSkipRange: true, type: LAST_X_ITEMS, count: count };
    },

    useAsObjectId(id) {
        try {
            return new ObjectId(id);
        } catch (e) {
            console.log('db.001:', e);
            throw 'invalid object id!';
        }
    },

};

module.exports = Db;
