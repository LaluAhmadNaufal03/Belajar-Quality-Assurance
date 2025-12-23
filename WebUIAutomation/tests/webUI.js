const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { dir } = require('console');

describe('Web UI Test', function(){
    
    let driver;
    //membuat login sukses dan urutan produk dari A-Z 
    it('should login successfully and sort products from A-Z', async function(){
        driver = await new Builder().forBrowser('chrome').build();

        await driver.get('https://www.saucedemo.com/');

        //Validasi judul halaman
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        //Validasi button login
        const buttonBefore = await driver.findElement(By.xpath('//*[@name="login-button"]'));
        await driver.wait(until.elementIsVisible(buttonBefore), 5000, 'Button Login harus tampil saat halaman login dibuka');
        buttonBefore.isDisplayed(), true;

        //Input username, password, dan klik tombol login
        let InputUsername = await driver.findElement(By.id('user-name'));

        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'));

        let loginButton = await driver.findElement(By.xpath('//*[@name="login-button"]'));

        await InputUsername.sendKeys('standard_user');

        await inputPassword.sendKeys('secret_sauce');

        await loginButton.click();

        //Validasi button hilang setelah login 
        const buttonAfter = await driver.findElements(By.xpath('//*[@name="login-button"]')); //findElements untuk plural, findElement untuk singular
        assert.strictEqual(buttonAfter.length, 0, 'Button Login harus hilang setelah login berhasil'); //length untuk menghitung jumlah element. diharapkan 0, atau length = 0.

        //Validasi tampilan halaman produk
        const productPage = await driver.wait(until.elementLocated(By.xpath('//*[@id="page_wrapper"]')), 4000);
        await driver.wait(until.elementIsVisible(productPage), 5000, 'Halaman produk harus tampil setelah login berhasil');
        await productPage.isDisplayed(), true;
        
        //Validasi tampilan elemen button sort produk
        const sortProduct = await driver.findElement(By.xpath('//*[@data-test="product-sort-container"]'));
        await driver.wait(until.elementIsVisible(sortProduct), 2000, 'Elemen button sort produk harus tampil di halaman produk');
        sortProduct.isDisplayed(), true;

        //Sort button produk dari A-Z
        const sortButton = await driver.findElement(By.xpath('//*[@data-test="product-sort-container"]'));

        //Validasi produk terurut dari A-Z
        await sortButton.getAttribute('value="az"'); ////getAttribute untuk mengambil attribute HTML dari element ini, disini yang di ambil attribute "value"
        
        //Validasi Text option A-Z
        const optionAZ = await driver.findElement(By.xpath('//*[@value="az"]'));
        const optionAZText = await optionAZ.getText();
        assert.strictEqual(optionAZText, 'Name (A to Z)', 'Text option A-Z harus sesuai');

        //Validasi urutan produk A-Z
        const productNames = await driver.findElement(By.xpath('//*[@value="az"]'));
        let names = []; // [] adalah array kosong untuk menampung nama produk
        for (let i = 0; i < productNames.length; i++) {
            const name = await productNames[i].getText(); //[i] untuk mengakses elemen ke-i/ ke-0 dari array productNames, lalu di getText untuk mengambil teks dari elemen tersebut
            names.push(name); //push untuk menambahkan nama produk ke dalam array names, push menmabahkan di akhir array, kalau menambahkan di awal array pakai unshift
        }
        const sortedNames = [...names].sort(); //[...names] untuk menyalin names dan di buat menjadi array baru, lalu di sort atau diurutkan secara alfabet, kenapa harus disalin? karena kalau langsung di sort names, maka names juga akan terubah urutannya tampilan UI awalnya.
        assert.deepStrictEqual(names, sortedNames, 'Produk harus terurut dari A-Z'); //names adalah urutan produk di tampilan UI, sedangkan sortedNames adalah urutan produk yang sudah di sort dari A-Z, jadi diharapkan keduanya sama.

        //Delay program
        await driver.sleep(6000);

        //Tutup browser
        await driver.quit();

    });
})