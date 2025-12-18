const {expect} = require ('chai');

describe('API Automation Tests', () => {

    let token = ''; // variabel untuk menyimpan token

    //mendapatkan response dari server
    it('GET API Login Test', async () => {
        const response = await fetch("https://belajar-bareng.onrender.com/", {
            method: 'GET',
        });
        expect(response.status).to.equal(200);
    })

    // Valid login test
    it("POST API Login Test", async () => {
        const response = await fetch("https://belajar-bareng.onrender.com/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // tipe data yang dikirim ke server
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin'
            })
        })
        expect(response.status).to.equal(200);

        const data = await response.json(); // response dari server di ubah menjadi format json

        expect(data).to.have.property('token'); // mengecek apakah response memiliki properti token
        
        expect(data.token).not.to.be.empty; // mengecek apakah token tidak kosong
        
        expect(data.message).to.equal('Login successful'); // mengecek apakah message sesuai dengan yang diharapkan
        
        token = data.token; // menyimpan token dari response ke variabel token
        console.log(token);
    })

    // Invalid login test
    it('Invalid POST Login Test', async () => {
        const response = await fetch("https://belajar-bareng.onrender.com/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'Admin',
                password: 'admin123'
            })
        });
        expect(response.status).to.equal(401); //401 terjadi keran unauthorized atau gagal login

        const data1 = await response.json();

        expect(data1.message).to.equal('Invalid username or password!');
    })

    //Menambahkan User baru
    it('POST Add User Test', async () => {
        const response = await fetch("https://belajar-bareng.onrender.com/api/add-user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // mengirim token yang berada di let token
        },
        body: JSON.stringify({
            username: 'testuser',
            age: 27,
        })
    })

    expect(response.status).to.equal(201); //201 karena berhasil membuat data baru

    const dataIni = await response.json();
    
    expect(dataIni.message).to.equal('User successfully added, Hi testuser!');

    expect(dataIni).to.have.property('userId');

    expect(dataIni).to.have.property('username', 'testuser');

    })

    //Invalid menambahkan User baru
    it('Invalid POST Add User Test', async () => {
        const response = await fetch("https://belajar-bareng.onrender.com/api/add-user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                username: "mahera",
                age: 22,
            })
        })
        expect(response.status).to.equal(400); //400 karena ada kesalahan pada request yang dikirimkan

        const dataSalah = await response.json();

        expect(dataSalah.message).to.equal('Username "mahera" already exists!');

        expect(dataSalah).to.not.have.property('useId');

        expect(dataSalah).to.not.have.property('username');
    })
    
    // Mengakses user list dengan token yang didapatkan dari login
    it('GET User List Test', async () => {
        const response = await fetch("https://belajar-bareng.onrender.com/api/users", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        expect(response.status).to.equal(200);

        const data2 = await response.json();
        console.log(data2);
    })

})