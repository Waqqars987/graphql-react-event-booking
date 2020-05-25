import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// import ApolloClient from 'apollo-client';
import LoginForm from '../components/LoginForm';

const LOGIN_USER = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password)
	}
`;

export default function Login () {
	const client = useApolloClient();
	const [ login, { loading, error } ] = useMutation(LOGIN_USER, {
		onCompleted ({ login }) {
			localStorage.setItem('token', login);
			if (login) {
				client.writeData({ data: { isLoggedIn: true } });
			}
		}
	});
	if (loading) return <p>Loading, Please wait.</p>;
	if (error) return <p>An error occurred</p>;
	return (
		<div>
			<LoginForm login={login} />;
		</div>
	);
}
