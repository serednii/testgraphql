const express = require('express');
const { ApolloServer, gql } = require('@apollo/server');
const mongoose = require('mongoose');

// Імпорт моделей
const Menu = require('./modelsLink/Menu'); // Переконайтесь, що шлях правильний
const LinkItem = require('./modelsLink/LinkItem'); // Переконайтесь, що шлях правильний

// Оголошення схеми GraphQL
const typeDefs = gql`
  scalar JSON

  type LinkItem {
    id: ID!
    link: String
    name: String!
    idArticle: Int
  }

  type Menu {
    id: ID!
    menu: JSON
  }

  type Query {
    menu: [Menu]
    linkItems: [LinkItem]
    linkItem(id: ID!): LinkItem
  }

  type Mutation {
    updateMenu(id: ID, menu: JSON!): Menu
  }
`;

// Оголошення резолверів
const resolvers = {
    Query: {
        menu: async () => {
            try {
                return await Menu.find({});
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch menu');
            }
        },
        linkItems: async () => {
            try {
                return await LinkItem.find({});
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch link items');
            }
        },
        linkItem: async (_, { id }) => {
            try {
                return await LinkItem.findById(id);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch link item');
            }
        }
    },
    Mutation: {
        updateMenu: async (_, { id, menu }) => {
            try {
                if (id) {
                    return await Menu.findByIdAndUpdate(id, { menu }, { new: true });
                } else {
                    const newMenu = new Menu({ menu });
                    return await newMenu.save();
                }
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update menu');
            }
        }
    }
};

// Підключення до MongoDB
mongoose.connect('mongodb://your-mongodb-uri')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Створення сервера Apollo
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Створіть екземпляр express
const app = express();

const startServer = async () => {
    await server.start();

    server.applyMiddleware({ app });

    app.listen({ port: 3040 }, () =>
        console.log(`Server ready at http://localhost:3040${server.graphqlPath}`)
    );
};

startServer();
