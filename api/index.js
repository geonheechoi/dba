const express =require('express');
const bpdyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port =3000;
const cors=require('cors');

app.use(cors());

app.use(bpdyParser.urlencoded({extended:false}));
app.use(bpdyParser.json());

const jwt = require('jsonwebtoken');

mongoose.connect("mongodb+srv://geonheechoi:geonheechoi@cluster0.7ck5gen.mongodb.net/").then(()=>{

    console.log("connected to mongoDB");
}).catch((e)=>{
    console.log("error while connecting to mongoDB");
})

app.listen(port,()=>{
    console.log("server is running on port "+port);
})