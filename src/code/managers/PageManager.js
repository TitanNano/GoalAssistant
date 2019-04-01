import { Router } from '@af-modules/router';
import DataBinding from '@af-modules/databinding';

const PageManager = {

    pages: null,

    navigation: null,

    template: 'root-container',

    _selectedPanel: 'main',

    _isDrawerOpen: false,

    get isDrawerOpen() {
        return this._isDrawerOpen;
    },

    set isDrawerOpen(value) {
        this._isDrawerOpen = value;
        this.scope.update();
    },

    get currentPage() {
        return this.navigation.findIndex(page => page.isActive);
    },

    set currentPage(rawIndex) {
        let index = parseInt(rawIndex);

        if (Number.isNaN(index)) {
            console.warn('[PageManager]', 'assigned value is not a number! ', rawIndex);
            index = 0;
        }

        const newPage = this.navigation[index];

        this.isDrawerOpen = false;
        this.switchTo(newPage.route);
    },

    init({ pages, navigation } = {}) {
        super.init([{
            path: '/',
            onEnter: () => {
                this.switchTo(this.navigation[0].route);
            }
        }]);

        this.pages = pages;
        this.navigation = navigation;
        this.scope = DataBinding.makeTemplate(`#${this.template}`, { view: this }).scope;

        this.pages.forEach(page => page.constructor());
        this.pages.forEach(page => this.addRoutable(page.route, page));

        this.restore();
    },

    __proto__: Router,
};

export default PageManager;
