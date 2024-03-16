const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//midleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://taskCollection:mnRs3xjflIElll6F@cluster0.flztkm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
      // Send a ping to confirm a successful connection

      const database  = client.db("task")
      const taskCollection = database.collection("taskCollection")
              
  
      app.get('/task' ,async(req,res)=>{
        let query ={}
        if(req.query.priority){
          query.priority = req.query.priority
        }
        const result = await taskCollection.find(query).toArray()
         res.send({status:true , data:result})
      })


      app.post('/task' , async(req,res)=>{
        
        const task = req.body 
        const result = await taskCollection.insertOne(task)
        res.send(result)

      })

      app.put('/task/:id', async(req,res)=>{
          const id = req.params.id
          const task = req.body 
          const filter = { _id: new ObjectId(id) }
          const updateDoc = {
            $set:{
              isCompleted:task.isCompleted ,
              title :task.title ,
              description:task.description ,
              priority:task.priority 

            }
          };
          const options = {upsert:true}
          const result = await taskCollection.updateOne(filter ,updateDoc ,options)
            res.json(result)
      })
  
  
   
       
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);



  app.get('/' , (req,res)=>{
    res.send('task server sunning')
 })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// taskCollection
// mnRs3xjflIElll6F