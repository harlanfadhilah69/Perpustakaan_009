const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyApiKey = require('../middleware/authMiddleware'); // Mengimpor pengaman API Key

// --- 1. AMBIL SEMUA BUKU (DILINDUNGI API KEY) ---
// Hanya user dengan API Key valid yang bisa melihat daftar buku
router.get('/', verifyApiKey, async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM books');
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data buku" });
    }
});

// --- 2. TAMBAH BUKU BARU ---
router.post('/', async (req, res) => {
    const { judul, penulis, stok } = req.body;
    try {
        await db.query('INSERT INTO books (judul, penulis, stok) VALUES (?, ?, ?)', [judul, penulis, stok]);
        res.json({ message: "Buku berhasil ditambah" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menambah buku" });
    }
});

router.put('/:id', verifyApiKey, async (req, res) => {
    const { judul, penulis, stok } = req.body;
    try {
        await db.query(
            'UPDATE books SET judul = ?, penulis = ?, stok = ? WHERE id = ?',
            [judul, penulis, stok, req.params.id]
        );
        res.json({ message: "Buku berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ message: "Gagal memperbarui buku" });
    }
});

// --- 3. HAPUS BUKU ---
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);
        res.json({ message: "Buku dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menghapus buku" });
    }
});

module.exports = router;