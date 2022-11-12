const http = require('http');
const express = require('express');
var bodyParser=require("body-parser");
const mongoose = require('mongoose');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// Node Port connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is Running...${PORT}`))

//mongoose DB connection
mongoose.connect('mongodb://localhost:27017/quizapp');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})


//request body 
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));


// Create User
app.post('/sign_up',async function(req,res){
      const data = {
            name : req.body.name,
            email : req.body.email,
            phone_number : req.body.phone
            }

            const findUser = await db.collection('user').findOne({email : data.email,phone_number : data.phone_number}).catch(err=>{
                  console.log(err);
                  return false;
            })

            if(findUser !== false && findUser === null){

                  const createUser = await db.collection('user').insertOne(data).catch((err=>{
                        console.log(err);
                        return false;
                  }))
      
      
                   if(createUser.acknowledged === true){
                          res.send({status : true,message : 'User created successfully',result : {name : req.body.name,email : req.body.email}})
                        }else{
                              res.send({status : false,message:"Error in Creating User"})
                        }
            }else{
                  res.send({status:false,message:"User already exist"})
            }
      
	
})


//create a domain
app.post('/create_domain',async function(req,res){
 
       const data ={
            domain : req.body.domain_name
       }

       const createDomain = await db.collection('domain').insertOne(data).catch(err=>{
            console.log(err)
            return false;
       })
 

      if(createDomain.acknowledged === true){
            res.send({status:true,message:"Domain created Successfully"})
      }
      else{
            res.send({status:false,message:'Error in Creating Domain'})
      }


})


 
app.get("/domain_list", async function(req,res){
  const list = await db.collection('domain').find({}).toArray().catch(err=>{
      console.log(err);
      return false
  })

  if(list.length>=1){
      res.send({status:true,result:list})
  }
  else{
      res.send({status:false,message:"No Domain Found"})
  }
})

// app.delete("/delete_domain", async function(req,res){

//       const deletedomain  = await db.collection('domain').deleteOne({where:{domain : req.body.domain_name }}).catch(err=>{
//             console.log(err);
//             return false;
//       }) 
//       console.log(deletedomain)
// })




