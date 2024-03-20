const express = require('express');
const app=express();
const mongoose = require('mongoose');
require("dotenv").config()
const db=require("./config/db")
const bodyParser = require('body-parser');
const studentRoutes = require('./app/src/students_routes');
const teacherRoutes=require("./app/src/teachers_routes")
app.use(bodyParser.json());
app.use(express.json());




app.use(studentRoutes,teacherRoutes);

app.listen(process.env.PORT,(req,res)=>{
    console.log("Listening to port " + process.env.PORT);
})

  
