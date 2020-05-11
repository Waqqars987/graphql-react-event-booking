import React, { Component } from 'react';

import AuthContext from '../../context/auth-context';
import Alert from '../../components/Alert/Alert';
import Spinner from '../../components/Spinner/Spinner';
import './Auth.css';

class AuthPage extends Component {
	state = {
		isLogin          : true,
		message          : null,
		alert            : false,
		isAuthenticating : false
	};

	static contextType = AuthContext;

	constructor (props) {
		super(props);
		this.emailEl = React.createRef();
		this.passwordEl = React.createRef();
	}

	switchModeHandler = () => {
		this.setState(prevState => {
			return { isLogin: !prevState.isLogin };
		});
	};

	submitHandler = event => {
		event.preventDefault();
		const email = this.emailEl.current.value.trim().toLowerCase();
		const password = this.passwordEl.current.value.trim();

		if (email.trim().length === 0 || password.trim().length === 0) {
			this.setState({ message: 'Please enter the credentials!', alert: true });
			return;
		}

		this.setState({ isAuthenticating: true });
		let requestBody = {
			query     : `
				query Login($email: String!, $password: String!) {
				login(email: $email, password: $password) {
					userId
					token
					tokenExpiration
					}
				}
			`,
			variables : {
				email    : email,
				password : password
			}
		};

		if (!this.state.isLogin) {
			requestBody = {
				query     : `
					mutation CreateUser($email: String!, $password: String!) {
						createUser(userInput: {email: $email, password: $password}) {
							_id 
							email 
							token 
							tokenExpiration
						}
					}
				`,
				variables : {
					email    : email,
					password : password
				}
			};
		}

		fetch('https://graphql-react-event.herokuapp.com/graphql', {
			method  : 'POST',
			body    : JSON.stringify(requestBody),
			headers : {
				'Content-Type' : 'application/json'
			}
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then(resData => {
				this.setState({ isAuthenticating: false });
				if (resData.data.login && resData.data.login.token) {
					this.handleAuthentication(
						resData.data.login.token,
						resData.data.login.userId,
						+resData.data.login.tokenExpiration
					);
				}
				if (resData.data.createUser && resData.data.createUser.token) {
					this.handleAuthentication(
						resData.data.createUser.token,
						resData.data.createUser._id,
						+resData.data.createUser.tokenExpiration
					);
				}
				if (resData.errors) {
					this.setState({ isAuthenticating: false });
					this.setState({ message: resData.errors[0].message.toString(), alert: true });
				}
			})
			.catch(err => {
				console.log(err);
			});
	};

	handleAuthentication (token, userId, tokenExpiration) {
		const expirationDate = new Date(new Date().getTime() + tokenExpiration * 60 * 60 * 1000); //Converting Hours to Milliseconds
		const user = { userId: userId, token: token, expirationDate: expirationDate };
		localStorage.setItem('userData', JSON.stringify(user));
		this.context.login(token, userId, expirationDate);
	}

	alertDismissHandler = () => {
		this.setState({ message: null, alert: false });
	};

	render () {
		let form = (
			<form className='auth-form' onSubmit={this.submitHandler}>
				<div>
					<h1>{this.state.isLogin ? 'Login' : 'Signup'}</h1>
				</div>
				<div className='form-control'>
					<label htmlFor='email'>Email</label>
					<input type='email' id='email' ref={this.emailEl} />
				</div>
				<div className='form-control'>
					<label htmlFor='password'>Password</label>
					<input type='password' id='password' ref={this.passwordEl} />
				</div>
				<div className='form-actions'>
					<button type='submit'>Submit</button>
					<button type='button' onClick={this.switchModeHandler}>
						Switch to {this.state.isLogin ? 'Signup' : 'Login'}
					</button>
				</div>
			</form>
		);
		if (this.state.isAuthenticating) {
			form = <Spinner />;
		}
		return (
			<React.Fragment>
				{this.state.alert && (
					<Alert
						title='Alert'
						open={this.state.alert}
						onConfirm={this.alertDismissHandler}
						confirmText='Dismiss'
					>
						{this.state.message}
					</Alert>
				)}
				<div className='auth-form__container'>{form}</div>
			</React.Fragment>
		);
	}
}

export default AuthPage;
