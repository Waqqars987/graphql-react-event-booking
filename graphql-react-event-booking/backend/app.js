require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const GraphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorizaton');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});
app.use(isAuth);
app.use(
	'/graphql',
	graphQlHttp({
		schema    : graphQlSchema,
		rootValue : GraphQlResolvers,
		graphiql  : process.env.NODE_ENV !== 'production'
	})
);

app.get('/', (req, res, next) => {
	res.json('GraphQL API is Running...');
});

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env
			.MONGO_PASSWORD}@learningcluster-lo905.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
		{
			useCreateIndex     : true,
			useNewUrlParser    : true,
			useUnifiedTopology : true,
			keepAlive          : 300000,
			connectTimeoutMS   : 30000
		}
	)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Database Connected & Node Server Started...`);
		});
	})
	.catch(err => {
		console.log(err);
	});
