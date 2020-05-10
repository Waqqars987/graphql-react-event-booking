import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import './Toolbar.css';

const toolbar = props => {
	return (
		<header className='toolbar'>
			<DrawerToggle clicked={props.drawerToggleClicked} />
			<div className='toolbar__logo'>
				<Logo />
			</div>
			<nav className='desktop-only'>
				<NavigationItems isAuthenticated={props.isAuth} />
			</nav>
		</header>
	);
};

export default toolbar;
