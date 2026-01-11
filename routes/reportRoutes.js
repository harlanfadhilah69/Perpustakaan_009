const express = require('express'); // TAMBAHKAN INI
const router = express.Router();    // TAMBAHKAN INI
const db = require('../config/db');

router.get('/api/daily', async (req, res) => {
    // Gunakan query dengan Alias (AS) agar sinkron dengan reports.js
    const query = `
        SELECT 
            loans.id, 
            users.nama AS nama_peminjam, 
            books.judul AS judul_buku, 
            loans.status 
        FROM loans 
        JOIN users ON loans.user_id = users.id 
        JOIN books ON loans.book_id = books.id 
        WHERE DATE(loans.tanggal_pinjam) = CURDATE()`;
    
    try {
        const [reports] = await db.query(query);
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil laporan" });
    }
});

module.exports = router;