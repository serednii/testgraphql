// const express = require('express');
// const { graphqlHTTP } = require('express-graphql');
// const schema = require('./schemaLink/schemaLink'); // Убедитесь, что путь правильный
// const mongoose = require('mongoose');
// //Setting buildpack to heroku/nodejs... done
// //https://graphql-test-b55876792bfd.herokuapp.com/ | https://git.heroku.com/graphql-test.git
// const app = express();
// const PORT = 3040;

// const cors = require('cors')
// // mongoose.connect('mongodb+srv://seredniimykola:h5ZgrweHvwejowJY@test.2hvsgym.mongodb.net/graphql-tutorial?retryWrites=true&w=majority&appName=test');
// mongoose.connect('mongodb+srv://seredniimykola:h5ZgrweHvwejowJY@test.2hvsgym.mongodb.net/Link-data?retryWrites=true&w=majority&appName=test'), { useNewUrlParser: true };

// const dbConnection = mongoose.connection;
// dbConnection.on('error', err => console.log(`Connection error: ${err}`));
// dbConnection.once('open', () => {
//     console.log('Connected to DB!');
//     app.use(cors())

//     app.use('/graphql', graphqlHTTP({
//         schema,
//         graphiql: true, // Включення GraphiQL для зручності розробки
//     }));


//     app.listen(PORT, err => {
//         if (err) {
//             console.log('Error:', err);
//         } else {
//             console.log(`Server started on http://localhost:${PORT}/graphql`);
//         }
//     });
// });
