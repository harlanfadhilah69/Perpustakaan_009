async function loadReports() {
    // Ambil data user dari localStorage untuk mendapatkan API Key
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
        const res = await fetch('/reports/api/daily', {
            headers: { 'x-api-key': user ? user.apiKey : '' }
        });
        
        const data = await res.json();
        const tbody = document.querySelector('#reportTable tbody');
        
        // Pastikan nama properti (id, nama_peminjam, judul_buku) sesuai dengan hasil query SQL Anda
        tbody.innerHTML = data.map(row => `
            <tr>
                <td>#${row.id}</td>
                <td><strong>${row.nama_peminjam || 'Tanpa Nama'}</strong></td> 
                <td>${row.judul_buku || 'Buku Tidak Diketahui'}</td>
                <td>
                    <span class="status-pill ${row.status === 'Dipinjam' ? 'status-dipinjam' : 'status-kembali'}">
                        ${row.status}
                    </span>
                </td>
                <td>
                    ${row.status === 'Dipinjam' ? 
                    `<button onclick="verifikasiKembali(${row.id})" class="btn-verify">Verifikasi Kembali</button>` : 
                    '<span style="color:#10b981; font-weight:bold;">Selesai</span>'}
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Gagal memuat laporan:", err);
    }
}

// Fungsi untuk proses pengembalian buku
async function verifikasiKembali(id) {
    if(!confirm("Verifikasi pengembalian buku ini?")) return;
    
    const user = JSON.parse(localStorage.getItem('user'));
    try {
        const res = await fetch(`/loans/return/${id}`, {
            method: 'POST',
            headers: { 'x-api-key': user ? user.apiKey : '' }
        });
        
        if (res.ok) {
            alert("Buku berhasil dikembalikan!");
            loadReports(); // Refresh tabel
        }
    } catch (err) {
        alert("Gagal memproses pengembalian.");
    }
}

// Jalankan fungsi saat halaman dimuat
loadReports();