
const express = require("express");
require('dotenv').config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('DB connected')
})


// verify token 
async function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).send({ messages: 'UnAuthorization' });
  }
  const token = auth.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ messages: 'Forbidden access' })
    }
    req.decoded = decoded;
    next()
  })

}


// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqf9l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const ListCollection = client.db('taskList').collection('list');
    app.post('/task',async(req,res)=>{
      const listData = req.body;
      const result = await ListCollection.insertOne(listData);
      res.send(result);
    })
    app.get('/task/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email:email};
      const result = await ListCollection.find(query).toArray();
      res.send(result);
    })
    app.get('/incomplete-task/:email',async(req,res)=>{
      const email = req.params.email;
        const query = {status:'incomplete', email:email};
        const result = await ListCollection.find(query).toArray();
        res.send(result);
    })
    app.get('/completed-task/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {status:'completed', email:email};
      const result = await ListCollection.find(query).toArray();
      res.send(result);
    })
    // for update
    app.put('/manage-task/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id : ObjectId(id) };
      const option = { upsert: true };
      const updateDos = {
        $set: {status:'completed'},
      }
      const result = await ListCollection.updateOne(filter, updateDos, option);
      res.send(result);
    })

    // 
    // for update
    app.get('/update-task/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id : ObjectId(id) };
      const result = await ListCollection.find(filter).toArray();
      res.send(result);
    })
    // for update
    // app.put('/update-task/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id : ObjectId(id) };
    //   const option = { upsert: true };
    //   const updateDos = {
    //     $set: {status:'completed'},
    //   }
    //   const result = await ListCollection.updateOne(filter, updateDos, option);
    //   res.send(result);
    // })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`localhost ${port}`) 
})