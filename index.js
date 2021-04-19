const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const admin = require('firebase-admin')



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7q9be.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const app = express()

// app.use(express.json())
app.use(bodyParser.json())
// app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())

const port = 5000;

app.get('/', (req, res) => {
  res.send("hello from db it's working working")
})


// var admin = require("firebase-admin");

var serviceAccount = require("./spotless-b33cd-firebase-adminsdk-eazf7-2b4c4fe0b1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("spotless").collection("appointments");
  const commentCollection = client.db("spotless").collection("comments");
  const servicesCollection = client.db("spotless").collection("services");
  const adminCollection = client.db("spotless").collection("admins");


  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    console.log(appointment)
    appointmentCollection.insertOne(appointment)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/userAppointments', (req, res) => {
    //   const loggedInUser = req.body;
    console.log(req.query.email)
    //   appointmentCollection.find({})
    appointmentCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        console.log(documents)
        res.send(documents);
      })
  })
  app.get('/allTheOrders',(req, res)=>{
    appointmentCollection.find({})
    .toArray((err,orderDocuments) =>{
      console.log('orderDocuments', orderDocuments)
      res.send(orderDocuments);
    })
  })

  

  app.post('/addComment',(req, res)=>{
    

    const comment = req.body;
    commentCollection.insertOne(comment)
    .then(result =>{
      res.send(result.insertOne(comment))
    })

  })
  app.get('/userComments', (req,res) =>{
    commentCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.post('/addServices',(req, res)=>{
    

    const comment = req.body;
    servicesCollection.insertOne(comment)
    .then(result =>{
      res.send(result.insertOne(comment))
    })

  })
  app.get('/userServices', (req,res) =>{
    servicesCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.post('/addAdmin',(req, res)=>{
    const comment = req.body;
    adminCollection.insertOne(comment)
    .then(result =>{
      res.send(result.insertOne(comment))
    })

  })
  app.get('/userAdmin', (req,res) =>{
    adminCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.post('/isAdmin', (req,res) => {
    const email =req.body.email;
    adminCollection.find({email: email})
    .toArray((err,admins)=>{
      res.send(admins.length > 0)
    })
  })

});

app.listen(process.env.PORT || port)