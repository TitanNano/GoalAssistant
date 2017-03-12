
const createError = function(response, key, code) {
    response.status('400').send({
        errorCode: code,
        description: `The submitted property ${key} is invalid!`,
    });
};

const Trait = {
    verify(data, trait, response) {
        const missing = [];
        const invalid = [];

        Object.keys(trait).forEach(key => {
            console.log(`Checking model property ${key}...`);

            if (data[key]) {
                let proto = Object.getPrototypeOf(data[key]);

                if (proto.constructor) {
                    proto = proto.constructor.name;
                }

                console.log(`${key}: ${proto} shold be ${trait[key]}`);
            }

            if (!data[key]) {
                missing.push(key);
            } else {
                const proto = (typeof trait[key] === 'function') ? trait[key].prototype : trait[key];

                if (Object.getPrototypeOf(data[key]) !== proto) {
                    invalid.push(key);
                }
            }
        });

        const actions = {
            isInvalid(key, fnOrCode) {
                const isInvalid = invalid.indexOf(key) > -1;

                if (isInvalid) {
                    if (typeof fnOrCode === 'function') {
                        fnOrCode(key);
                    } else if (this.isOk()) {
                        createError(response, key, fnOrCode);
                    }
                }

                return actions;
            },

            isMissing(key, fnOrCode) {
                const isMissing = missing.indexOf(key) > -1;

                if (isMissing) {
                    if (typeof fnOrCode === 'function') {
                        fnOrCode(key);
                    } else if (this.isOk()) {
                        createError(response, key, fnOrCode);
                    }
                }

                return actions;
            },

            isOk(fn) {
                if (!response.headersSent) {
                    if (fn) {
                        fn();
                    }

                    return true;
                }

                return false;
            }
        };

        return actions;
    }
};

module.exports = Trait;
