const express = require("express");
const app = express();
var cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h0tfluz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("dbconnected");

    const studentCollection = client.db("dbProjmantech").collection("students");

    // GET

    app.get("/student", async (req, res) => {
      const query = {};
      const cursor = studentCollection.find(query);
      const students = await cursor.toArray(cursor);
      res.send(students);
    });


    app.get('/stutent/:id', async (req, res) =>{
        const id = req.params.id;
        const query= {_id: ObjectId(id)}
        const student= await studentCollection.findOne(query);
        res.send(student)

    })


    // POST

    app.post('/student', async (req, res) =>{
      const newStudent= req.body;
      const result = await studentCollection.insertOne(newStudent);
      res.send(result)
    })

    // DELETE

    app.delete('/student/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await studentCollection.deleteOne(query)
      res.send(result)
    });



  } 
  
  finally {

  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Crud is running", port);
})
