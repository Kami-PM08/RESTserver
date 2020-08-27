const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role.'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    }
})

userSchema.methods.toJSON = function() {
    let use = this;
    let userObjetc = use.toObject();
    delete userObjetc.password;
    return userObjetc
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

module.exports = mongoose.model('user', userSchema);