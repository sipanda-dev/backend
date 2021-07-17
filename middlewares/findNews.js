const db = require("../models");
const News = db.news;
const User = db.user;
const UserInfo = db.user_info;
const File = db.file;

module.exports = (req, res, next) => {
    News.findOne({
        where: {
            NEWS_ID: req.params.id
        },
        include: [
            { model: User, include: [UserInfo] },
            { model: File, as:'cover', where:{REFERENCE:'news'}, required:false}
        ],
    }).then(data => {
        if (data) {
            req.news = data
            next()
        } else
        res.status(400).send({
            message: "News not found"
        });
    }).catch(err => {
        res.status(500).send({
            message: "News not found"
        });
    });
}