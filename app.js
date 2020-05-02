const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const GraphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());
app.use(isAuth);
app.use(
	'/graphql',
	graphQlHttp({
		schema    : graphQlSchema,
		rootValue : GraphQlResolvers,
		graphiql  : true
	})
);

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env
			.MONGO_PASSWORD}@learningcluster-lo905.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		app.listen(3000);
	})
	.catch(err => {
		console.log(err);
	});
