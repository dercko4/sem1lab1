const express = require("express")
require("dotenv").config()
const sequelize = require("./database")
const models = require('./models/model')
const cors = require('cors')
const routes_createDB = require('./routes/createDB/index')
const crypto = require('crypto');

const http = require('http')
const HOST = process.env.HOST
const PORT = process.env.PORT
const app = express()
const server = http.createServer(app)



app.use(cors())
app.use(express.json())

async function generateETag(data) {
    return await crypto.createHash('md5').update(data).digest('hex');
}


app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = async function (body) {
        const generatedEtag = await generateETag(body);
        console.log(generatedEtag)
        const lastModified = new Date().toUTCString();
        res.setHeader('ETag', generatedEtag);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        if (req.headers['if-none-match'] === generatedEtag || req.headers['if-modified-since'] === lastModified) {
            return res.status(304).end();
        }
        originalSend.call(this, body);
    }
    next()
});



app.use(routes_createDB)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, HOST, () => console.log(`Server start on ${HOST}:${PORT}`))
    }
    catch (e) {
        console.log(e)
    }
}

start()