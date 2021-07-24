const db = require("../models");
const UserInfo = db.user_info;
const User = db.user;
const File = db.file;

module.exports = (req, res, next) => {
    UserInfo.findOne({
        where: {
            USER_ID: req.user.uid
        },
        include: [
            {model: User, include: [
                {model: File, as:'cover', where:{REFERENCE:'user'}, required:false},
                {model: File, as:'ktp', where:{REFERENCE:'ktp'}, required:false},
                {model: File, as:'diri', where:{REFERENCE:'diri'}, required:false},
                {model: User, include: [UserInfo]}
            ] }
        ],
    }).then(data => {
        req.user = data
        next()
    }).catch(err => {
        res.status(500).send({
            message: "User not found"
        });
    });
}