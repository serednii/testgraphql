const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');

// Імпорт моделей
const Movie = require('./models/movie');
const Director = require('./models/director');

const app = express();
const PORT = process.env.PORT || 3040;

// Підключення до MongoDB
mongoose.connect('mongodb+srv://seredniimykola:h5ZgrweHvwejowJY@test.2hvsgym.mongodb.net/Link-data?retryWrites=true&w=majority&appName=test', { useNewUrlParser: true, useUnifiedTopology: true });

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
        movie: (_, { id }) => Movie.findById(id),
        movies: () => Movie.find({}),
        director: (_, { id }) => Director.findById(id),
        directors: () => Director.find({})
    },
    Mutation: {
        addDirector: (_, { name, age }) => {
            const director = new Director({ name, age });
            return director.save();
        },
        addMovie: (_, { name, genre, watched, rate, directorId }) => {
            const movie = new Movie({ name, genre, watched, rate, directorId });
            return movie.save();
        },
        deleteDirector: (_, { id }) => Director.findByIdAndDelete(id),
        deleteMovie: (_, { id }) => Movie.findByIdAndDelete(id),
        updateDirector: (_, { id, name, age }) => Director.findByIdAndUpdate(
            id,
            { name, age },
            { new: true }
        ),
        updateMovie: (_, { id, name, genre, watched, rate }) => Movie.findByIdAndUpdate(
            id,
            { name, genre, watched, rate },
            { new: true }
        )
    },
    Movie: {
        director: (movie) => Director.findById(movie.directorId)
    },
    Director: {
        movies: (director) => Movie.find({ directorId: director.id })
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
