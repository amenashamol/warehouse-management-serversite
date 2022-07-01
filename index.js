const express = require('express')
const cors=require('cors')
const { MongoClient, ServerApiVersion,  ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port=process.env.PORT || 5000



//middlewire
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dn5yr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
       
        await client.connect()
            const fruitCollection=client.db('fruits-wirehouse').collection('fruits')
            
        //get api to read limit inventory 
        app.get('/inventory',async(req,res)=>{
            const query={}
            const  cursor= fruitCollection.find(query).limit(6)
            const inventories= await cursor.toArray()
           res.send(inventories) 
        })
        
        //get api to read all inventory 
        app.get('/allinventory',async(req,res)=>{
            const query={}
            const  cursor= fruitCollection.find(query)
            const inventories= await cursor.toArray()
           res.send(inventories) 
        })
        
        
        //create inventory item

        app.post('/inventory',async(req,res)=>{
            const data =req.body
            const result=await fruitCollection.insertOne(data)
            res.send(result)

        })


        //udate inventory

        app.get('/inventory/:id',async(req,res)=>{
            const id=req.params.id 
            const query={_id:ObjectId(id)}
            const result=await fruitCollection.findOne(query)
           res.send(result) 
        })

        // app.put('/inventory/:id', async(req,res)=>{
        //     const id=req.params.id 
        //     const data=req.body
        //     const filter ={_id:ObjectId(id)}
        //     const options={upsert:true}

        //     const updateDoc={
        //         $set:data,
        //     }

        //     const result=await fruitCollection.updateOne(filter,updateDoc,options)
        //     res.send(result)
        // })

        //delete item

      app.delete('/allinventory/:id',async(req,res)=>{
        const id=req.params.id 
        const filter ={_id:ObjectId(id)}
        const result=await fruitCollection.deleteOne(filter)
        res.send(result)
        


      })  

        
     }
 
     finally{
 
     }
 
}

run().catch(console.dir)


app.get('/', function (req, res) {
    res.send(' hello hello fruits -wire')
  })
  

app.listen(port,()=>{ 
    console.log('listening',port)
})