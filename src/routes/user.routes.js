const  { Router } = require('express')

const multer = require('multer')
const uploadConfig = require('../config/upload')

const ensureAuthentication = require('../middleware/ensureAuthentication')

const UsersController = require('../Controllers/UsersController')
const UserAvatarController = require('../Controllers/UserAvatarController')

const usersRouter = Router()
const upload = multer(uploadConfig.MULTER)

const userController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', userController.create)
usersRouter.put('/', ensureAuthentication, userController.update)
usersRouter.patch('/avatar', ensureAuthentication, upload.single('avatar'), userAvatarController.update )

module.exports = usersRouter