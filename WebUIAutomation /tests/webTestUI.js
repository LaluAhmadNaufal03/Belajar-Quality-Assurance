//Jika ingin jalankan code ini ubah type: "module" di package.json

import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import pixelmatch  from 'pixelmatch';

//memanggil file dalam folder pages
import page_login from '../pages/pages_loginPage.js';
import page_product from '../pages/pages_productPage.js';
import page_shopping from '../pages/pages_shoppingCart.js';
import { PNG } from 'pngjs';

describe('Web UI Test', function(){

    let driver;
    let startTime;
    let options;

before(async function(){
    console.log('Memulai browser dan membuka halaman web');

    startTime = Date.now(); //catat waktu mulai

    options = new chrome.Options();
    
    options.addArguments('--headed'); //buka browser dalam mode headed (tampil)
    //options.addArguments('--incognito'); //buka browser dalam mode incognito

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

        //Validasi judul halaman
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        //Validasi button login
        const buttonBeforePOM = await driver.findElement(page_login.buttonBefore);
        await driver.wait(until.elementIsVisible(buttonBeforePOM), 5000, 'Button Login harus tampil saat halaman login dibuka');
        assert.strictEqual(await buttonBeforePOM.isDisplayed(), true);

        //Input username, password, dan klik tombol login
        let InputUsernamePOM = await driver.findElement(page_login.InputUsername);

        let inputPasswordPOM = await driver.findElement(page_login.inputPassword);

        let loginButtonPOM = await driver.findElement(page_login.loginButton);

        await InputUsernamePOM.sendKeys('standard_user');

        await inputPasswordPOM.sendKeys('secret_sauce');

        await loginButtonPOM.click();

        //Validasi button hilang setelah login 
        const buttonAfterPOM = await driver.findElements(page_login.buttonAfter); //findElements untuk plural, findElement untuk singular
        assert.strictEqual(buttonAfterPOM.length, 0, 'Button Login harus hilang setelah login berhasil'); //length untuk menghitung jumlah element. diharapkan 0, atau length = 0.

    });

    //Test Case 2: Sort Products A-Z
    it('Sort products from A-Z', async function(){
        //Validasi tampilan halaman produk
        const productPagePOM = await driver.wait(until.elementLocated(page_product.productPage), 4000);
        await driver.wait(until.elementIsVisible(productPagePOM), 5000, 'Halaman produk harus tampil setelah login berhasil');
        assert.strictEqual(await productPagePOM.isDisplayed(), true);
        
        //Validasi tampilan elemen button sort produk
        const sortProductPOM = await driver.findElement(page_product.sortProduct);
        await driver.wait(until.elementIsVisible(sortProductPOM), 2000, 'Elemen button sort produk harus tampil di halaman produk');
        assert.strictEqual(await sortProductPOM.isDisplayed(), true);

        //Sort button produk dari A-Z
        const sortButtonPOM = await driver.findElement(page_product.sortButton);
        
        await sortButtonPOM.click(); //klik dulu button sortnya biar opsi tampil

        //Validasi Text option A-Z
        const optionAZPOM = await driver.findElement(page_product.optionAZ);
        await driver.wait(until.elementIsVisible(optionAZPOM), 5000);
        const optionAZText = await optionAZPOM.getText();
        assert.strictEqual(await optionAZPOM.isDisplayed(), true);
        assert.strictEqual(optionAZText, 'Name (A to Z)', 'Text option A-Z harus sesuai');
        
        await optionAZPOM.click(); //klik option A-Z untuk mengurutkan produk dari A-Z

        //Validasi urutan produk A-Z
        const productNamesPOM = await driver.findElements(page_product.productNames); //cari semua elemen nama produk
        let names = []; // [] adalah array kosong untuk menampung nama produk
        for (let item of productNamesPOM) {
            names.push(await item.getText()); //push untuk menambahkan nama produk ke dalam array names, push menmabahkan di akhir array, kalau menambahkan di awal array pakai unshift
        }
        const sortedNames = [...names].sort(); //[...names] untuk menyalin names dan di buat menjadi array baru, lalu di sort atau diurutkan secara alfabet, kenapa harus disalin? karena kalau langsung di sort names, maka names juga akan terubah urutannya tampilan UI awalnya.
        assert.deepStrictEqual(names, sortedNames, 'Produk harus terurut dari A-Z'); //names adalah urutan produk di tampilan UI, sedangkan sortedNames adalah urutan produk yang sudah di sort dari A-Z, jadi diharapkan keduanya sama.
    });

    it('From shopping page to product page', async function(){

        //validasi tampilan element button shopping cart
        const iconCartPOM = await driver.findElement(page_shopping.cartIcon);
        await driver.wait(until.elementIsVisible(iconCartPOM), 3000, 'Elemen button shopping harus tampil di halaman produk');
        assert.strictEqual(await iconCartPOM.isDisplayed(), true);

        //klik button shopping menampilkan halaman shopping
        await iconCartPOM.click();

        //validasi tampil halaman shopping
        const pageShopping = await driver.wait(until.elementLocated(page_shopping.shoppingPage));
        await driver.wait(until.elementIsVisible(pageShopping),3000, 'Halaman produk harus tampil setelah button di klik');
        assert.strictEqual(await pageShopping.isDisplayed(), true);

        //tombol continue shopping di klik dan validasi text button continue shopping
        const continueShoppingPOM = await driver.findElement(page_shopping.continueShopping);
        const titleShopping = await continueShoppingPOM.getText();
        assert.strictEqual(titleShopping, 'Continue Shopping');
        await continueShoppingPOM.click();
        console.log('Tombol continue shopping di klik');

        //Validasi setelah button continue shopping di klik
        const bunttonAfterShoppingPOM = await driver.findElements(page_shopping.continueShopping);
        assert.strictEqual(bunttonAfterShoppingPOM.length, 0, 'Button continue shopping harus hilang setelah halaman produk ditampilkan');

        //Validasi tampilan halaman produk
        const productPagePOM = await driver.wait(until.elementLocated(page_product.productPage), 4000);
        await driver.wait(until.elementIsVisible(productPagePOM), 5000, 'Halaman produk harus tampil setelah login berhasil');
        assert.strictEqual(await productPagePOM.isDisplayed(), true);
    });
    
    it('Checkout Page', async function(){
        
        //validasi tampilan element button shopping cart
        const cartIconPOM = await driver.findElement(page_shopping.cartIcon);
        await driver.wait(until.elementIsVisible(cartIconPOM), 3000, 'Elemen button shopping harus tampil di halaman produk');
        assert.strictEqual(await cartIconPOM.isDisplayed(), true);

        //klik button shopping menampilkan halaman shopping
        await cartIconPOM.click();

        //tombol checkout di klik dan validasi text button checkout
        const checkoutButtonPOM = await driver.findElement(page_shopping.buttonCheckout);
        const titleCheckout = await checkoutButtonPOM.getText();
        assert.strictEqual(titleCheckout, 'Checkout');
        await checkoutButtonPOM.click();
        console.log('Tombol checkout di klik');

        //Validasi setelah button checkout di klik
        const bunttonAfterCheckoutPOM = await driver.findElements(page_shopping.buttonCheckout);
        assert.strictEqual(bunttonAfterCheckoutPOM.length, 0, 'Button checkout harus hilang setelah halaman checkout ditampilkan');

        //Validasi tampilan halaman checkout
        const checkoutPagePOM = await driver.wait(until.elementLocated(page_shopping.checkoutPage), 3000);
        await driver.wait(until.elementIsVisible(checkoutPagePOM), 3000, 'Halaman checkout harus tampil setelah button checkout berhasil di klik');
        assert.strictEqual(await checkoutPagePOM.isDisplayed(), true);

        //membuat validasi testing pada halaman checkout

        let screenshot = await driver.takeScreenshot();
        let imgBuffer = Buffer.from(screenshot, 'base64');
        fs.writeFileSync("current.png", imgBuffer);

        if(!fs.existsSync("baseline.png")){
            fs.copyFileSync("current.png", "baseline.png");
            console.log("Baseline image saved.");
        }

        let img1 = PNG.sync.read(fs.readFileSync("baseline.png"));
        let img2 = PNG.sync.read(fs.readFileSync("current.png"));
        let { width, height } = img1;
        let diff = new PNG({ width, height });

        let diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});

        fs.writeFileSync("diff.png", PNG.sync.write(diff));

        if(diffPixels > 0){
            console.log(`Perbedaan visual ditemukan! pixel perbedaannya: ${diffPixels}`);
        }
        else{
            console.log("Tidak ditemukan adanya perbedaan visual");
        }
    });
})