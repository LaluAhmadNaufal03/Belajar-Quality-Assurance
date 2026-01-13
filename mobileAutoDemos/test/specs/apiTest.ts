import { TextEntryActions } from "../actions/apidemos.action.ts";

const action = new TextEntryActions();

describe("APIDemos - Text Entry Dialog", () => {

    it("TC001 - Input & verify name: naufal and password: naufal123", async () => {
        await action.openTextEntryDialog();
        await action.clearField();

        await action.inputName("naufal");
        await action.inputPassword("naufal123");

        expect(await action.getName()).toEqual("naufal");
        expect(await action.isPasswordFilled()).toBe(true);
    });

    it("TC002 - Input & verify name:user and password: user123", async () => {
        await action.clearField();

        await action.inputName("user");
        await action.inputPassword("user123");

        expect(await action.getName()).toEqual("user");
        expect(await action.isPasswordFilled()).toBe(true);
    });
});