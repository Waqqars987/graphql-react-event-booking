import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './containers/Auth/Auth';
import BookingsPage from './containers/Bookings/Bookings';
import EventsPage from './containers/Events/Events';
import Navigation from './components/Navigation/Navigation';
import AuthContext from './context/auth-context';
import Alert from './components/Alert/Alert';
import './App.css';

class App extends Component {
	state = {
		token  : null,
		userId : null,
		alert  : false
	};

	timer = null;

	login = (token, userId, expirationDate) => {
		this.setState({ token: token, userId: userId });
		this.autoLogout(expirationDate.getTime() - new Date().getTime());
	};

	logout = () => {
		localStorage.removeItem('userData');
		this.setState({ token: null, userId: null });
		clearTimeout(this.timer);
	};

	autoLogout = expirationTime => {
		this.timer = setTimeout(() => {
			this.logout();
			this.setState({ alert: true });
		}, expirationTime);
	};

	autoLogin () {
		const user = JSON.parse(localStorage.getItem('userData'));
		if (!user) {
			return;
		}
		const expirationDate = new Date(user.expirationDate);
		if (expirationDate <= new Date()) {
			this.logout();
		} else {
			this.setState({ token: user.token, userId: user.userId });
			this.autoLogout(expirationDate.getTime() - new Date().getTime());
		}
	}

	componentDidMount () {
		this.autoLogin();
	}

	render () {
		return (
			<BrowserRouter>
				<React.Fragment>
					<AuthContext.Provider
						value={{
							token  : this.state.token,
							userId : this.state.userId,
							login  : this.login,
							logout : this.logout
						}}
					>
						{this.state.alert && (
							<Alert
								title='Alert'
								open
								onConfirm={() => this.setState({ alert: false })}
								confirmText='Dismiss'
							>
								You have been Logged Out!
								<br />
								Login Again to Continue.
							</Alert>
						)}
						<Navigation />
						<main className='main-content'>
							<Switch>
								{this.state.token && <Redirect from='/' to='/events' exact />}
								{this.state.token && <Redirect from='/auth' to='/events' exact />}
								{!this.state.token && <Route path='/auth' component={AuthPage} />}
								<Route path='/events' component={EventsPage} />
								{this.state.token && <Route path='/bookings' component={BookingsPage} />}
								{!this.state.token && <Redirect to='/auth' exact />}
							</Switch>
						</main>
					</AuthContext.Provider>
				</React.Fragment>
			</BrowserRouter>
		);
	}
}

export default App;
