import ViewController from '@af-modules/databinding/prototypes/ViewController';
import PageManager from '../managers/PageManager';

const ReminderModalController = {

    route: '*/reminder/{goalId}',

    template: 'reminder-modal',

    isReminderActive: false,
    isNoteVerifyActive: false,

    get reminderDialogExitStrategy() {
        return this.isNoteVerifyActive ? 'slide-left-animation' : 'fade-out-animation';
    },

    get showReminderDialog() {
        return this.isActive && this.isReminderActive;
    },

    get showNoteVerifyDialog() {
        return this.isActive && this.isNoteVerifyActive;
    },

    onRouteEnter(path, params) {
        super.onRouteEnter(path, params);

        this.currentGoal = {};

        this.isReminderActive = true;
        this.isNoteVerifyActive = false;
    },

    onNotDone() {
        const path = PageManager.getCurrentPath();

        path.shift();
        path.pop();
        path.pop();

        PageManager.switchTo(`/${path.join('/')}`);
    },

    onDone() {
        this.isReminderActive = false;
        this.isNoteVerifyActive = true;
    },

    onCompletelyDone() {
        this.isNoteVerifyActive = false;
    },

    __proto__: ViewController,
};

export default ReminderModalController;
