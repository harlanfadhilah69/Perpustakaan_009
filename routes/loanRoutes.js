const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /loans - Proses Peminjaman Buku
router.post('/', async (req, res) => {
    const { user_id, book_id } = req.body;

    try {
        // 1. Cek ketersediaan stok buku
        const [book] = await db.query('SELECT stok FROM books WHERE id = ?', [book_id]);
        
        if (book.length === 0) {
            return res.status(404).json({ message: "Buku tidak ditemukan" });
        }

        if (book[0].stok <= 0) {
            return res.status(400).json({ message: "Stok buku habis!" });
        }

        // 2. Mulai transaksi peminjaman
        // Tambah data ke tabel loans
        await db.query(
            'INSERT INTO loans (user_id, book_id, status, tanggal_pinjam) VALUES (?, ?, "Dipinjam", NOW())', 
            [user_id, book_id]
        );

        // 3. Kurangi stok buku di tabel books
        await db.query('UPDATE books SET stok = stok - 1 WHERE id = ?', [book_id]);

        res.json({ message: "Buku berhasil dipinjam!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal memproses peminjaman di server" });
    }
});

// POST /loans/:id/return - Proses Verifikasi Pengembalian
router.post('/:id/return', async (req, res) => {
    const loanId = req.params.id;

    try {
        // 1. Cari data peminjaman yang berstatus 'Dipinjam'
        const [loan] = await db.query('SELECT book_id FROM loans WHERE id = ? AND status = "Dipinjam"', [loanId]);
        
        if (loan.length === 0) {
            return res.status(404).json({ message: "Data peminjaman tidak ditemukan atau sudah dikembalikan" });
        }

        const bookId = loan[0].book_id;

        // 2. Update status peminjaman menjadi 'Dikembalikan'
        await db.query(
            'UPDATE loans SET status = "Dikembalikan", tanggal_kembali = NOW() WHERE id = ?', 
            [loanId]
        );

        // 3. Tambah kembali stok buku di tabel books
        await db.query('UPDATE books SET stok = stok + 1 WHERE id = ?', [bookId]);

        res.json({ message: "Buku berhasil dikembalikan!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal memproses pengembalian di server" });
    }
});

module.exports = router;