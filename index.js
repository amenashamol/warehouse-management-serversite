const express = require('express')
const cors=require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port=4000



//middlewire
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dn5yr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
       
        await client.connect()
            const fruitCollection=client.db('fruits-wirehouse').collection('fruits')
            
        //get api to read all inventory 
        app.get('/inventories',async(req,res)=>{
         const  cursor= fruitCollection.find({})
           const inventory= await cursor.toArray()
           res.send(result) 
        }) 
        
        
        //create inventory

        app.post('/inventory',async(req,res)=>{
            const data =req.body
            const result=await fruitCollection.insertOne()
            res.send(result)

        })

        
     }
 
     finally{
 
     }
 
}

run().catch(console.dir)


app.get('/', function (req, res) {
    res.send('Hello fruits -wire')
  })
  

app.listen(port,()=>{
    console.log('listening',port)
})