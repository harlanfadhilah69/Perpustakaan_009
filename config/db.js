const mysql = require('mysql2');

// Membuat koneksi ke database MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'harlan$12', 
    database: 'perpustakaan_009',
    port: 3308, // <--- TAMBAHKAN INI
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Koneksi database GAGAL:', err.message);
    } else {
        console.log('✅ Koneksi ke MySQL Berhasil di Port 3308!');
        connection.release();
    }
});

module.exports = db;