import { By } from "selenium-webdriver";

class PageLogin{
    static InputUsername = By.id('user-name');

    static inputPassword = By.xpath('//*[@data-test="password"]');

    static loginButton = By.xpath('//*[@name="login-button"]');

    static buttonBefore = By.xpath('//*[@name="login-button"]');

    static buttonAfter = By.xpath('//*[@name="login-button"]');
}

export default PageLogin;