import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../../../context/auth-context';
import './NavigationItem.css';

const navigationItem = props => (
	<AuthContext.Consumer>
		{context => {
			return (
				<li className='navigation-item'>
					{!props.button ? (
						<NavLink to={props.link} activeClassName='active'>
							{props.children}
						</NavLink>
					) : (
						<button onClick={context.logout}>{props.children}</button>
					)}
				</li>
			);
		}}
	</AuthContext.Consumer>
);

export default navigationItem;
