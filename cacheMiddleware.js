const crypto = require('crypto')

async function generateETag(data) {
    return await crypto.createHash('md5').update(data).digest('hex');
}

module.exports = function (req, res, next) {
    const originalSend = res.send
    res.send = async function (body) {
        const generatedEtag = await generateETag(body);
        const updatedDate = JSON.parse(body).updatedAt.split("-")
        const updatedDateYear = Number(updatedDate[0])
        const updateDateMonth = Number(updatedDate[1]) - 1
        const middleTime = updatedDate[2].split("T")
        const updateDateDay = Number(middleTime[0])
        const time = middleTime[1].split(":")
        const timeHour = Number(time[0])
        const timeMinute = Number(time[1])
        const timeSecond = Number(time[2].split(".")[0])
        const timeMSecond = Number(time[2].split(".")[1].split("Z")[0])
        const lastModified = new Date(updatedDateYear, updateDateMonth, updateDateDay, timeHour, timeMinute, timeSecond, timeMSecond).toUTCString();
        console.log(lastModified)
        res.set('ETag', generatedEtag);
        res.set('Cache-Control', 'public, max-age=86400');
        if (req.headers['if-none-match'] === generatedEtag || req.headers['if-modified-since'] === lastModified) {
            return res.status(304);
        }
        originalSend.call(this, body);
    }
    next()
};