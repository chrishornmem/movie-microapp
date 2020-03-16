const jwt = require('jwt-simple')
const express = require('express')
const request = require('request-promise')
const urlJoin = require('url-join')
const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const api = express.Router()

// get this by signing up for an account at https://www.themoviedb.org/
const READ_ACCESS_TOKEN = process.env.READ_ACCESS_TOKEN

if (!READ_ACCESS_TOKEN) throw "themoviedb.org READ_ACCESS_TOKEN not found in environment variables"

const moviedbProps = {
    baseUrl: 'https://api.themoviedb.org',
    baseImagePath: 'http://image.tmdb.org/t/p/w185/'
}

const VIEWS_PATH = './app_api/views/'

const views = {
    VIEW_LANDING: `${VIEWS_PATH}landing.pug`,
    VIEW_MOVIE: `${VIEWS_PATH}movieView.pug`,
}

api.get('/', async (req, res) => {

    try {
        let rootTag = loadTemplate(views.VIEW_LANDING, {})
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

api.get('/movie/:id', async (req, res) => {

    let movieId = req.params.id

    try {
        let data = await request(urlJoin(moviedbProps.baseUrl, `/3/movie/${movieId}`), {
            json: true,
            headers: {
                'Authorization': 'Bearer ' + READ_ACCESS_TOKEN
            }
        })

        if (data.poster_path) {
            data.poster_path = urlJoin(moviedbProps.baseImagePath, data.poster_path)
        }

        let rootTag = loadTemplate(views.VIEW_MOVIE, data)
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'server error' })
    }
})

module.exports = api
