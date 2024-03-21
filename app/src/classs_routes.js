const express = require('express');
const router = express.Router();
const Classmodel = require('../models/class_schema');



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


module.exports=router
