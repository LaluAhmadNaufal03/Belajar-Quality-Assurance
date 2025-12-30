import { By } from "selenium-webdriver";

class PageProduct {
    //halaman setelah login
    static productPage = By.xpath('//*[@id="page_wrapper"]');

    //dropdown sort
    static sortProduct = By.xpath('//*[@data-test="product-sort-container"]');

    //tampil option dropdown
    static sortButton = By.xpath('//*[@data-test="product-sort-container"]');

    //opsi A-Z
    static optionAZ = By.xpath('//*[@value="az"]');

    //list nama produk 
    static productNames = By.className('inventory_item_name');
}

export default PageProduct;

