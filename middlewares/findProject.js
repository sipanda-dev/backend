const db = require("../models");
const Project = db.project;
const User = db.user;
const UserInfo = db.user_info;
const File = db.file;
const Finance = db.finance;
const ProjectDetail = db.project_detail;

module.exports = (req, res, next) => {
    Project.findOne({
        where: {
            PROJECT_ID: req.params.id
        },
        include: [
            { model: User, include: [UserInfo] },
            { model: User, as:'createdby', include: [UserInfo] },
            { model: ProjectDetail, include: [{model:Finance,where:{IS_GENERAL:'0'}, required:false}] }, 
            { model: File, where:{REFERENCE:'project'}, required:false},
            { model: Finance, where:{IS_GENERAL:'1'}, required:false},
        ],
    }).then(data => {
        if (data) {
            req.project = data
            next()
        } else
        res.status(400).send({
            message: "Project not found"
        });
    }).catch(err => {
        res.status(500).send({
            message: "Project not found"
        });
    });
}