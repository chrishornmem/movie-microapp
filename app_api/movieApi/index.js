const request = require('request-promise')
const urlJoin = require('url-join')

// get this by signing up for an account at https://www.themoviedb.org/
const READ_ACCESS_TOKEN = process.env.READ_ACCESS_TOKEN

if (!READ_ACCESS_TOKEN) throw "themoviedb.org READ_ACCESS_TOKEN not found in environment variables"

const moviedbProps = {
    baseUrl: 'https://api.themoviedb.org/3/',
    baseImagePath: 'http://image.tmdb.org/t/p/w185/'
}

/**
 * Returns movie details for given id
 * @param {string} movieId unique id of the movie
 * @returns {object} object containing movie details
 */
const getMovie = async (movieId) => {
    try {
        let data = await request(urlJoin(moviedbProps.baseUrl, `/movie/${movieId}`), {
            json: true,
            headers: {
                'Authorization': 'Bearer ' + READ_ACCESS_TOKEN
            }
        })
        if (data.poster_path) {
            data.poster_path = urlJoin(moviedbProps.baseImagePath, data.poster_path)
        }
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}

/**
 * Returns movie details for given id
 * @param {string} searchQuery query text
 * @returns {object} with first page of results
 */
const searchMovie = async (searchQuery) => {
    try {
        let data = await request(urlJoin(moviedbProps.baseUrl, '/search/movie'), {
            qs: { query: searchQuery },
            json: true,
            headers: {
                'Authorization': 'Bearer ' + READ_ACCESS_TOKEN
            }
        })
        return data.results;
    } catch (error) {
        console.log(error)
        throw error
    }

}

module.exports = {
    getMovie,
    searchMovie
}

