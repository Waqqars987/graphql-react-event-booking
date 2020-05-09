import React from 'react';
import './Information.css';

const information = props => {
	return (
		<div className='information__container'>
			<h1 className='information'>{props.children}</h1>
		</div>
	);
};

export default information;
