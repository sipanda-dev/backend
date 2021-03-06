require('dotenv').config()
const db = require("../models");
const Complaint = db.complaint;
const User = db.user;
const UserInfo = db.user_info;
const FollowUp = db.follow_up;

const error = require('../helpers/errors')

exports.create = (req, res) => {
    const followup = {
        USER_ID: req.follow_up.USER_ID,
        COMPLAINT_ID: req.follow_up.COMPLAINT_ID
    }
    FollowUp.create(followup)
        .then(data => {
            res.send({ data });
        })
        .catch(err => {
            error(res, 500, err)
        });

}