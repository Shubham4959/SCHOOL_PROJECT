const express = require('express');
const router = express.Router();
const mongoose=require('mongoose')
const jwt = require('jsonwebtoken');
const Studentmodel = require('../models/students_schema');
const Classmodel = require('../models/class_schema');
const Subjectmodel = require('../models/subject_schema');
const {jwtAuthMiddleware,generateToken}=require("../../controllers/auth");


router.post('/students/register', async (req, res) => {
    try {
        const { Name, Email, PhoneNo, ClassId, SubjectIds } = req.body;
        const password = Math.random().toString(36).slice(-8);
            const student = await new Studentmodel({
                Name,
                Email,
                PhoneNo,
                Password:password,
                ClassId,
                SubjectIds
            }).save();
           if(student){
            res.json({ status:true,code:200,message: 'Student Registered Successfully',Data:student});
           }else{
            res.json({ status:false,code:200,message: 'Student Not Registered ' });
           }
        
    } catch (error) {
        if(error.code===11000){
            res.json({ status:false,code:500,message: 'Email Already Existed' });
        }else{
            res.json({ status:false,code:500,message: 'Something Went Wrong' });
        }
    }
});


router.post('/students/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const student = await Studentmodel.findOne({ Email:Email});
        if (!student || (Password != student.Password)) {
            return res.status(401).json({status:false,code:400, message: 'Invalid Email or Password ' })
        }
        const payload={
            id:student.id,
        }
        const token= generateToken(payload)
        if(token){
            res.json({status:true,code:200,message:"Student Login Succesfully",token:token });
        }
       
    } catch (error) {
       console.log(error);
       res.json({status:false,code:500, message: 'Something Went Wrong'});
    }
});


router.post('/class', async (req, res) => {
    try {
        const {Class} =req.body;
        const newClass= await Classmodel({
            Class:Class
        }).save();

        if(newClass){
            res.json({status:true,code:200,message: 'Class Created Successfully',Data:newClass});  
        }else{
            res.json({status:false,code:200, message: 'Subject Not Created '});
        }

    } catch (error) {
        console.log(error);
        res.json({status:false,code:500, message: 'Something Went Wrong'});
    }
});


router.post('/subject', async (req, res) => {
    try {
        const {Subject } = req.body;
        const newSubject = await Subjectmodel({
            Subject: Subject
        }).save();

        if(newSubject){
            res.json({status:true,code:200,Subject:Subject,message: 'Subject Created Successfully',Data:newSubject});
        }else{
            res.json({status:false,code:200, message: 'Subject Not Created '});
        }
      
    } catch (error) {
        console.log(error);
        res.json({status:false,code:500, message: 'Something Went Wrong'});
    }
});


router.get("/students/profile",jwtAuthMiddleware,async(req,res)=>
{

    try{
        const studentId=req.user.id
    
        const student=await Studentmodel.findById(studentId)
        if(student){
            res.json({status:true,code:200,message:"Student Found Succcesfully",Data:student})
        }

    }catch(error){
        console.log(error)
        res.json({status:false,code:500,message:"Something Went Wrong"})
    }
   
})


router.get("/getStudents",jwtAuthMiddleware,async(req,res)=>
{

    try{
        const Students=await Studentmodel.find();
        if(Students){
            res.json({status:true,code:200,message:"Students Found Succcesfully",Data:Students})
        }

    }catch(error){
        console.log(error)
        res.json({status:false,code:500,message:"Something Went Wrong"})
    }
   
})



router.post("/students/update/:id",jwtAuthMiddleware,async(req,res)=>{
      
    try{
      const updateStudent=await Studentmodel.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{new:true})
      if(updateStudent){
        res.json({status:true,code:200,message:"Student Updated Succcesfully",Data:updateStudent})
      }else{
        res.json({status:false,code:200,message:"Student Not Updated "})
      }

    }catch(error){
      console.log(error);
      res.json({status:false,code:500,message:"Something Went Wrong"})
    }      
})


router.delete("/students/delete/:id",jwtAuthMiddleware,async(req,res)=>{

    try{
        const deleteStudent=await Studentmodel.findByIdAndDelete(req.params.id)
        if(deleteStudent){
          res.json({status:true,code:200,message:"Student Deleted Succcesfully"})
        }else{
            res.json({status:false,code:200,message:"Studdent Not Deleted"}) 
        }

    }catch(error){
        console.log(error)
        res.json({status:false,code:500,message:"Something Went Wrong"})

    }
   
})


router.get("/getStudentDetails/:id",jwtAuthMiddleware,async(req,res)=>
{

    try{

        const student= await Studentmodel.aggregate([
            
            {$match:{_id: new mongoose.Types.ObjectId(req.params.id)}},
            
            {$lookup:{ from: "classes",
                      localField: "ClassId",
                      foreignField: "_id",
                      as: "Student_Class"
                     }},
          
            {$lookup:{
                      from: "subjects",
                      localField: "SubjectIds",
                      foreignField: "_id",
                      as: "Student_Subject"
                     }},

            {$project:{
                      Name:1,
                      Email:1,
                      PhoneNo:1,
                      Password:1,
                      Student_Class:{$arrayElemAt:['$Student_Class.Class',0]},
                      Student_Subject:"$Student_Subject.Subject"             
                      }}

        ])
              if(student){
                  res.json({status:true,code:200,message:"Student Found Succcesfully",Data:student})
              }else{
                  res.json({status:false,code:500,message:"Student Not Found"})
              }

    }catch(error){
        console.log(error)
        res.json({status:false,code:500,message:"Something Went Wrong"})
    }
 

    
})

module.exports = router;
