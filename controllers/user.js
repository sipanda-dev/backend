require('dotenv').config()
const db = require("../models");
const User = db.user;
const UserInfo = db.user_info
const File = db.file
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const saltRounds = 10;

const cleanObj = require('../helpers/cleanObj')

const error = require('../helpers/errors')

exports.register = (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hashedPassword) {
        const user = {
            USER_PARENT: req.body.parent,
            NAME: req.body.name,
            NIK: req.body.nik,
            PASSWORD: hashedPassword,
            STATUS: req.body.status,
            TYPE: req.body.type
        };
        User.create(user)
            .then(data => {
                const info = {
                    USER_ID: data.USER_ID,
                    GENDER: req.body.gender,
                    ADDRESS: req.body.address,
                    BIRTH_DATE: req.body.birth_date,
                    BIRTH_PLACE: req.body.birth_place,
                    EMAIL: req.body.email,
                    PHONE_NUMBER: req.body.phone
                }
                UserInfo.create(info)
                res.send({ data, info });
            })
            .catch(err => {
                error(res, 500, err)
            });
    })
};

exports.login = (req, res) => {
    const { email, password } = req.body
    UserInfo.findOne({
        where: {
            EMAIL: email
        },
        include: [
            {model: User, include: [{model: File, as:'cover', where:{REFERENCE:'user'}, required:false}] }
        ],
    }).then(function (entries) {
        let info = entries
        if (info) {
            bcrypt.compare(password, info.user.PASSWORD, function (err, result) {
                if (err) error(res)
                else {
                    if (result) {
                        const token = jwt.sign({ uid: info.user.USER_ID, email: info.EMAIL }, process.env.SECRETKEY || 'SIPANDA')
                        const { PASSWORD, ...userData } = info.user.dataValues
                        res.send({ message: `user ${info.user.NAME} logged in!`, user: { ...userData }, token })
                    } else {
                        error(res, 401, { message: 'Salah password!' })
                    }
                }
            })
        } else error(res, 401, { message: 'Email tidak ditemukan!' })
    });
}

exports.getData = (req, res) => {
    res.send({ message: 'get data sukses', data: req.user })
};

exports.getAllChild = (req, res) => {
    const {type} = req.params
    if(type && type != '0')
        UserInfo.findAll({
            include: [
                {model: User, where:{ USER_PARENT : req.user.USER_ID, TYPE: type}, include: [{model: File, as:'cover', where:{REFERENCE:'user'}, required:false}] }
            ],
        }).then(async function (result) {
            res.send({ message: 'get data sukses', data: result })
        })
    else
        UserInfo.findAll({
            include: [
                {model: User, where:{ USER_PARENT : req.user.USER_ID, TYPE: { [Op.not]: 'K'}}, include: [{model: File, as:'cover', where:{REFERENCE:'user'}, required:false}] }
            ],
        }).then(async function (result) {
            res.send({ message: 'get data sukses', data: result })
        })
};

exports.update = (req, res) => {
    User.findOne({
        where: {
            USER_ID: req.user.USER_ID
        }
    }).then(async function (result) {
        let user = {
            NAME: req.body.name,
            NIK: req.body.nik,
            STATUS: req.body.status
        }
        let info = {
            EMAIL: req.body.email,
            GENDER: req.body.gender,
            ADDRESS: req.body.address,
            BIRTH_DATE: req.body.birth_date,
            BIRTH_PLACE: req.body.birth_place,
            PHONE_NUMBER: req.body.phone
        }
        user = cleanObj(user)
        info = cleanObj(info)

        await result.update(user)
        await req.user.update(info)
        res.send({ message: 'user data updated!' })
    })
}

exports.updatePassword = (req, res) => {
    bcrypt.compare(req.body.oldpassword, req.user.user.PASSWORD, function (err, result) {
        if (err) error(res)
        else {
            if (result) {
                User.findOne({
                    where: {
                        USER_ID: req.user.USER_ID
                    }
                }).then(function (result) {
                    bcrypt.hash(req.body.newpassword, saltRounds, async function (err, hashedPassword) {
                        await result.update({PASSWORD: hashedPassword})
                        res.send({ message: 'user password updated!' })
                    })
                })
            }
            else {
                error(res, 401, { message: 'Salah password!' })
            }
        }
    })
}