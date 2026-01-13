import { TextEntryPage } from "../pageobjects/apiDemos.page.ts";

export class TextEntryActions {

    async openTextEntryDialog() {
        await TextEntryPage.appMenu().click();
        await TextEntryPage.alertDialogs().click();
        await TextEntryPage.textEntry().click();
    }

    async clearField() {
        await TextEntryPage.nameField().clearValue();
        await TextEntryPage.passwordField().clearValue();
    }

    async inputName(name: string) {
        await TextEntryPage.nameField().setValue(name);
    }

    async inputPassword(password: string) {
        await TextEntryPage.passwordField().setValue(password);
    }

    async getName() {
        return await TextEntryPage.nameField().getText();
    }

    async isPasswordFilled() {
        const value = await TextEntryPage.passwordField().getText();
        return value.length > 0;
    }
}
