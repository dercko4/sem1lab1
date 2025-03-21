const crypto = require('crypto')

async function generateETag(data) {
    return await crypto.createHash('md5').update(data).digest('hex');
}

module.exports = function (req, res, next) {
    const originalSend = res.send
    res.send = async function (body) {
        const generatedEtag = await generateETag(body);
        const lastModified = new Date().toUTCString();
        res.set('ETag', generatedEtag);
        res.set('Cache-Control', 'public, max-age=86400');
        if (req.headers['if-none-match'] === generatedEtag || req.headers['if-modified-since'] === lastModified) {
            return res.status(304).end();
        }
        originalSend.call(this, body);
    }
    next()

};