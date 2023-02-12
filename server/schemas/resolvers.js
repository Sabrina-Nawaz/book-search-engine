// Require the User Model
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
      user: async (parent, args, context) => {
        // To see if the user exists 
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id }).select("password");
        }
        return userData;
      }
      throw new AuthenticationError("Need to be logged in!");
    },
},
Mutation: 