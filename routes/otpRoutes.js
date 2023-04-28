const OTP = require("../models/otpModel");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const settings = require("../config/settings");
const { request } = require("undici");
const md5 = require("md5");


// register
router.post("/register", async (req, res) => {
    const { name, email, phoneNumber } = req.body;
    if (!(name && email && phoneNumber)) {
        return res.status(400).json("All input is required");
    }
    let result = await OTP.find({ phoneNumber: req.body.phoneNumber });
    const result2 = await OTP.find({ email: req.body.email });
    try {
        if (result.length > 0) {
            return res.status(201).json({ message: "you have already resgister", result: result[0] })
        }
        const otp = await OTP.create({ ...req.body });
        return res.status(201).json({ message: "you have register successfully", otp })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(201).json({ message: "you have already resgister", result2: result2[0] })
        }
        res.status(409).send(err);
    }
});


// send otp on phoneNumber 
router.post("/sendOTP", async (req, res) => {

    const { phoneNumber } = req.body;
    let otp = Number(Math.floor(1000 + Math.random() * 9000).toString())
    try {
        let payload = {
            ...req.body,
            otp,
            otpUpdateTime: new Date()
        }
        let data = await OTP.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { $set: { ...payload } }, { new: true });
        console.log({ "otp": data.otp });
        const config = settings.data2factor;
        const response = await request(
            config.API_URL +
            config.APP_KEY +
            "/SMS/" +
            phoneNumber +
            "/" +
            otp +
            "/" +
            config.TEMPLATE.OTP_TEMPLATE
        );
        if (response.statusCode === 200) {
            // console.log("vandana,'''''''''''''''''''''");
            res.send(response.statusCode)
            return otp
        }
        return false
    }
    catch (err) {
        res.status(404).json({ message: "phoneNumber not found", err });

    }
})


// verify OTP with phoneNumber
router.post("/verifyOTP", async (req, res) => {
    try {
        let user = await OTP.findOne({
            phoneNumber: req.body.phoneNumber,
        });
        if (req.body.otp === user.otp) {
            return res.status(200).json({ message: "OTP is verified successfully" })
        } else {
            return res.status(409).json({ message: "INVALID OTP" })
        }
    }
    catch (err) {
        res.status(404).json({ message: "phoneNumber is wrong", err });
    }
});


// // mailverify
// router.post("/verifyOtpWithEmail", async (req, res) => {
//     try {
//         let user = await OTP.findOne({ email: req.body.email });
//         if (req.body.otp === user.otp) {
//             console.log({ message: "OTP is verified successfully" });
//             return res.status(200).json({ message: "OTP is verified successfully" })
//         } else {
//             console.log({ message: "INVALID OTP" });
//             return res.status(409).json({ message: "INVALID OTP" })
//         }

//     } catch (err) {
//         console.log({ message: "email is wrong" });
//         res.status(404).json({ message: "email is wrong", err });
//     }
// })


// //otp verify with expire time

// router.post("/verifyOtpWithEmail", async (req, res) => {
// function isOtpExpire(date) {
//     try {
//       const TEN_MINUTES = 10 * 60 * 1000;
//       const duration = new Date() - new Date(date).getTime();
//       if (duration > TEN_MINUTES) {
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error(error);
//       return false;
//     }
//   }
//     try {
// let user = await OTP.findOne({ email: req.body.email });
// if(isOtpExpire(user.otpUpdateTime)){
//     return res.status(203).json({message:"expire otp"});
// }
// if (req.body.otp === user.otp) {
//     console.log({ message: "OTP is verified successfully" });
//     return res.status(200).json({ message: "OTP is verified successfully" })
// } else {
//     console.log({ message: "INVALID OTP" });
//     return res.status(409).json({ message: "INVALID OTP" })
// }

//     } catch (err) {
//         console.log({ message: "email is wrong" });
//         res.status(404).json({ message: "email is wrong", err });
//     }
// });



// email verify with otp with extra /
router.get("/mail/", async (req, res) => {
    try {
        console.log(req.query.email, "ppppppppppppp",);

        if (req.query.email == undefined || req.query.otp == undefined) {
            res.json({ "message": "bad request" })
        }

        let user = await OTP.findOne({
            email: req.query.email,
        });

        if (req.query.otp === user.otp) {
            return res.status(200).json({ message: "OTP is verified successfully" })
        } else {
            return res.status(409).json({ message: "INVALID OTP" })
        }
    } catch (err) {
        res.status(404).json({ message: "email is wrong", err });
    }
});


// getEncrypted
router.post("/getEncrypted", async (req, res) => {
    try {
        const key = "1234tgbnm876trf";
        const plainText = "qwertyuiop";

        const encrypted = CryptoJS.AES.encrypt(plainText, key).toString();
        let encrypted_ = encrypted;
        encrypted_ = new Promise(function (resolve, reject) {
            resolve(encrypted_);
        });

        encrypted_.then(async (data) => {
            return res.status(200).json({ encrypted: data });

        }).catch((err) => {
            res.status(404).json({ message: err });
        })

    } catch (err) {
        res.status(404).json({ message: err });
    }
})


// getDecrypted
router.post("/getDecrypted", async (req, res) => {
    try {
        const key = "1234tgbnm876trf";
        const plainText = "qwertyuiop";

        const decrypted = CryptoJS.AES.decrypt(plainText, key);
        let decrypted_ = decrypted.toString(CryptoJS.enc.Utf8);
        decrypted_ = new Promise(function (resolve, reject) {
            resolve(decrypted_)
        });

        decrypted_.then((data) => {
            return res.status(200).json({ decrypted: data });

        }).catch((err) => {
            res.status(404).json({ message: err });
        })

    } catch (err) {
        res.status(404).json({ message: err });
    }
})


// verifyOtpWithEmail
router.post("/verifyOtpWithEmail", async (req, res) => {
    try {
        let user = await OTP.findOne({ email: req.body.email });
        if (req.body.otp === user.otp) {
            return res.status(200).json({ data: md5(user.phoneNumber), message: "OTP is verified successfully" })
        } else {
            return res.status(409).json({ message: "INVALID OTP" })
        }
    } catch (err) {
        res.status(404).json({ message: "email is wrong", err });
    }
});


// otpValidation with hashval md5
router.post("/otpValidation", async (req, res) => {
    function isOtpExpire(date) {
        try {
            const TEN_MINUTES = 10 * 60 * 1000;
            const duration = new Date() - new Date(date).getTime();
            if (duration > TEN_MINUTES) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
    try {
        let user = await OTP.findOne({ email: req.body.email });
        let hashval = req.body.hashval;
        let genHash = md5(md5(user.email)) + md5("NICOTPVERIFY") + md5(user.email.split("@")[0]);
        if (genHash === hashval) {
            if (isOtpExpire(user.otpUpdateTime)) {
                return res.status(203).json({ message: "expire otp" });
            } else {
                return res.status(200).json({
                    'resp': true
                })
            }
        }
        else {
            return res.status(200).json({
                'resp': false
            })
        }
    }
    catch (err) {
        return res.status(404).json({ message: "email is wrong", err });
    }
})

module.exports = router;




