const  { Router } = require('express')

const TagController = require('../Controllers/TagController')
const ensureAuthentication = require('../middleware/ensureAuthentication')

const tagRouter = Router()

const tagController = new TagController();

tagRouter.get('/', ensureAuthentication, tagController.index)

module.exports = tagRouter