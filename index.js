const express = require('express');
const axios = require('axios');
const app = express();

app.get('/proxy', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        if (!targetUrl) return res.status(400).send("No URL provided");
        
        const response = await axios({
            method: 'get',
            url: targetUrl,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            responseType: 'stream',
            validateStatus: () => true // FORWARDS ERRORS INSTEAD OF CRASHING
        });
        
        res.setHeader('Content-Type', response.headers['content-type'] || 'text/csv');
        res.status(response.status);
        response.data.pipe(res);
    } catch (e) {
        console.error(e);
        res.status(500).send("Proxy error");
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy running'));
