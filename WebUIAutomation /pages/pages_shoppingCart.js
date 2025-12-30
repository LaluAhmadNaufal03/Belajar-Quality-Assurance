import { By } from "selenium-webdriver";

class ShoppingPage {
    static cartIcon = By.id('shopping_cart_container');

    static shoppingPage = By.id('page_wrapper');

    static continueShopping = By.xpath('//*[@data-test="continue-shopping"]');

    static buttonCheckout = By.id('checkout');

    static checkoutPage = By.xpath('//*[@data-test="checkout-info-container"]');

}
export default ShoppingPage;