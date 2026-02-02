const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address");
            }
        }
    },
    password:{
        type:String,
        required:true,
        // validate(val){
        //     if(!validator.isStrongPassword(val)){
        //         throw new Error("Enter a Strong password")
        //     }
        // }
    },
    age:{
        type:Number,
        min:18    // in case of number we use min but in case of string we use minLength
    },
    gender:{
        type:String,
        // we can do enum:["male","female","others"] this is quite simpler way but we can write our own custom logic  for validation as well 
        validate(val){
            if(!["male","female","others"].includes(val)){
                throw new Error("Gender data is not valid");
            }
        } 
    },
    photoUrl:{
        type:String,
        default:"https://plus.unsplash.com/premium_vector-1683141132250-12daa3bd85cf?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo url")
            }
        }
    },
    shortDesc:{
        type:String
    },
    about:{
        type:String
    },
    skills:{
        type:[String]
    }
},{timestamps:true})

// we can write methods directly here which are needed to performed for each user (No use of Arrow Functions is preferred)
userSchema.methods.getJWT=async function (){

        const user=this;

    const token = await jwt.sign({_id:user.id},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token;

}

userSchema.methods.validatePassword=async function(password){
    const user=this;

    const isPasswordValid=await bcrypt.compare(password,user.password);

    return isPasswordValid;

}

module.exports=mongoose.model("User",userSchema);