import React from 'react';
import eventLogo from '../../assets/images/event-logo.png';
import './Logo.css';

const logo = props => {
	return (
		<div className='logo' style={{ height: props.height }}>
			<img src={eventLogo} alt='EasyEvent' />
		</div>
	);
};

export default logo;
