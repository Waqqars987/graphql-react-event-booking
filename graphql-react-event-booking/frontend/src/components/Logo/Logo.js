import React from 'react';
import { NavLink } from 'react-router-dom';
import './Logo.css';

const logo = props => {
	return (
		<div className='logo'>
			<NavLink to='/'>EasyEvent</NavLink>
		</div>
	);
};

export default logo;
