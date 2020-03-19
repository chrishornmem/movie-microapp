require('dotenv').config()
const express = require('express')
const api = require('./app_api/routes')
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(__dirname + '/public'));
app.use('/api', api)

app.get('/', function (req, res) {
    res.sendFile('/public/index.html', { root: __dirname })
})

app.get('*', function (req, res) {
    res.sendFile('/public/index.html', { root: __dirname })
})

app.get('/*', function (req, res) {
    res.sendFile('/public/index.html', { root: __dirname })
})

app.listen(PORT, () => console.log(`Example micro-app listening on port ${PORT}`))

