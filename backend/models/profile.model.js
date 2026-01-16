import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    location: {
        type: String,
        default: ''
    }
});

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;