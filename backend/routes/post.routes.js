import {Router} from "express";
import {activeCheck , createPost, getAllPosts, deletePost} from "../controllers/post.controller.js";
import multer from 'multer';
import path from "path";

const router = Router();

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        const uniqueName = Date.now() + "_" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null,uniqueName);
    }
});

const upload = multer({storage:storage});

router.route('/').get(activeCheck);
router.route('/post').post(upload.single('media'), createPost);
router.route('/posts').get(getAllPosts);
router.route("/delete_post").delete(deletePost);


export default router;