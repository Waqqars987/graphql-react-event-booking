import React from 'react';
import './DrawerToggle.css';

const drawerToggle = props => {
	return (
		<div onClick={props.clicked} className='drawer__toggle'>
			<div />
			<div />
			<div />
		</div>
	);
};

export default drawerToggle;
