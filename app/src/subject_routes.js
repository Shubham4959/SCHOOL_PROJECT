const express = require('express');
const router = express.Router();
const Subjectmodel = require('../models/subject_schema');

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

module.exports=router