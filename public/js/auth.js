// Menangani event saat form disubmit
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LOGIKA LOGIN ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    // Simpan data user ke localStorage agar bisa diakses di halaman dashboard
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Arahkan ke dashboard sesuai data dari server (Admin/Anggota)
                    window.location.href = data.redirect; 
                } else {
                    alert(data.message || 'Login gagal, periksa email dan password.');
                }
            } catch (err) {
                console.error('Error saat login:', err);
                alert('Terjadi kesalahan pada server.');
            }
        });
    }

    // --- LOGIKA REGISTRASI ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nama = document.getElementById('nama').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nama, email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    alert('Registrasi Berhasil! Silakan Login.');
                    window.location.href = '/auth/login.html';
                } else {
                    alert(data.message || 'Registrasi gagal.');
                }
            } catch (err) {
                console.error('Error saat registrasi:', err);
                alert('Terjadi kesalahan pada server.');
            }
        });
    }
});

// Fungsi Logout (Bisa dipanggil dari tombol logout di dashboard)
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/auth/login.html';
}