import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
    {
        videoFile:{
            type:String,
            required:true
        },
        thumbnail:{
            type:String,
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        isPublished:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            required:true
        },
        duration:{
            type:Number,
            required:true,
        },
        description:{
            type:String,
            required:true
        },
        language:{
            type:String,
            required:true,
        },
    }, {timestamps:true});

export const Video = mongoose.model("Video", videoSchema);
