const  { Router } = require('express')

const SessionController = require('../Controllers/SessionController')

const sessionRoutes = Router()

const sessionController = new SessionController()

sessionRoutes.post('/', sessionController.create)

module.exports = sessionRoutes
