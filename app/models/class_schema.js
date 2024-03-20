const mongoose=require('mongoose');


const classSchema=mongoose.Schema({
    Class:{
        type:String
    }
})

module.exports=mongoose.model('Class',classSchema);
