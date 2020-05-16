import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';
import Toolbar from './Toolbar/Toolbar';
import SideDrawer from './SideDrawer/SideDrawer';
import './Navigation.css';

class Navigation extends Component {
	state = {
		sideDrawerVisible : false
	};

	static contextType = AuthContext;

	sideDrawerClosedHandler = () => {
		this.setState({ sideDrawerVisible: false });
	};

	sideDrawerToggleHandler = () => {
		this.setState(prevState => ({ sideDrawerVisible: !prevState.sideDrawerVisible }));
	};

	render () {
		return (
			<React.Fragment>
				<Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} isAuth={this.context.token !== null} />
				<SideDrawer
					open={this.state.sideDrawerVisible}
					closed={this.sideDrawerClosedHandler}
					isAuth={this.context.token !== null}
				/>
			</React.Fragment>
		);
	}
}

export default Navigation;
