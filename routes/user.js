const router = require('express').Router()
const controller = require("../controllers/user.js");
const checkBodyIsEmpty = require('../middlewares/checkBodyIsEmpty')
const verifyToken = require('../middlewares/verifyToken')
const findUser = require('../middlewares/findUser')

const get_uid = (req,res,next) => {
    req.user = {
        uid: req.params.id
    }
    next()
}

router.get("/all/:type", verifyToken, findUser, controller.getAllChild);
router.get("/", verifyToken, findUser, controller.getData);
router.post("/", checkBodyIsEmpty, controller.register);
router.put("/", verifyToken, findUser, checkBodyIsEmpty, controller.update);
router.put("/password", verifyToken, findUser, checkBodyIsEmpty, controller.updatePassword);
router.post("/login", checkBodyIsEmpty, controller.login);

router.get("/id/:id", get_uid, findUser, controller.getData);
router.put("/id/:id", get_uid, findUser, checkBodyIsEmpty, controller.update);

module.exports = router