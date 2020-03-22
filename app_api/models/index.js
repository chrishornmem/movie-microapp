
const Mongoose = require('mongoose')

const UserFavouriteSchema = new Mongoose.Schema({
    user_id: { type: String, required: true },
    _movie: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true
    },
})

const UserFavourite = Mongoose.model('userfavourites', UserFavouriteSchema)

const MovieSchema = new Mongoose.Schema({
    movie_id: { type: String, required: true },
    title: { type: String, required: true }
})

const Movie = Mongoose.model('movies', MovieSchema)

module.exports = {
    UserFavourite,
    Movie
}
