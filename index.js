const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// Some fake data
const books = [
  {
    id: "1",
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling'
  },
  {
    id: "2",
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  },
  {
    id: "3",
    title: 'JavaScript: The Good Parts',
    author: 'Peter'
  },
  {
    id: "4",
    title: 'JavaScript Design Pattern',
    author: 'Peter'
  }
];

const authors = [
  {
    id: "1",
    name: "Peter",
    desc: "This is a very good man"
  },
  {
    id: "2",
    name: "J.K. Rowling",
    desc: "AWESOME!!!!"
  },
  {
    id: "3",
    name: "Jurassic Park",
    desc: "How come you don't know this guy?"
  }
]

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
    books: [Book], 
    firstBook: Book, 
    getBook(id: String!): 
    Book authors: [Author]
  }
  type Book { id: String, title: String, author: String }
  type Author { id: String, name: String, desc: String }
`;

// The resolvers
const resolvers = {
  Query: { 
    books() { 
      return books
    },
    firstBook() {
      return books[0]
    },
    getBook(parent, args, context, info) {
      return _.find(books, {id: args.id})
    },
    authors() {
      return authors
    }
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});


/*

GO to localhost:3000/graphql
{
  books {
    id
    title
    author
  }
}
{
  getBook(id: "2") {
    id
    title
    author
  }
}
{
  authors {
    id
    name
    desc
  }
}

*/