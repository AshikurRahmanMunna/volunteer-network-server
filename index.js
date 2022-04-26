const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
// root get
app.get('/', (req, res) => {
    res.send('This is volunteer network server');
})

// Connect To DataBase
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.db_pass}@cluster0.dy4qi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        client.connect();
        const serviceCollection = client.db('volunteerNetwork').collection('service');
        const volunteerCollection = client.db('volunteerNetwork').collection('volunteer');
        console.log('Database connected');

        // get all users
        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // post a user
        app.post('/service', async(req, res) => {
            const user = req.body;
            const result = await serviceCollection.insertOne(user);
            res.send(result);
        })

        // get all volunteers
        app.get('/volunteers', async(req, res) => {
            const cursor = volunteerCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/volunteer', async(req, res) => {
            const volunteer = req.body;
            const result = await volunteerCollection.insertOne(volunteer);
            res.send(result);
        })

        // get services by volunteer
        app.get('/servicesByVolunteer', async(req, res) => {
            const email = req.query.email;
            const cursor = serviceCollection.find({email: email});
            const result = await cursor.toArray();
            res.send(result);
        })
    }
    finally {
        
    }
}
run().catch(console.dir);


// listening the app
app.listen(port, (req, res) => {
    console.log(`Server is running in Port: ${port}`);
})