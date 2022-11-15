const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ 

    name: {
        type:String, 
        required:true,
        trim: true
    },
    
    phone: {
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },

    email: {
        type:String, 
        required:true, 
        unique: true,
        trim: true,
        lowercase: true
    }, 
    country: {
        type:String, 
        required:true,
        trim: true
    },
    country_code: {
        type:Number, 
        required:true,
        trim: true
    },
    
    


  }, { timestamps: true } )

  module.exports = mongoose.model("user", userSchema)