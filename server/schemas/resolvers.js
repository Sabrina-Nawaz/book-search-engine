// Require the User Model
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { update } = require("../models/User");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      // To see if the user exists
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("password")
          .populate("books");
        return userData;
      }
      throw new AuthenticationError("Need to be logged in!");
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Login credentials are incorrect!");
      }
      const validPassword = await user.isCorrectPassword(password);
      // Checks for valid password
      if (!validPassword) {
        throw new AuthenticationError("Login credentials are incorrect!");
      }
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        ).populate("books");
        return updatedUser;
      }
      throw new AuthenticationError("Please login to save books");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Please login to delete books");
    },
  },
};
module.exports = resolvers;
