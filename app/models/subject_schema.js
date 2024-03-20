const mongoose=require('mongoose');

const subjectSchema= mongoose.Schema({
    Subject:{
        type:String
    }
})


module.exports= mongoose.model('Subject',subjectSchema);

