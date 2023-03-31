const knex = require('../database/knex')

class NotesController{
    async create(request, response) {
        const { title, description, rating, tags } = request.body
        const  user_id  = request.user.id

        const note_id = await knex('movie_notes').insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsInsert = tags.map(tag_name => {
            return {
                note_id,
                tag_name,
                user_id
            }
        })

        await knex('movie_tags').insert(tagsInsert)

        response.json()
    }

    async show(request, response){
        const { id } = request.params

        const note = await knex('movie_notes').where({ id }).first()
        const tags = await knex('movie_tags').where({ note_id: id }).orderBy('tag_name')

        return response.json({
            ...note,
            tags
        })
    }

    async delete(request, response){
        const { id } = request.params

        await knex('movie_notes').where({ id }).delete()

        return response.json()
    }

    async index(request, response){
        const { title, movie_tags } = request.query

        const  user_id  = request.user.id

        let notes 

        if (movie_tags){
            const filteredTags = movie_tags.split(',').map(movie_tags => movie_tags.trim())

            notes = await knex('movie_tags')
            .select([
                'movie_notes.title',
                'movie_notes.id',
                'movie_notes.user_id',
                'movie_notes.description',
                'movie_notes.rating'
            ])
            .where('movie_notes.user_id', user_id)
            .whereLike('movie_notes.title', `%${title}%`)
            .whereIn('tag_name', filteredTags)
            .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
            .groupBy('movie_notes.id')
            .orderBy('movie_notes.title')

        } else {
            notes = await knex('movie_notes')
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title")
        }

        const userTags = await knex('movie_tags').where({ user_id })
        const notesWithTags = notes.map(note => {
           const noteTags =  userTags.filter(movie_tags => movie_tags.note_id === note.id)

           return {
            ...note,
            tags: noteTags
           }
        })

        return response.json(notesWithTags)
    }
}

module.exports = NotesController