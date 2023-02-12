const express = require("express");
const path = require("path");
const db = require("./config/connection");
// const routes = require("./routes");

//Create the Apollo server
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3003;

const server= new ApolloServer({
  typeDefs,
  resolvers,
  context:authMiddleware,
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get('/',(req,res)=>{
  app.use(express.static(path.join(__dirname,'../client/')))
})


const startApolloServer=async(typeDefs,resolvers)=>{
  await server.start()
  server.applyMiddleware({app})
  db.once("open", () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
}

startApolloServer(typeDefs,resolvers)

// app.use(routes);


