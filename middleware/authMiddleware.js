const db = require('../config/db');

const verifyApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Mengambil key dari header

    if (!apiKey) {
        return res.status(403).json({ message: "Akses ditolak. API Key tidak ada." });
    }

    try {
        const [user] = await db.query('SELECT * FROM users WHERE api_key = ?', [apiKey]);
        if (user.length > 0) {
            req.user = user[0]; // Simpan data user ke request
            next(); // Lanjut ke fungsi berikutnya
        } else {
            res.status(403).json({ message: "API Key tidak valid." });
        }
    } catch (err) {
        res.status(500).json({ message: "Kesalahan Verifikasi." });
    }
};

module.exports = verifyApiKey;