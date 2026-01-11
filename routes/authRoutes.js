const express = require('express');
const router = express.Router();
const db = require('../config/db');
const crypto = require('crypto');

// --- LOGIN: Cek apakah butuh verifikasi atau langsung dashboard ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        
        if (users.length > 0) {
            const user = users[0];
            let redirectTarget = '';

            if (user.role === 'Admin') {
                redirectTarget = '/admin/dashboard.html';
            } else {
                // JIKA api_key NULL/KOSONG = Anggota Baru -> Ke halaman Verifikasi
                // JIKA api_key ADA = Anggota Lama -> Langsung ke Dashboard
                redirectTarget = !user.api_key ? '/auth/verify-key.html' : '/anggota/dashboard.html';
            }
            
            res.json({ 
                message: "Login Berhasil", 
                redirect: redirectTarget, 
                user: { 
                    id: user.id, 
                    nama: user.nama, 
                    role: user.role,
                    apiKey: user.api_key // Akan bernilai null untuk anggota baru
                } 
            });
        } else {
            res.status(401).json({ message: "Email atau Password salah" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// --- REGISTER: Pastikan tidak ada kolom yang terlewat ---
router.post('/register', async (req, res) => {
    const { nama, email, password } = req.body;
    try {
        // Secara default api_key akan NULL di database saat pertama daftar
        await db.query(
            'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, "Anggota")', 
            [nama, email, password]
        );
        res.status(201).json({ message: "Registrasi Berhasil" });
    } catch (err) {
        console.error("Register Error:", err); // Cek error spesifik di terminal
        res.status(500).json({ message: "Email sudah terdaftar atau terjadi error server" });
    }
});

// --- UPDATE KEY: Digunakan satu kali oleh anggota baru di verify-key.html ---
router.post('/update-key', async (req, res) => {
    const { userId, apiKey } = req.body;
    try {
        await db.query('UPDATE users SET api_key = ? WHERE id = ?', [apiKey, userId]);
        res.json({ message: "API Key permanen tersimpan" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menyimpan key" });
    }
});

// --- AMBIL SEMUA USER (Hanya untuk Admin) ---
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, nama, email, role, api_key FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil daftar user" });
    }
});

// --- UPDATE ROLE USER ---
router.put('/users/role/:id', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        res.json({ message: "Role berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update role" });
    }
});

// --- HAPUS USER ---
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: "User berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menghapus user" });
    }
});

module.exports = router;