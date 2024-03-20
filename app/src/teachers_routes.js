const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const Teachermodel = require('../models/teacher_schema');
const Classmodel = require('../models/class_schema');
const Subjectmodel = require('../models/subject_schema');
const Studentmodel = require('../models/students_schema');
const { jwtAuthMiddleware, generateToken } = require("../../controllers/auth");



router.post('/teachers/register', async (req, res) => {
    try {
        const { Name, Email, PhoneNo, ClassId, SubjectIds } = req.body;
        const password = Math.random().toString(36).slice(-8);
        const teacher = await new Teachermodel({
            Name,
            Email,
            PhoneNo,
            Password: password,
            ClassId,
            SubjectIds
        }).save();
        if (teacher) {
            res.json({ status: true, code: 200, teacher: teacher, message: 'Teacher Registered Successfully' });
        } else {
            res.json({ status: false, code: 200, message: 'Teacher Not Registered ' });
        }

    } catch (error) {
        if (error.code === 11000) {
            res.json({ status: false, code: 500, message: 'Email Already Existed' });
        } else {
            console.log(error);
            res.json({ status: false, code: 500, message: 'Something Went Wrong' });
        }
    }
});


router.post('/teachers/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const teacher = await Teachermodel.findOne({ Email: Email });
        if (!teacher || (Password != teacher.Password)) {
            return res.status(401).json({ status: false, code: 400, message: 'Invalid Email or Password ' })
        }
        const payload = {
            id: teacher.id
        }
        const token = generateToken(payload)
        if (token) {
            res.json({ status: true, code: 200, message: "Token Generated Succesfully", token: token });
        }

    } catch (error) {
        console.log(error);
        res.json({ status: false, code: 500, message: 'Something Went Wrong' });
    }
});


router.get("/teachers/profile", jwtAuthMiddleware, async (req, res) => {

    try {
        const teacherId = req.user.id;

        const teacher = await Teachermodel.findById(teacherId)
        if (teacher) {
            res.json({ status: true, code: 200, Teacher: teacher, message: "Teacher Found Succcesfully" })
        } else {
            res.json({ status: false, code: 500, message: "Teacher Not Found " })
        }

    } catch (error) {
        console.log(error)
        res.json({ status: false, code: 500, message: "Something Went Wrong" })
    }

})



router.get("/getTeachers", jwtAuthMiddleware, async (req, res) => {

    try {
        const teachers = await Teachermodel.find()
        if (teachers) {
            res.json({ status: true, code: 200, Teachers: teachers, message: "Teachers Found Succcesfully" })
        } else {
            res.json({ status: false, code: 500, message: "Teacher Not Found " })
        }

    } catch (error) {
        console.log(error)
        res.json({ status: false, code: 500, message: "Something Went Wrong" })
    }

})


router.post("/teachers/update", jwtAuthMiddleware, async (req, res) => {

    try {
        const teacherId = req.user.id;
        const updateTeacher = await Teachermodel.findByIdAndUpdate(teacherId, { $set: req.body }, { new: true })
        if (updateTeacher) {
            res.json({ status: true, code: 200, Teacher: updateTeacher, message: "Teacher Updated Succcesfully" })
        } else {
            res.json({ status: false, code: 200, message: "Teacher Not Updated " })
        }

    } catch (error) {
        console.log(error);
        res.json({ status: false, code: 500, message: "Something Went Wrong" })
    }
})


router.delete("/teachers/delete", jwtAuthMiddleware, async (req, res) => {

    try {
        const teacherId = req.user.id;
        const deleteTeacher = await Teachermodel.findByIdAndDelete(teacherId)
        if (deleteTeacher) {
            res.json({ status: true, code: 200, message: "Teacher deleted Succcesfully" })
        } else {
            res.json({ status: false, code: 200, message: "Teacher Not deleted " })
        }

    } catch (error) {
        console.log(error);
        res.json({ status: false, code: 500, message: "Something Went Wrong" })
    }
})



router.get("/getTeacherDetails/:id", jwtAuthMiddleware, async (req, res) => {

    try {
        
        const student = await Teachermodel.aggregate([

            { $match: { _id:  new mongoose.Types.ObjectId(req.params.id) } },

            {
                $lookup: {
                    from: "classes",
                    localField: "ClassId",
                    foreignField: "_id",
                    as: "Teacher_Class"
                }
            },

            {
                $lookup: {
                    from: "subjects",
                    localField: "SubjectIds",
                    foreignField: "_id",
                    as: "Teacher_Subject"
                }
            },

            {
                $project: {
                    Name: 1,
                    Email: 1,
                    PhoneNo: 1,
                    Password: 1,
                    Teacher_Class: {$arrayElemAt:['$Teacher_Class.Class',0]},
                    Teacher_Subject: "$Teacher_Subject.Subject",
                }
            }

        ])
        if (student) {
            res.json({ status: true, code: 200, Data: student, message: "Teacher Found Succcesfully" })
        } else {
            res.json({ status: false, code: 500, message: "Teacher Not Found" })
        }

    } catch (error) {
        console.log(error)
        res.json({ status: false, code: 500, message: "Something Went Wrong" })
    }
})

module.exports = router 