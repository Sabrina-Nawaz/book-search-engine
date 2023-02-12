const { gql } = require("apollo-server-express");
//Questions for TA: Why are some in []? What does the ! mean?
const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book] 
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    profile: User
  }

  input BookInput {
    bookId: String!
    authors: [String]
    image: String
    link: String
    title: String!
    description: String 
  }

  type: Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
}
`;

module.exports = typeDefs;
