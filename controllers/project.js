require('dotenv').config()
const db = require("../models");
const Project = db.project
const ProjectDetail = db.project_detail
const User = db.user;
const UserInfo = db.user_info;
const File = db.file;
const Finance = db.finance;
const error = require('../helpers/errors')
const { Op } = require('sequelize')

const cleanObj = require('../helpers/cleanObj')

exports.create = (req, res) => {
    const project = {
        USER_ID: req.body.kontraktor,
        CREATE_BY : req.user.USER_ID,
        TITLE: req.body.title,
        DESCRIPTION: req.body.description,
        LOCATION: req.body.location,
        STATUS: req.body.status,
        CREATE_DATE: new Date()
    }
    Project.create(project)
        .then(data => {
            res.send({ data });
        })
        .catch(err => {
            error(res, 500, err)
        });
}

exports.get = (req, res) => {
    res.send({message:'sukses get', data: req.project})
}

async function getProjects(id, type){
    let cond = {}
    if(type != 'K') cond = { CREATE_BY: id } 
    else cond = { USER_ID: id }
    const response = await Project.findAll({
        where: cond,
        include:[
            {model: User, include: [UserInfo] },
            {model: User, as:'createdby', include: [UserInfo] },
            {model: ProjectDetail, include: [{model:Finance,where:{IS_GENERAL:'0'}, required:false}] }, 
            {model: File, where: {REFERENCE:'project'}, required:false},
            {model: Finance, where: {IS_GENERAL:'1'}, required:false},
        ]})
    return response
}

async function getUser(id){
    let response = await UserInfo.findOne({
        where: {
            USER_ID:id
        },
        include: [
            {model: User}
        ],
    })
    return response
}

exports.getAll = async (req, res) => {
    let data = await getProjects(req.user.USER_ID, req.user.user.TYPE)
    let curr = await getUser(req.user.user.USER_PARENT)
    if(curr){
        data = [...data, ... await getProjects(curr.USER_ID, curr.user.TYPE)]
        curr = await getUser(curr.user.USER_PARENT)
    }
    if(curr){
        data = [...data, ... await getProjects(curr.USER_ID, curr.user.TYPE)]
        curr = await getUser(curr.user.USER_PARENT)
    }
    if(curr){
        data = [...data, ... await getProjects(curr.USER_ID, curr.user.TYPE)]
        curr = await getUser(curr.user.USER_PARENT)
    }
    if(curr)
        data = [...data, ... await getProjects(curr.USER_ID, curr.user.TYPE)]
    res.send(data)
}

exports.update = async (req, res) => {
    let project = {
        USER_ID: req.body.kontraktor,
        CREATE_BY : req.user.USER_ID,
        TITLE: req.body.title,
        DESCRIPTION: req.body.description,
        LOCATION: JSON.stringify(req.body.location),
        STATUS: req.body.status,
    }
    project = cleanObj(project)
    await req.project.update(project)
    res.send({message:'project updated!'})
}

exports.delete = async (req, res) => {
    await req.project.destroy()
    res.send({message:'project deleted'})
}