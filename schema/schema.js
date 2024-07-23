
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
        rate: { type: GraphQLInt },
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
                rate: { type: GraphQLInt },
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
                rate: { type: GraphQLInt },
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
                rate: { type: GraphQLInt },
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





module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

