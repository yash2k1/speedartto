const express= require('express');
const cors=require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt= require('bcrypt');
const User=require('./models/User.js');
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser');

require('dotenv').config()
const app=express();
const bcryptSalt=bcrypt.genSaltSync(12);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:'http://localhost:3000',
}));

mongoose.connect(process.env.MONGO_URL);
app.get('/test',(req,res)=>{
    res.json('test ok');
});
// for registration
app.post('/Register', async (req,res)=>{
    const {name,phoneNo,email,password}=req.body;
 try{
    const userDoc=await User.create({
        name,
        phoneNo,
        email,
        password:bcrypt.hashSync(password,bcryptSalt),
       });
       res.json(userDoc);
 }catch(e){
    res.status(422).json(e);
 }
})
// for login
app.post('/Login', async (req,res)=>{
    const {email,password}=req.body;
  const userDoc=await User.findOne({email});
  if(userDoc){
    const pwdOk=bcrypt.compareSync(password,userDoc.password);
    if (pwdOk) {
        jwt.sign({
          email:userDoc.email,
          id:userDoc._id,
        }, jwtSecret, {}, (err,token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        });
      } else {
        res.status(422).json('pass not ok');
      }
    } else {
      res.json('not found');
    }
  });

  app.get('/Profile',(req,res)=>{
    // const{token}=req.cookies;
    // if(token){
    //   jwt.verify(token,jwtSecret,{},async(err,userData)=>{
    //   if(err) throw err;
    //  const {name,email,_id}= await User.findById(userData.id);
    //   res.json({name,email,_id});
    //   });
      
    // }else{
    //   res.json({token});
    // }
    res.json('user info');
  });
// taking logout request and resond on it
app.post('logout',(req,res)=>{
  res.cookie('token','').json(true);
})


app.listen(4000);

