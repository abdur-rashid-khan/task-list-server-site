
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
    app.get('/task',async(req,res)=>{
      const query = {};
      const result = await ListCollection.find(query).toArray();
      res.send(result);
    })
    app.get('/incomplete-task',async(req,res)=>{
      const query = {status:'incomplete'};
      const result = await ListCollection.find(query).toArray();
      res.send(result);
    })
    app.get('/completed-task',async(req,res)=>{
      const query = {status:'completed'};
      const result = await ListCollection.find(query).toArray();
      res.send(result);
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`localhost ${port}`) 
})