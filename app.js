const express = require('express');
const app = express();
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (Presentation Tier)
app.use(express.static(path.join(__dirname, 'public')));

// Routing API (Application Tier)
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/loans', loanRoutes);
app.use('/reports', reportRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/auth/login.html'));
});

app.listen(3000, () => console.log('Server running: http://localhost:3000'));