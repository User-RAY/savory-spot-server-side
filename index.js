const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middelware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8wb3n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const database = client.db("SavorySpotDB");

    const menuCollection = database.collection("menu");
    const reviewCollection = database.collection("reviews");    
    const cartCollection = database.collection("carts"); 


    app.get('/menu', async(req, res) => {
        const result = await menuCollection.find().toArray();
        res.send(result);

    })

    app.get('/review', async(req, res) => {
    const result = await reviewCollection.find().toArray();
    res.send(result);
    })


    app.get('/cart', async(req, res) => {
      const email = req.query.email;
      const query = {email: email}
      const result = await cartCollection.find(query).toArray()
      res.send(result);
    })



    //POST

    app.post('/cart', async(req, res) => {
      const item = req.body;

      const updateCart = await cartCollection.insertOne(item);

      res.send(updateCart);

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Kitchen is busy')
})

app.listen(port, ()=>{
    console.log(`Kitchen is at ${port}`);
    
})