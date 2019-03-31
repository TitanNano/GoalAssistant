import { BindingApi } from '@af-modules/databinding';

const QueryBinding = {

    name: 'bind-query',

    target: null,
    query: null,
    property: null,

    _make(...args) {
        return this.constructor(...args);
    },

    constructor({ node, text, parameter }) {
        const regExp = /-[a-z0-9]/g;

        this.target = node;
        this.query = text;
        this.property = parameter;

        let matches = null;

        while((matches = regExp.exec(parameter))) {
            const oldText = matches[0];
            const newText = oldText.substr(1).toUpperCase();

            this.property = this.property.replace(oldText, newText);
        }

        BindingApi(this).attachBinding(this);
    },

    update() {
        const element = this.target.ownerDocument.querySelector(this.query);

        if (!element) {
            console.warn(`unable to locate element "${this.query}"`);
            return;
        }

        if (this.target[this.property] === element) {
            return;
        }

        this.target[this.property] = element;
    },

    __proto__: BindingApi().Binding,
};

BindingApi().registerBinding(QueryBinding);

export default QueryBinding;
