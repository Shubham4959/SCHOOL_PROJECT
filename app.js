const express = require('express');
const app=express();
const mongoose = require('mongoose');
require("dotenv").config()
const db=require("./config/db")
const bodyParser = require('body-parser');
const studentRoutes = require('./app/src/students_routes');
const teacherRoutes=require("./app/src/teachers_routes")
const classRoutes=require("./app/src/classs_routes")
const subjectRoutes=require("./app/src/subject_routes")
app.use(bodyParser.json());
app.use(express.json());


app.use("/students",studentRoutes)
app.use("/teachers",teacherRoutes)
app.use(classRoutes)
app.use(subjectRoutes)

app.listen(process.env.PORT,(req,res)=>{
    console.log("Listening to port " + process.env.PORT);
})



