import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    // Handle user registration logic
    const {email,fullName,password} = req.body;
    try {
        if(!email || !fullName || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Email is already registered"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                email:newUser.email,
                fullName:newUser.fullName,
                profile:newUser.profilePic,
            })
        } else {
            res.status(400).json({message:"Invalid user data"});
        }

    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({message:"Server error"});
    }
}