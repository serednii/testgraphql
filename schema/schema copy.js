// const graphql = require('graphql');

// const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLID, GraphQLInt } = graphql;
// const Movies = require('../models/movie')
// const Directors = require('../models/director')

// const movies_json = [
//     { "name": "Pulp Fiction", "genre": "Crime", "directorId": "6692bc7721386f72ab906275" },
//     { "name": "The Godfather", "genre": "Crime", "directorId": "6692bca221386f72ab913351" },
//     { "name": "The Dark Knight", "genre": "Action", "directorId": "6692bcbf21386f72ab91bde9" },
//     { "name": "12 Angry Men", "genre": "Drama", "directorId": "6692bcda21386f72ab923a34" },
//     { "name": "Schindler's List", "genre": "Biography", "directorId": "6692bcfa21386f72ab92d561" },
//     { "name": "The Lord of the Rings: The Return of the King", "genre": "Fantasy", "directorId": "6692bd1921386f72ab9374a1" },
//     { "name": "Fight Club", "genre": "Drama", "directorId": "6692bd2d21386f72ab93e495" },
//     { "name": "Forrest Gump", "genre": "Drama", "directorId": "6692bd5721386f72ab94c921" },
//     { "name": "Inception", "genre": "Sci-Fi", "directorId": "6692bd7621386f72ab9577f1" },
//     { "name": "The Matrix", "genre": "Sci-Fi", "directorId": "6692bd7621386f72ab9577f1" }
// ]




// directors_json = [
//     { "name": "Quentin Tarantino", "age": 55 },
//     { "name": "Christopher Nolan", "age": 50 },
//     { "name": "Martin Scorsese", "age": 78 },
//     { "name": "Steven Spielberg", "age": 74 },
//     { "name": "Ridley Scott", "age": 83 },

//     { "name": "Francis Ford Coppola", "age": 81 },
//     { "name": "James Cameron", "age": 66 },
//     { "name": "Peter Jackson", "age": 59 },
//     { "name": "David Fincher", "age": 58 },
//     { "name": "Stanley Kubrick", "age": 70 }
// ]

// const movies = [
//     { id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: 1 },
//     { id: 2, name: 'The Godfather', genre: 'Crime', directorId: 2 },
//     { id: '3', name: 'The Dark Knight', genre: 'Action', directorId: 3 },
//     { id: '4', name: '12 Angry Men', genre: 'Drama', directorId: 4 },
//     { id: 5, name: 'Schindler List', genre: 'Biography', directorId: 5 },
//     { id: '6', name: 'The Lord of the Rings: The Return of the King', genre: 'Fantasy', directorId: 6 },
//     { id: '7', name: 'Fight Club', genre: 'Drama', directorId: 7 },
//     { id: 8, name: 'Forrest Gump', genre: 'Drama', directorId: 8 },
//     { id: '9', name: 'Inception', genre: 'Sci-Fi', directorId: 9 },
//     { id: '10', name: 'The Matrix', genre: 'Sci-Fi', directorId: 10 }
// ];

// const directors = [
//     { id: '1', name: 'Quentin Tarantino', age: 55 },
//     { id: '2', name: 'Christopher Nolan', age: 50 },
//     { id: '3', name: 'Martin Scorsese', age: 78 },
//     { id: '4', name: 'Steven Spielberg', age: 74 },
//     { id: '5', name: 'Ridley Scott', age: 83 },
//     { id: '6', name: 'Francis Ford Coppola', age: 81 },
//     { id: '7', name: 'James Cameron', age: 66 },
//     { id: '8', name: 'Peter Jackson', age: 59 },
//     { id: '9', name: 'David Fincher', age: 58 },
//     { id: '10', name: 'Stanley Kubrick', age: 70 }
// ];
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLBoolean } = graphql;
const Movie = require('../models/movie');  // Використовуємо однину
const Director = require('../models/director');  // Використовуємо однину

// Визначення типу Movie
const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: new GraphQLNonNull(GraphQLInt) },
        directorID: { type: GraphQLID },
        director: {
            type: DirectorType,
            resolve({ directorId }, args) {
                return Director.findById(directorId);
            }
        }
    })
});

// Визначення типу Director
const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve({ id }, args) {
                return Movie.find({ directorId: id });
            }
        }
    })
});



const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, { name, age }) {
                const director = new Director({
                    name,
                    age,
                });
                return director.save(); // Повернення збереженого об'єкта
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: new GraphQLNonNull(GraphQLInt) },
                directorId: { type: GraphQLID },
            },
            resolve(parent, { name, genre, watched, rate, directorId }) {
                const movie = new Movie({
                    name,
                    genre,
                    watched,
                    rate,
                    directorId,
                });
                return movie.save(); // Повернення збереженого об'єкта
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Director.findByIdAndDelete(id)
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent, { id }) {
                return Movie.findByIdAndDelete(id)
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, { id, name, age, watched, rate }) {
                return Director.findByIdAndUpdate(
                    args.id,
                    { $set: { id, name, age, watched, rate } }, //set міняє дані на сервері
                    { new: true }, //Дозволяє побачити в відповіді обновлений обєкт
                )
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, { id, name, genre, watched, rate }) {
                return Movie.findByIdAndUpdate(
                    args.id,
                    { $set: { id, name, genre, watched, rate } }, //set міняє дані на сервері
                    { new: true }, //Дозволяє побачити в відповіді обновлений обєкт
                )
            }
        },
    }
});



// Визначення кореневого запиту
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Movie.findById(id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve() {
                return Movie.find({});
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Director.findById(id);
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve() {
                return Director.find({});
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

