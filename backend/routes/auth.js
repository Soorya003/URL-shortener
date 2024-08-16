const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

router.post('/register', async (req, res) => {
    const { username, firstName, lastName, password } = req.body;
    const user = new User({ username, firstName, lastName, password });
    await user.save();
    const activationLink = `http://localhost:3000/activate/${user._id}`;
    await transporter.sendMail({
        to: username,
        subject: 'Activate your account',
        text: `Click here to activate your account: ${activationLink}`
    });
    res.status(201).send('Registration successful. Please check your email to activate your account.');
});

router.post('/activate/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send('Invalid activation link');
    user.isActive = true;
    await user.save();
    res.send('Account activated successfully. You can now log in.');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await user.comparePassword(password)) return res.status(400).send('Invalid credentials');
    if (!user.isActive) return res.status(403).send('Account not activated');
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

router.post('/forgot-password', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Email not found');
    const resetToken = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
        to: username,
        subject: 'Password Reset',
        text: `Click here to reset your password: ${resetLink}`
    });
    res.send('Password reset email sent');
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findById(decoded.id);
        if (!user) return res.status(400).send('Invalid token');
        user.password = password;
        await user.save();
        res.send('Password updated successfully');
    } catch (err) {
        res.status(400).send('Invalid or expired token');
    }
});

module.exports = router;
