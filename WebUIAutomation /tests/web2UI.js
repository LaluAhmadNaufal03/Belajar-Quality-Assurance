//Jika ingin jalankan code ini ubah type: "cummonjs" di package.json

const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('Web UI Test', function(){

    let driver;
    let startTime;
    let options;

before(async function(){
    console.log('Memulai browser dan membuka halaman web');

    startTime = Date.now(); //catat waktu mulai

    options = new chrome.Options();
    
    options.addArguments('--headed'); //buka browser dalam mode headed (tampil)

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    await driver.get('https://www.saucedemo.com/');

    });

after(async function(){
    console.log('Menutup browser setelah pengujian selesai');
        
    const endTime = Date.now(); //catat waktu selesai

    const duration = (endTime - startTime) / 1000; //hitung durasi dalam detik

    console.log(`Durasi Pengujian: ${duration} detik`);

    //Delay program
    await driver.sleep(6000);

    //Tutup browser
    await driver.quit();

    });
    
    //Test Case 1: Success Login 
    it('login successfully', async function(){

        //Dipindahkan ke dalam before
        /*options = new chrome.Options();
        options.addArguments('--headed'); //buka browser dalam mode headed (tampil)

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        await driver.get('https://www.saucedemo.com/'); */

        //Validasi judul halaman
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        //Validasi button login
        const buttonBefore = await driver.findElement(By.xpath('//*[@name="login-button"]'));
        await driver.wait(until.elementIsVisible(buttonBefore), 5000, 'Button Login harus tampil saat halaman login dibuka');
        assert.strictEqual(await buttonBefore.isDisplayed(), true);

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

    });

    //Test Case 2: Sort Products A-Z
    it('Sort products from A-Z', async function(){
        //Validasi tampilan halaman produk
        const productPage = await driver.wait(until.elementLocated(By.xpath('//*[@id="page_wrapper"]')), 4000);
        await driver.wait(until.elementIsVisible(productPage), 5000, 'Halaman produk harus tampil setelah login berhasil');
        assert.strictEqual(await productPage.isDisplayed(), true);
        
        //Validasi tampilan elemen button sort produk
        const sortProduct = await driver.findElement(By.xpath('//*[@data-test="product-sort-container"]'));
        await driver.wait(until.elementIsVisible(sortProduct), 2000, 'Elemen button sort produk harus tampil di halaman produk');
        assert.strictEqual(await sortProduct.isDisplayed(), true);

        //Sort button produk dari A-Z
        const sortButton = await driver.findElement(By.xpath('//*[@data-test="product-sort-container"]'));
        
        await sortButton.click(); //klik dulu button sortnya biar opsi tampil

        //Validasi Text option A-Z
        const optionAZ = await driver.findElement(By.xpath('//*[@value="az"]'));
        await driver.wait(until.elementIsVisible(optionAZPOM), 5000);
        const optionAZText = await optionAZ.getText();
        assert.strictEqual(await optionAZPOM.isDisplayed(), true);
        assert.strictEqual(optionAZText, 'Name (A to Z)', 'Text option A-Z harus sesuai');
        
        await optionAZ.click(); //klik option A-Z untuk mengurutkan produk dari A-Z

        //Validasi urutan produk A-Z
        const productNames = await driver.findElements(By.className('inventory_item_name')); //cari semua elemen nama produk
        let names = []; // [] adalah array kosong untuk menampung nama produk
        for (let item of productNames) {
            names.push(await item.getText()); //push untuk menambahkan nama produk ke dalam array names, push menmabahkan di akhir array, kalau menambahkan di awal array pakai unshift
        }
        const sortedNames = [...names].sort(); //[...names] untuk menyalin names dan di buat menjadi array baru, lalu di sort atau diurutkan secara alfabet, kenapa harus disalin? karena kalau langsung di sort names, maka names juga akan terubah urutannya tampilan UI awalnya.
        assert.deepStrictEqual(names, sortedNames, 'Produk harus terurut dari A-Z'); //names adalah urutan produk di tampilan UI, sedangkan sortedNames adalah urutan produk yang sudah di sort dari A-Z, jadi diharapkan keduanya sama.
    });
})