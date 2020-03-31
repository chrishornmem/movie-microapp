const express = require('express')
const api = express.Router()
const jwt = require('jwt-simple')

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')
const { getMovie, searchMovie } = require('../movieApi')
const { UserFavourite, Movie } = require('../models')

const VIEWS_PATH = './app_api/views/'

const views = {
    VIEW_LANDING: `${VIEWS_PATH}landing.pug`,
    VIEW_MOVIE: `${VIEWS_PATH}movieView.pug`,
    VIEW_MOVIE_LIST: `${VIEWS_PATH}movieList.pug`,
    VIEW_SEARCH: `${VIEWS_PATH}movieSearch.pug`,
}

/*
 * Middleware to grab user
 */
function getUser(req, res, next) {
    if (!req.header('Authorization')) {
        console.log("missing header")
        return res.status(401).send({ message: 'Unauthorized request' })
    }
    const token = req.header('Authorization').split(' ')[1]
    const payload = jwt.decode(token, process.env.TOKEN_SECRET)

    if (!payload) {
        return res.status(401).send({ message: 'Unauthorized Request' })
    }
    req.user = payload.sub
    next()
}

api.use(getUser)

api.get('/', async (req, res) => {

    const user = req.user

    try {
        const userFavourites = await UserFavourite.find({ user_id: user }).populate('_movie')
        const rootTag = loadTemplate(views.VIEW_LANDING, { userFavourites: userFavourites })
        const response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

api.get('/search', async (req, res) => {
    try {
        const rootTag = loadTemplate(views.VIEW_SEARCH, {})
        const response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

api.get('/movie/:id', async (req, res) => {

    const movieId = req.params.id
    const user = req.user

    try {
        const data = await getMovie(movieId)
        const favouriteMovies = await UserFavourite.find({ user_id: user }).populate('_movie')
        let isFavourite = false
        for (const favourite of favouriteMovies) {
            if (favourite._movie.movie_id === movieId) {
                isFavourite = true
                break
            }
        }
        const rootTag = loadTemplate(views.VIEW_MOVIE, { movie: data, isFavourite: isFavourite })
        const response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

api.get('/movies', async (req, res) => {

    const query_text = req.body.query_text

    try {
        const data = query_text ? await searchMovie(query_text) : []
        const rootTag = loadTemplate(views.VIEW_MOVIE_LIST, { movies: data })
        const response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

api.post('/user/favourite/:movieId', async (req, res) => {
    try {
        const movieId = req.params.movieId
        const title = req.query.title
        const user = req.user

        const movie = await Movie.findOneAndUpdate(
            { movie_id: movieId },
            { movie_id: movieId, title: title },
            { upsert: true, new: true }
        )
        await UserFavourite.findOneAndUpdate(
            { user_id: user, _movie: movie._id },
            { user_id: user, _movie: movie._id },
            { upsert: true, new: true }
        )

        const userFavourites = await UserFavourite.find({ user_id: user }).populate('_movie')
        const rootTag = loadTemplate(views.VIEW_LANDING, { userFavourites: userFavourites })
        const response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

module.exports = api
