const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: { type: String, require: true, min: 3, max: 20, unique: true },
    email: { type: String, require: true, max: 50, unique: true },
    password: { type: String, require: true, max: 50 },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    follwers: { type: Array, default: [] },
    follwings: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
    desc: { type: String },
    city: { type: String, max: 50 },
    from: { type: String, max: 50 },
    relationship: { type: String, enum: ["Single", "Married", "other"] }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);