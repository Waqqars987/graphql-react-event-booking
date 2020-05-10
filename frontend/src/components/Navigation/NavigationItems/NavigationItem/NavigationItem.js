import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationItem.css';

const navigationItem = props => {
	return (
		<li className='navigation-item'>
			<NavLink to={props.link} activeClassName='active'>
				{props.children}
			</NavLink>
		</li>
	);
};

export default navigationItem;
