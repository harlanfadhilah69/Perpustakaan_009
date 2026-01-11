// public/js/loans.js

// 1. Fungsi untuk Anggota meminjam buku
async function pinjamBuku(bookId) {
    // Ambil data user dari localStorage
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
        alert("Sesi habis, silakan login kembali.");
        window.location.href = '/auth/login.html';
        return;
    }

    if (!confirm('Apakah Anda yakin ingin meminjam buku ini?')) return;

    try {
        const response = await fetch('/loans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userData.id,
                book_id: bookId
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Buku berhasil dipinjam!');
            // Refresh katalog buku jika fungsi loadBooks tersedia
            if (typeof loadBooks === 'function') loadBooks();
        } else {
            alert(result.message || 'Gagal meminjam buku.');
        }
    } catch (err) {
        console.error('Error saat meminjam:', err);
        alert('Terjadi kesalahan pada sistem.');
    }
}

// 2. Fungsi untuk Admin memverifikasi pengembalian (Laporan)
async function verifikasiKembali(loanId) {
    if (!confirm('Verifikasi bahwa buku telah dikembalikan?')) return;

    try {
        const response = await fetch(`/loans/${loanId}/return`, {
            method: 'POST'
        });

        if (response.ok) {
            alert('Pengembalian berhasil diverifikasi.');
            // Refresh tabel laporan jika fungsi loadLaporan tersedia
            if (typeof loadLaporan === 'function') loadLaporan();
        } else {
            const result = await response.json();
            alert(result.message || 'Gagal verifikasi.');
        }
    } catch (err) {
        console.error('Error saat verifikasi:', err);
        alert('Gagal menghubungi server.');
    }
}