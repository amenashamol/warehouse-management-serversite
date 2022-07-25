const express = require('express')
const cors=require('cors')
const { MongoClient, ServerApiVersion,  ObjectId } = require('mongodb');
const jwt=require('jsonwebtoken')
require('dotenv').config()
const app = express()
const port=process.env.PORT || 5000



//middlewire
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dn5yr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
  
    const authHeader = req.headers['authorization'];
    const token =  authHeader && authHeader.split(' ')[1];
   
    if (!token) {
      return res.status(401).json({ message: 'UnAuthorized access' });
   }
   
    
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decodeduser)=> {
      if (err) {
        return res.status(403).send({ message: 'Forbidden access' })
      }
      
      req.decodeduser = decodeduser;
      
      
      next()
     })
    }  
async function run(){
    try{
       
             await client.connect()
            const fruitCollection=client.db('fruits-wirehouse').collection('fruits')


            app.post('/login',async(req,res)=>{
               
                const user=req.body
               
                const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
                
               res.send({token}) 
            })     
            
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
      
      
      // get my item
     

    app.get('/myItem',async(req,res)=>{
      const email=req.query.email 
      const query={email:email}
      const result=await fruitCollection.find(query).toArray()
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