const db = require("../models");
const Complaint = db.complaint;
const User = db.user;
const UserInfo = db.user_info;
const FollowUp = db.follow_up;
const File = db.file;

module.exports = (req, res, next) => {
    Complaint.findOne({
        where: {
            COMPLAINT_ID: req.params.id
        },
        include: [
            { model: User, include: [UserInfo, {model: User, include: [UserInfo] }] },
            {model:FollowUp, include: [{model: User, include: [UserInfo] }]},
            { model: File, where:{REFERENCE:'complaint'}, required:false}
        ],
    }).then(data => {
        if (data) {
            req.complaint = data
            next()
        } else
        res.status(400).send({
            message: "Complaint not found"
        });
    }).catch(err => {
        res.status(500).send({
            message: "Complaint not found"
        });
    });
}