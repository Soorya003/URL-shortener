const express = require('express');
const Url = require('../models/Url');
const shortid = require('shortid');
const router = express.Router();

router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortUrl = shortid.generate();
    const url = new Url({ originalUrl, shortUrl });
    await url.save();
    res.json({ shortUrl: `http://localhost:3000/${shortUrl}` });
});

router.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    if (!url) return res.status(404).send('URL not found');
    url.clicks += 1;
    await url.save();
    res.redirect(url.originalUrl);
});

router.get('/analytics', async (req, res) => {
    const { period } = req.query;
    const now = new Date();
    let startDate;
    if (period === 'daily') {
        startDate = new Date(now.setDate(now.getDate() - 1));
    } else if (period === 'monthly') {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    const urls = await Url.find({ createdAt: { $gte: startDate } });
    res.json(urls);
});

module.exports = router;
