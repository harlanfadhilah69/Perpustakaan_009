// 1. Fungsi memuat katalog buku dengan Verifikasi API Key
async function loadBooks() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Mengirimkan x-api-key di dalam headers
        const res = await fetch('/books', {
            method: 'GET',
            headers: {
                'x-api-key': user ? user.apiKey : '' 
            }
        });

        // Jika API Key salah atau tidak ada, tendang ke halaman login
        if (res.status === 403) {
            alert("Sesi tidak sah atau API Key hilang, silakan login ulang.");
            localStorage.clear();
            window.location.href = '/auth/login.html';
            return;
        }

        const books = await res.json();
        const tbody = document.querySelector('#bookTable tbody');
        
        if (books.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Tidak ada koleksi buku saat ini.</td></tr>';
            return;
        }

        tbody.innerHTML = books.map(book => `
            <tr>
                <td>${book.judul}</td>
                <td>${book.penulis}</td>
                <td>${book.stok} unit</td>
                <td>
                    <button class="primary" onclick="pinjamBuku(${book.id})" ${book.stok <= 0 ? 'disabled' : ''}>
                        ${book.stok <= 0 ? 'Habis' : 'Pinjam Buku'}
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Gagal memuat buku:", err);
    }
}

// 2. Fungsi memuat daftar pinjaman aktif milik user
async function loadMyLoans() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        // Kita juga bisa menambahkan API Key di sini jika route report diproteksi
        const res = await fetch('/reports/api/daily'); 
        const allReports = await res.json();
        
        const myLoans = allReports.filter(loan => loan.nama === user.nama && loan.status === 'Dipinjam');
        
        const tbody = document.querySelector('#loanTable tbody');
        if (!tbody) return;

        if (myLoans.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Anda tidak memiliki pinjaman aktif.</td></tr>';
            return;
        }

        tbody.innerHTML = myLoans.map(loan => `
            <tr>
                <td>${loan.judul}</td>
                <td>${new Date().toLocaleDateString()}</td>
                <td><b style="color:orange">${loan.status}</b></td>
                <td>
                    <button class="warning" onclick="prosesKembali(${loan.id})">Kembalikan</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Gagal memuat data pinjaman:", err);
    }
}

// 3. Fungsi memproses pengembalian buku
async function prosesKembali(loanId) {
    if (!confirm('Apakah Anda ingin mengembalikan buku ini?')) return;

    try {
        const res = await fetch(`/loans/${loanId}/return`, { method: 'POST' });
        
        if (res.ok) {
            alert('Terima kasih! Buku berhasil dikembalikan.');
            loadBooks();    
            loadMyLoans();  
        } else {
            alert('Gagal mengembalikan buku.');
        }
    } catch (err) {
        console.error("Error saat mengembalikan:", err);
    }
}

// 4. Inisialisasi Nama User & Jalankan Fungsi
const user = JSON.parse(localStorage.getItem('user'));
if(user && document.getElementById('user-info')) {
    document.getElementById('user-info').innerText = `Selamat Datang, ${user.nama}`;
}

loadBooks();
loadMyLoans();