export class TextEntryPage {
    static appMenu() { return $('~App'); }
    static alertDialogs() { return $('~Alert Dialogs'); }
    static textEntry() { return $('~Text Entry dialog'); }

    static nameField() {
        return $('//android.widget.EditText[@resource-id="io.appium.android.apis:id/username_edit"]');
    }

    static passwordField() {
        return $('//android.widget.EditText[@resource-id="io.appium.android.apis:id/password_edit"]');
    }

    static btnOk() {
        return $('//android.widget.Button[@text="OK"]');
    }
}
