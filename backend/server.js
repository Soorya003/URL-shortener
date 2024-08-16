const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

mongoose.connect('mongodb+srv://guvi:guvi@guvi.qgrirnt.mongodb.net/', {

}).then(() => console.log('Database connected'));

app.listen(3000, () => console.log('Server running on port 3000'));
