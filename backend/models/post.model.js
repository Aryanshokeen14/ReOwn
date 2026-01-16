import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    body:{
        type:String,
        required:true
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    media:{
        type: String,
        default:''
    },
    active:{
        type: Boolean,
        default:true
    },
    fileType:{
        type: String,
        default:''
    },
},{ timestamps: true });

const Post = mongoose.model("Post",PostSchema);
export default Post;