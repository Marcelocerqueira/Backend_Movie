const  { Router } = require('express')

const NotesController = require('../Controllers/NotesController')
const ensureAuthentication = require('../middleware/ensureAuthentication')

const notesRouter = Router()

const notesController = new NotesController();

notesRouter.use(ensureAuthentication)

notesRouter.post('/', notesController.create)
notesRouter.get('/', notesController.index)
notesRouter.get('/:id', notesController.show)
notesRouter.delete('/:id', notesController.delete)

module.exports = notesRouter