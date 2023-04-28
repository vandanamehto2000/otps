const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minLength: 4,
        maxLength: 15,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z ]*$/.test(v);
            },
            message: '{VALUE} Please fill a name in alphabet letter, not a number!'
        }
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: '{VALUE} Please fill a valid email address with @'
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: [10, "phoneNumber should have minimum 10 digits"],
        maxLength: [10, "phoneNumber should have minimum 10 digits"],
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: '{VALUE} phoneNumber should have only 10 digits'
        },
    },
    otp: {
        type: Number,
        trim: true,
        minLength: [4, "no should have minimum 4 digits"],
        maxLength: [4, "no should have maximum 4 digits"],
        match: [/\d{4}/, "no should only have digits, it should not be string"]
    },
    otpUpdateTime: {
        type: Date,
        trim: true
    }
})

module.exports = mongoose.model("OTP", otpSchema);

