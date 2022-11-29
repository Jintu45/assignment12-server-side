const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json()) 

const category = require('./category.json')
const product = require('./product.json')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.t6zznhm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const categoriesCollection = client.db('assignment12').collection('category')
        const productsCollection = client.db('assignment12').collection('products')
        const buyerBookingsCollection = client.db('assignment12').collection('bookings')

        app.get('/categories', async(req, res) => {
            const query = {}
            const cursor = categoriesCollection.find(query)
            const category = await cursor.toArray()
            res.send(category)
        })

        app.get('/categories/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {category_id:id}
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })

        // post bookings buyer booking data in db

        app.post('/bookings', async(req,res)=>{
            const buyerBooking = req.body
            console.log(buyerBooking);
            const result = await buyerBookingsCollection.insertOne(buyerBooking)
            res.send(result)
        })

        app.post('/addProduct', async(req,res)=>{
            const product = req.body
            console.log(product);
            const result = await productsCollection.insertOne(product)
            res.send(result)
        })

        //get bookings buyer bookin data from mongodb
        // app.get('/bookings', async (req,res)=>{
        //     const email = req.query.email;
        //     const query = {email: email}
        //     const cursor = await buyerBookingsCollection.find(query).toArray()
        //     res.send(cursor)
        // })
    
        app.get('/bookings', async(req, res) => {
            const email = req.query.email;
            const query = {email: email}
            const bookings = await buyerBookingsCollection.find(query).toArray()
            res.send(bookings)
        })

        app.post('/bookings', async(req, res) => {
            const booking = req.body;
            console.log(booking)
            const query = {}
            const alreadyBooked = await buyerBookingsCollection.find(query).toArray()
            console.log(alreadyBooked)
            if(alreadyBooked.length){
                const message = `you have a booking ${booking.appointmentDate}`
                return res.send({acknowledge: false, message})
            }
            const result = await buyerBookingsCollection.insertOne(booking)
            res.send(result)
        })

        // app.delete('/bookings/:id', async(req, res)=>{
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)}
        //     const result = await buyerBookingsCollection.deleteOne(query)
        //     res.send(result)
        // })

        app.get('/reviews', async(req, res) => {
            console.log(req.query.email)

            let query = {}
            if(req.query.email){
                query={
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })

        app.post('/reviews', async(req, res) => {
            const order = req.body;
            const result = await reviewCollection.insertOne(order);
            res.send(result)
        })

        app.delete('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })
   
    }
    finally{}
}
run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`assignment11 server is running ${port}`)
})

