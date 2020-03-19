const express = require('express')

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')
const { getMovie, searchMovie } = require('../movieApi')

const api = express.Router()

const VIEWS_PATH = './app_api/views/'

const views = {
    VIEW_LANDING: `${VIEWS_PATH}landing.pug`,
    VIEW_MOVIE: `${VIEWS_PATH}movieView.pug`,
    VIEW_MOVIE_LIST: `${VIEWS_PATH}movieList.pug`,
}

api.get('/', async (req, res) => {
    try {
        let rootTag = loadTemplate(views.VIEW_LANDING, {})
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
    //    console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

api.get('/movie/:id', async (req, res) => {

    const movieId = req.params.id

    try {
        let data = await getMovie(movieId)
        let rootTag = loadTemplate(views.VIEW_MOVIE, data)
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

api.get('/movies/search', async (req, res) => {

    const query_text = req.body.query_text

    try {
        let data = await searchMovie(query_text)
        let rootTag = loadTemplate(views.VIEW_MOVIE_LIST, { movies: data })
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

module.exports = api
