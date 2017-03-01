import { Router } from '@af-modules/router';
import DataBinding from '@af-modules/databinding';

const PageManager = {

    pages: null,

    navigation: null,

    template: 'root-container',

    _selectedPanel: 'main',

    get selectedPanel() {
        return this._selectedPanel;
    },

    set selectedPanel(value) {
        if (typeof value === 'string') {
            this._selectedPanel = value;
        }
    },

    get isDrawerOpen() {
        return this.selectedPanel === 'drawer';
    },

    set isDrawerOpen(value) {
        this.selectedPanel = value ? 'drawer' : 'main';
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
        this.scope = DataBinding.makeTemplate(`#${this.template}`, { view: this });

        this.pages.forEach(page => page.constructor());
        this.pages.forEach(page => this.addRoutable(page.route, page));

        this.restore();
    },

    __proto__: Router,
};

export default PageManager;
