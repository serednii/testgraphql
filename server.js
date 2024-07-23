const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

// Імпорт моделей
const Movie = require('./models/movie');
const Director = require('./models/director');

const app = express();
const PORT = process.env.PORT || 3040;

// Підключення до MongoDB
mongoose.connect('mongodb+srv://seredniimykola:h5ZgrweHvwejowJY@test.2hvsgym.mongodb.net/Link-data?retryWrites=true&w=majority&appName=test');

// Встановлення обробника подій для підключення до MongoDB
const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => {
    console.log('Connected to DB!');
});

// Використання CORS
app.use(cors());

// Схема GraphQL
const typeDefs = gql`
    type Movie {
        id: ID!
        name: String!
        genre: String!
        watched: Boolean!
        rate: Int
        directorID: ID
        director: Director
    }

    type Director {
        id: ID!
        name: String!
        age: Int!
        movies: [Movie]
    }

    type Query {
        movie(id: ID!): Movie
        movies: [Movie]
        director(id: ID!): Director
        directors: [Director]
    }

    type Mutation {
        addDirector(name: String!, age: Int!): Director
        addMovie(name: String!, genre: String!, watched: Boolean!, rate: Int, directorId: ID): Movie
        deleteDirector(id: ID!): Director
        deleteMovie(id: ID!): Movie
        updateDirector(id: ID!, name: String!, age: Int!): Director
        updateMovie(id: ID!, name: String!, genre: String!, watched: Boolean!, rate: Int): Movie
    }
`;

// Резолвери
const resolvers = {
    Query: {
        movie: async (_, { id }) => {
            try {
                return await Movie.findById(id).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch movie');
            }
        },
        movies: async () => {
            try {
                return await Movie.find({}).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch movies');
            }
        },
        director: async (_, { id }) => {
            try {
                return await Director.findById(id).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch director');
            }
        },
        directors: async () => {
            try {
                return await Director.find({}).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch directors');
            }
        }
    },
    Mutation: {
        addDirector: async (_, { name, age }) => {
            try {
                const director = new Director({ name, age });
                return await director.save();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to add director');
            }
        },
        addMovie: async (_, { name, genre, watched, rate, directorId }) => {
            try {
                const movie = new Movie({ name, genre, watched, rate, directorId });
                return await movie.save();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to add movie');
            }
        },
        deleteDirector: async (_, { id }) => {
            try {
                return await Director.findByIdAndDelete(id).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to delete director');
            }
        },
        deleteMovie: async (_, { id }) => {
            try {
                return await Movie.findByIdAndDelete(id).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to delete movie');
            }
        },
        updateDirector: async (_, { id, name, age }) => {
            try {
                return await Director.findByIdAndUpdate(
                    id,
                    { name, age },
                    { new: true }
                ).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update director');
            }
        },
        updateMovie: async (_, { id, name, genre, watched, rate }) => {
            try {
                return await Movie.findByIdAndUpdate(
                    id,
                    { name, genre, watched, rate },
                    { new: true }
                ).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update movie');
            }
        }
    },
    Movie: {
        director: async (movie) => {
            try {
                return await Director.findById(movie.directorId).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch director');
            }
        }
    },
    Director: {
        movies: async (director) => {
            try {
                return await Movie.find({ directorId: director.id }).exec();
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch movies');
            }
        }
    }
};

// Налаштування Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();
