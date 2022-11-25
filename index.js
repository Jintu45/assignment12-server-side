const express = require('express')
const cors = require('cors')
const app = express()

const port = process.env.PORT || 5000;

require('dotenv').config()

app.use(cors())
app.use(express.json()) 

const category = require('./category.json')
const product = require('./product.json')

app.get('/', (req, res) => {
    res.send('server is running')
})

app.get('/category', (req, res) => {
    res.send(category)
})


app.listen(port, () => {
    console.log(`assignment11 server is running ${port}`)
})

