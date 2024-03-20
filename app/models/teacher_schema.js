const mongoose=require('mongoose');

const teacherSchema= mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
         type:String,
         required:true,
         unique:true

    },
    PhoneNo:{
        type:String,
        required:true
    },
    Password:{
        type:String
    },
    ClassId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    SubjectIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }]
})

module.exports=mongoose.model('Teacher',teacherSchema);

