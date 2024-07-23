// const url = 'https://graphqlzero.almansi.me/api'
const url = 'http://localhost:3035/graphql';

const makeRequest = async (query, variables = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const query = `
  query getMovies {
    movies {
      name
      genre
    }
  }
`;

makeRequest(query)
  .then(data => console.log('Query result:', data))
  .catch(error => console.error('Query error:', error));

// makeRequest(`
// query getTodo{
//     todos(options:{}){
//       data{
//         id
//         completed
//       }
//     }
//   }
// `)
//   .then(res => console.log(res))

// makeRequest(`
//     mutation createTodo {
//         createTodo(input: {title: "newTodo", completed: false}){
//           title
//           id
//           completed
//         }
//       }
// `)
//   .then(res => console.log(res))


//   const url = 'https://grahqlzero.almansi.me/api'
// // const url = 'http://localhost:3035/graphql'

// const makeRequest = (query) => {
//   return fetch(url, {
//     method: "POST",
//     headers: {
//       "content-type": "application/json"
//     },
//     body: JSON.stringify({ query })
//   })
//     .then((res) => res.json())
// }






  // makeRequest(`
  // query getTodo{
  //     todos(options:{}){
  //       data{
  //         id
  //         completed
  //       }
  //     }
  //   }
  // `)
  // .then(res => console.log(res))

// makeRequest(`
//     mutation createTodo {
//         createTodo(input: {title: "newTodo", completed: false}){
//           title
//           id
//           completed
//         }
//       }
// `)
//     .then(res => console.log(res))



