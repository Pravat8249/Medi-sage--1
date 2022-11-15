const express= require("express")
const router= express.Router()
const userController = require("../controllers/controller")
const middleWare = require("../middlewares/middleware")



//----------------------------------------------------UserApi----------------------------------------------------------//
router.post('/register', userController.createUser)
router.post("/login", userController.loginUser)
router.get("/fetch",middleWare.validateToken,userController.getStudents)

module.exports = router;