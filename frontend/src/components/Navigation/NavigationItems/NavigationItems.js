import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css';

const navigationItems = props => {
	return (
		<ul className='navigation-items'>
			{!props.isAuthenticated && <NavigationItem link='/auth'>Authenticate</NavigationItem>}
			<NavigationItem link='/events'>Events</NavigationItem>
			{props.isAuthenticated && <NavigationItem link='/bookings'>Bookings</NavigationItem>}
			{props.isAuthenticated && <NavigationItem link='/logout'>Logout</NavigationItem>}
		</ul>
	);
};

export default navigationItems;
